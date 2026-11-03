import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Wallet } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AccountsClient from "./accounts-client";

export const instant = false;

export default async function AccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [accounts, currencies] = await Promise.all([
    prisma.financialAccount.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      include: {
        currency: {
          select: {
            code: true,
            name: true,
            symbol: true,
            decimalDigits: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.currency.findMany({
      where: {
        isActive: true,
      },
      select: {
        code: true,
        name: true,
        symbol: true,
        decimalDigits: true,
      },
      orderBy: {
        code: "asc",
      },
    }),
  ]);

  const serializedAccounts = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    currencyCode: account.currencyCode,
    openingBalance: account.openingBalance.toString(),
    institution: account.institution,
    color: account.color,
    currency: account.currency,
  }));

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-zinc-100 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-lime-300">
            <Wallet size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your accounts
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your cash, bank accounts and wallets.
            </p>
          </div>
        </div>

        <AccountsClient
          initialAccounts={serializedAccounts}
          currencies={currencies}
        />
      </div>
    </main>
  );
}
