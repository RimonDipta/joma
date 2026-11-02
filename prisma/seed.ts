import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const currencies = [
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", decimalDigits: 2 },
  { code: "USD", name: "US Dollar", symbol: "$", decimalDigits: 2 },
  { code: "EUR", name: "Euro", symbol: "€", decimalDigits: 2 },
  { code: "GBP", name: "British Pound", symbol: "£", decimalDigits: 2 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", decimalDigits: 2 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimalDigits: 0 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimalDigits: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimalDigits: 2 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimalDigits: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimalDigits: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", decimalDigits: 2 },
];

async function main() {
  console.log("Seeding currencies...");

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {
        name: currency.name,
        symbol: currency.symbol,
        decimalDigits: currency.decimalDigits,
        isActive: true,
      },
      create: currency,
    });

    console.log(`✓ ${currency.code} - ${currency.name}`);
  }

  console.log(`Successfully seeded ${currencies.length} currencies.`);
}

main()
  .catch((error: unknown) => {
    console.error("Currency seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
