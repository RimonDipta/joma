import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const accountTypes = [
  "CASH",
  "BANK",
  "MOBILE_WALLET",
  "CREDIT_CARD",
  "INVESTMENT",
  "OTHER",
] as const;

// Decimal(19, 4) supports up to 15 integer digits
// and 4 fractional digits.
const accountSchema = z.object({
  name: z.string().trim().min(2).max(80),
  type: z.enum(accountTypes),
  currencyCode: z.string().length(3).toUpperCase(),
  openingBalance: z
    .string()
    .trim()
    .regex(
      /^-?\d{1,15}(\.\d{1,4})?$/,
      "Enter a valid amount with up to 4 decimal places.",
    ),
  institution: z.string().trim().max(80).optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .or(z.literal("")),
});

const accountSelect = {
  id: true,
  name: true,
  type: true,
  currencyCode: true,
  openingBalance: true,
  institution: true,
  color: true,
  isArchived: true,
  createdAt: true,
  currency: {
    select: {
      code: true,
      name: true,
      symbol: true,
      decimalDigits: true,
    },
  },
} satisfies Prisma.FinancialAccountSelect;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const accounts = await prisma.financialAccount.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      select: accountSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      accounts: accounts.map((account) => ({
        ...account,
        openingBalance: account.openingBalance.toString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/accounts failed:", error);

    return NextResponse.json(
      { message: "Unable to retrieve accounts." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = accountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Invalid account data.",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const currency = await prisma.currency.findUnique({
      where: {
        code: data.currencyCode,
        isActive: true,
      },
      select: {
        code: true,
      },
    });

    if (!currency) {
      return NextResponse.json(
        { message: "The selected currency is unavailable." },
        { status: 400 },
      );
    }

    const account = await prisma.financialAccount.create({
      data: {
        userId: session.user.id,
        name: data.name,
        type: data.type,
        currencyCode: currency.code,
        openingBalance: new Prisma.Decimal(data.openingBalance),
        institution: data.institution || null,
        color: data.color || null,
      },
      select: accountSelect,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        account: {
          ...account,
          openingBalance: account.openingBalance.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "An account with this name already exists." },
        { status: 409 },
      );
    }

    console.error("POST /api/accounts failed:", error);

    return NextResponse.json(
      { message: "Unable to create account." },
      { status: 500 },
    );
  }
}
