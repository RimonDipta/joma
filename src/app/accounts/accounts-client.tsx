"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  Banknote,
  Building2,
  CreditCard,
  Plus,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";

const accountTypes = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "BANK", label: "Bank account", icon: Building2 },
  { value: "MOBILE_WALLET", label: "Mobile wallet", icon: Smartphone },
  { value: "CREDIT_CARD", label: "Credit card", icon: CreditCard },
  { value: "INVESTMENT", label: "Investment", icon: TrendingUp },
  { value: "OTHER", label: "Other", icon: Wallet },
] as const;

type AccountType = (typeof accountTypes)[number]["value"];

type Currency = {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
};

type FinancialAccount = {
  id: string;
  name: string;
  type: AccountType;
  currencyCode: string;
  openingBalance: string;
  institution: string | null;
  color: string | null;
  currency: Currency;
};

type Props = {
  initialAccounts: FinancialAccount[];
  currencies: Currency[];
};

const money = (amount: string, currencyCode: string) => {
  const value = Number(amount);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 4,
  }).format(value);
};

export default function AccountsClient({ initialAccounts, currencies }: Props) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("CASH");
  const [currencyCode, setCurrencyCode] = useState("BDT");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [institution, setInstitution] = useState("");
  const [color, setColor] = useState("#a3e635");

  const totalAccounts = accounts.length;

  function resetForm() {
    setName("");
    setType("CASH");
    setCurrencyCode("BDT");
    setOpeningBalance("0");
    setInstitution("");
    setColor("#a3e635");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          currencyCode,
          openingBalance,
          institution,
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      setAccounts((current) => [data.account, ...current]);
      setSuccess("Account created successfully.");
      resetForm();
      setShowForm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
          <p className="text-sm text-zinc-500">Total accounts</p>
          <p className="mt-3 text-3xl font-semibold">{totalAccounts}</p>
          <p className="mt-2 text-xs text-zinc-600">
            Your active financial accounts
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
          <p className="text-sm text-zinc-500">Account types</p>
          <p className="mt-3 text-3xl font-semibold">
            {new Set(accounts.map((account) => account.type)).size}
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            Different types of accounts in use
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">All accounts</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Accounts are private to your user profile.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowForm((current) => !current);
          }}
          className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300"
        >
          <Plus size={17} />
          Add account
        </button>
      </div>

      {success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111113] p-5 sm:p-7"
        >
          <div>
            <h3 className="text-base font-semibold">Create an account</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Add a financial account to start tracking its balance.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="account-name"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Account name
              </label>
              <input
                id="account-name"
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Personal savings"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-lime-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="account-type"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Account type
              </label>
              <select
                id="account-type"
                value={type}
                onChange={(event) => setType(event.target.value as AccountType)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-lime-400/60"
              >
                {accountTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="account-currency"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Currency
              </label>
              <select
                id="account-currency"
                value={currencyCode}
                onChange={(event) => setCurrencyCode(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-lime-400/60"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="opening-balance"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Opening balance
              </label>
              <input
                id="opening-balance"
                type="number"
                step="0.0001"
                required
                value={openingBalance}
                onChange={(event) => setOpeningBalance(event.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-lime-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="institution"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Bank or institution (optional)
              </label>
              <input
                id="institution"
                maxLength={80}
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                placeholder="e.g. BRAC Bank"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-lime-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="account-color"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Account color
              </label>
              <input
                id="account-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-1"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="rounded-xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => {
          const accountType = accountTypes.find(
            (item) => item.value === account.type,
          );

          const Icon = accountType?.icon ?? Wallet;

          return (
            <article
              key={account.id}
              className="rounded-2xl border border-zinc-800 bg-[#111113] p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: `${account.color ?? "#a3e635"}20`,
                    color: account.color ?? "#a3e635",
                  }}
                >
                  <Icon size={21} />
                </div>

                <span className="rounded-lg border border-zinc-800 px-2.5 py-1 text-[10px] text-zinc-500">
                  {account.type.replaceAll("_", " ")}
                </span>
              </div>

              <h3 className="mt-5 truncate text-base font-semibold">
                {account.name}
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                {account.institution || account.currency.name}
              </p>

              <div className="mt-6 border-t border-zinc-800 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Opening balance
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight">
                  {money(account.openingBalance, account.currencyCode)}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
            <Wallet size={25} />
          </div>

          <h3 className="mt-5 text-base font-semibold">No accounts yet</h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
            Create your first account to start organizing your finances.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-lime-300"
          >
            <Plus size={16} />
            Create your first account
          </button>
        </div>
      )}
    </div>
  );
}
