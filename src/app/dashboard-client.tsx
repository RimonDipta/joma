"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Ellipsis,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Target,
  TrendingUp,
  Wallet,
  X,
  Utensils,
  Car,
  Laptop,
  House,
  LogOut,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  icon: typeof ShoppingBag;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    name: "Monthly salary",
    category: "Salary",
    date: "Nov 02, 2026",
    amount: 65000,
    type: "income",
    icon: Laptop,
  },
  {
    id: 2,
    name: "Grocery shopping",
    category: "Food & Dining",
    date: "Nov 02, 2026",
    amount: 1850,
    type: "expense",
    icon: ShoppingBag,
  },
  {
    id: 3,
    name: "Apartment rent",
    category: "Housing",
    date: "Nov 01, 2026",
    amount: 12000,
    type: "expense",
    icon: House,
  },
  {
    id: 4,
    name: "Ride share",
    category: "Transportation",
    date: "Oct 31, 2026",
    amount: 320,
    type: "expense",
    icon: Car,
  },
  {
    id: 5,
    name: "Freelance project",
    category: "Freelance",
    date: "Oct 30, 2026",
    amount: 8500,
    type: "income",
    icon: Laptop,
  },
  {
    id: 6,
    name: "Restaurant",
    category: "Food & Dining",
    date: "Oct 29, 2026",
    amount: 950,
    type: "expense",
    icon: Utensils,
  },
];

const cashFlow = [
  { month: "May", income: 42000, expenses: 25000 },
  { month: "Jun", income: 52000, expenses: 31000 },
  { month: "Jul", income: 47000, expenses: 29000 },
  { month: "Aug", income: 61000, expenses: 36000 },
  { month: "Sep", income: 56000, expenses: 33000 },
  { month: "Oct", income: 59000, expenses: 38000 },
  { month: "Nov", income: 65000, expenses: 14200 },
];

const initialBudgets = [
  {
    name: "Food & Dining",
    spent: 6800,
    limit: 10000,
    color: "bg-lime-400",
    icon: Utensils,
  },
  {
    name: "Transportation",
    spent: 2100,
    limit: 5000,
    color: "bg-sky-400",
    icon: Car,
  },
  {
    name: "Housing",
    spent: 12000,
    limit: 15000,
    color: "bg-violet-400",
    icon: House,
  },
  {
    name: "Shopping",
    spent: 3200,
    limit: 6000,
    color: "bg-amber-400",
    icon: ShoppingBag,
  },
];

const initialGoals = [
  { name: "New laptop", saved: 42000, target: 80000 },
  { name: "Emergency fund", saved: 18000, target: 50000 },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Budgets", icon: Target },
  { label: "Accounts", icon: Wallet },
  { label: "Reports", icon: FileText },
];

const money = (amount: number, currency = "BDT") =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-zinc-100">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-800/90 bg-[#111113] p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function DashboardChart() {
  return (
    <div className="h-[255px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={cashFlow}
          margin={{ top: 12, right: 2, left: -22, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a3e635" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#27272a"
            strokeDasharray="4 5"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 10 }}
            tickFormatter={(value: number) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 12,
              color: "#fafafa",
              fontSize: 12,
            }}
            formatter={(value) => money(Number(value))}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#a3e635"
            strokeWidth={2}
            fill="url(#incomeFill)"
            activeDot={{ r: 4, fill: "#a3e635" }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#818cf8"
            strokeWidth={2}
            fill="url(#expenseFill)"
            activeDot={{ r: 4, fill: "#818cf8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type DashboardClientProps = {
  userName: string;
  userEmail: string;
};

export default function Home({ userName, userEmail }: DashboardClientProps) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [currency, setCurrency] = useState("BDT");
  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");

  const visibleTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesQuery = `${transaction.name} ${transaction.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesType =
        transactionType === "all" || transaction.type === transactionType;

      return matchesQuery && matchesType;
    });
  }, [transactions, query, transactionType]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 },
    );
  }, [transactions]);

  const balance = 84500 + totals.income - 73500 - totals.expenses;
  const savings = totals.income - totals.expenses;

  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(newAmount);
    if (!newName.trim() || !Number.isFinite(amount) || amount <= 0) return;

    setTransactions((current) => [
      {
        id: Date.now(),
        name: newName.trim(),
        category: "Other",
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(new Date()),
        amount,
        type: newType,
        icon: newType === "income" ? Laptop : ShoppingBag,
      },
      ...current,
    ]);

    setNewName("");
    setNewAmount("");
    setShowAddForm(false);
  }

  const currencyOptions = [
    { value: "BDT", label: "BDT (à§³)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (â‚¬)" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-zinc-800/80 bg-[#0d0d0f] transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-zinc-800/80 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-zinc-950">
            <Wallet size={20} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">
              joma<span className="text-lime-400">.</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Personal finance
            </p>
          </div>
          <button
            className="ml-auto rounded-lg p-1 text-zinc-400 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  activeNav === label
                    ? "bg-lime-400/10 font-medium text-lime-300"
                    : "text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200"
                }`}
              >
                <Icon size={17} />
                {label}
                {label === "Transactions" && (
                  <span className="ml-auto rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                    {transactions.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-4 mt-8 border-t border-zinc-800/80 pt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Preferences
          </p>
          <button
            onClick={() => setActiveNav("Settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
              activeNav === "Settings"
                ? "bg-lime-400/10 text-lime-300"
                : "text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200"
            }`}
          >
            <Settings2 size={17} /> Settings
          </button>
          <button
            onClick={() => setActiveNav("Help")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200"
          >
            <CircleHelp size={17} /> Help & support
          </button>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#131315] p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-300">
                <Target size={17} />
              </div>
              <span className="text-xs font-medium text-zinc-200">
                Savings goal
              </span>
            </div>
            <p className="text-xs text-zinc-500">Emergency fund</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <span className="text-lg font-semibold">
                {money(18000, currency)}
              </span>
              <span className="text-[10px] text-lime-300">36%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[36%] rounded-full bg-lime-400" />
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">
              Target: {money(50000, currency)}
            </p>
          </div>

          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setAccountMenuOpen((open) => !open)}
              aria-expanded={accountMenuOpen}
              aria-label="Open account menu"
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-zinc-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-sm font-semibold text-lime-300">
                {userName.trim().charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-200">
                  {userName}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  {userEmail || "Personal account"}
                </p>
              </div>
              <Ellipsis size={17} className="shrink-0 text-zinc-500" />
            </button>

            {accountMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 z-[60] mb-2 overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b] shadow-xl">
                <div className="border-b border-zinc-800 px-4 py-3">
                  <p className="truncate text-xs font-medium text-zinc-200">
                    {userName}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-zinc-500">
                    {userEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ redirectTo: "/login" })}
                  className="flex w-full items-center gap-3 px-4 py-3 text-xs text-rose-400 transition hover:bg-rose-500/10"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="min-h-screen md:ml-[248px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-zinc-800/80 bg-[#09090b]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open navigation"
              className="rounded-lg border border-zinc-800 p-2 text-zinc-400 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={19} />
            </button>
            <div>
              <p className="text-sm font-semibold">{activeNav}</p>
              <p className="mt-0.5 hidden text-[11px] text-zinc-500 sm:block">
                Monday, November 2, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 sm:flex">
              <Wallet size={15} className="text-zinc-500" />
              <span className="sr-only">Display currency</span>
              <select
                aria-label="Display currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="max-w-[112px] bg-transparent text-xs text-zinc-300 outline-none"
              >
                {currencyOptions.map((option) => (
                  <option
                    className="bg-zinc-900"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              aria-label="Search transactions"
              onClick={() =>
                document.getElementById("transaction-search")?.focus()
              }
              className="rounded-xl border border-zinc-800 p-2.5 text-zinc-400 hover:bg-zinc-900"
            >
              <Search size={17} />
            </button>
            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-zinc-800 p-2.5 text-zinc-400 hover:bg-zinc-900"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-400" />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 rounded-xl bg-lime-400 px-3 py-2.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-lime-300 sm:px-4"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-zinc-300">{activeNav}</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Financial overview<span className="text-lime-400">.</span>
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                Here&apos;s what&apos;s happening with your money.
              </p>
            </div>
            <button
              onClick={() =>
                setPeriod(period === "This month" ? "Last month" : "This month")
              }
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900"
            >
              <CalendarDays size={15} className="text-zinc-500" />
              {period}
              <ChevronDown size={14} className="text-zinc-500" />
            </button>
          </div>

          <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-5 text-amber-200/80">
            Demo dashboard â€” all financial figures are sample data. Adding a
            transaction only changes this page&apos;s temporary in-memory state.
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Panel className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-lime-400/[0.06] blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Total balance</span>
                <span className="rounded-lg border border-lime-400/15 bg-lime-400/10 p-2 text-lime-300">
                  <Wallet size={17} />
                </span>
              </div>
              <p className="mt-5 text-2xl font-semibold tracking-tight">
                {money(balance, currency)}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                <TrendingUp size={13} className="text-lime-300" />
                <span className="text-lime-300">Across your accounts</span>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Total income</span>
                <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/10 p-2 text-emerald-300">
                  <ArrowDownLeft size={17} />
                </span>
              </div>
              <p className="mt-5 text-2xl font-semibold tracking-tight">
                {money(totals.income, currency)}
              </p>
              <p className="mt-3 text-[11px] text-zinc-500">
                Recorded income Â· Demo data
              </p>
            </Panel>

            <Panel>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Total expenses</span>
                <span className="rounded-lg border border-rose-400/15 bg-rose-400/10 p-2 text-rose-300">
                  <ArrowUpRight size={17} />
                </span>
              </div>
              <p className="mt-5 text-2xl font-semibold tracking-tight">
                {money(totals.expenses, currency)}
              </p>
              <p className="mt-3 text-[11px] text-zinc-500">
                Recorded expenses Â· Demo data
              </p>
            </Panel>

            <Panel>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Net cash flow</span>
                <span className="rounded-lg border border-sky-400/15 bg-sky-400/10 p-2 text-sky-300">
                  <CreditCard size={17} />
                </span>
              </div>
              <p
                className={`mt-5 text-2xl font-semibold tracking-tight ${savings >= 0 ? "text-lime-300" : "text-rose-300"}`}
              >
                {savings < 0 ? "âˆ’" : "+"}
                {money(Math.abs(savings), currency)}
              </p>
              <p className="mt-3 text-[11px] text-zinc-500">
                Income minus expenses
              </p>
            </Panel>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(310px,1fr)]">
            <Panel>
              <SectionTitle
                title="Cash flow"
                description="Income versus expenses over time"
                action={
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-lime-400" />{" "}
                      Income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />{" "}
                      Expenses
                    </span>
                  </div>
                }
              />
              <DashboardChart />
            </Panel>

            <Panel>
              <SectionTitle
                title="Budget overview"
                description="Your spending against category limits"
                action={
                  <button
                    onClick={() => setActiveNav("Budgets")}
                    className="text-xs text-lime-300 hover:text-lime-200"
                  >
                    View all
                  </button>
                }
              />
              <div className="space-y-6">
                {initialBudgets.map((budget) => {
                  const Icon = budget.icon;
                  const percentage = Math.round(
                    (budget.spent / budget.limit) * 100,
                  );
                  return (
                    <div key={budget.name}>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-lg bg-zinc-800/80 p-2 text-zinc-400">
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-zinc-200">
                            {budget.name}
                          </p>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            {money(budget.spent, currency)} of{" "}
                            {money(budget.limit, currency)}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-400">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${budget.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveNav("Budgets")}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
              >
                <Plus size={14} /> Create a budget
              </button>
            </Panel>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(310px,1fr)]">
            <Panel>
              <SectionTitle
                title="Recent transactions"
                description={`${visibleTransactions.length} transactions shown`}
                action={
                  <button
                    onClick={() => setActiveNav("Transactions")}
                    className="text-xs text-lime-300 hover:text-lime-200"
                  >
                    View all
                  </button>
                }
              />

              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5">
                  <Search size={15} className="shrink-0 text-zinc-500" />
                  <input
                    id="transaction-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search transactions..."
                    className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-zinc-600"
                  />
                </div>
                <label className="flex items-center gap-2 rounded-xl border border-zinc-800 px-3 py-2.5 text-xs text-zinc-400">
                  <Filter size={14} />
                  <span className="sr-only">Filter transaction type</span>
                  <select
                    aria-label="Filter transaction type"
                    value={transactionType}
                    onChange={(event) => setTransactionType(event.target.value)}
                    className="bg-transparent outline-none"
                  >
                    <option className="bg-zinc-900" value="all">
                      All types
                    </option>
                    <option className="bg-zinc-900" value="income">
                      Income
                    </option>
                    <option className="bg-zinc-900" value="expense">
                      Expenses
                    </option>
                  </select>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-600">
                      <th className="pb-3 font-medium">Transaction</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTransactions.map((transaction) => {
                      const Icon = transaction.icon;
                      return (
                        <tr
                          key={transaction.id}
                          className="border-b border-zinc-800/60 last:border-0"
                        >
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400">
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-200">
                                  {transaction.name}
                                </p>
                                <p className="mt-1 text-[10px] text-zinc-500">
                                  {transaction.category}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-[11px] text-zinc-500">
                            {transaction.date}
                          </td>
                          <td
                            className={`py-4 text-right text-xs font-semibold whitespace-nowrap ${transaction.type === "income" ? "text-lime-300" : "text-zinc-300"}`}
                          >
                            {transaction.type === "income" ? "+" : "âˆ’"}
                            {money(transaction.amount, currency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {visibleTransactions.length === 0 && (
                  <div className="py-10 text-center text-xs text-zinc-500">
                    No matching transactions found.
                  </div>
                )}
              </div>
            </Panel>

            <Panel>
              <SectionTitle
                title="Savings goals"
                description="Progress toward your financial targets"
                action={<Target size={17} className="text-zinc-500" />}
              />
              <div className="space-y-6">
                {initialGoals.map((goal) => {
                  const percentage = Math.round(
                    (goal.saved / goal.target) * 100,
                  );
                  return (
                    <div
                      key={goal.name}
                      className="rounded-xl border border-zinc-800/80 p-4"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-lime-400/10 p-2.5 text-lime-300">
                          <Target size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium">{goal.name}</p>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            Savings target
                          </p>
                        </div>
                        <span className="text-xs font-medium text-lime-300">
                          {percentage}%
                        </span>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium">
                          {money(goal.saved, currency)}
                        </span>
                        <span className="text-zinc-500">
                          {money(goal.target, currency)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-lime-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveNav("Savings goals")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
              >
                <Plus size={14} /> Add savings goal
              </button>
            </Panel>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 py-5 text-[10px] text-zinc-600">
            <span>Joma Finance Â· Demo environment</span>
            <span>Personal finance, made clearer.</span>
          </footer>
        </div>
      </main>

      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={addTransaction}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Add transaction</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Enter a demo transaction.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <label
              className="mb-2 block text-xs text-zinc-400"
              htmlFor="new-name"
            >
              Description
            </label>
            <input
              id="new-name"
              required
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="e.g. Electricity bill"
              className="mb-5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm outline-none focus:border-lime-400/60"
            />
            <label
              className="mb-2 block text-xs text-zinc-400"
              htmlFor="new-amount"
            >
              Amount ({currency})
            </label>
            <input
              id="new-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={newAmount}
              onChange={(event) => setNewAmount(event.target.value)}
              placeholder="0.00"
              className="mb-5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm outline-none focus:border-lime-400/60"
            />
            <label
              className="mb-2 block text-xs text-zinc-400"
              htmlFor="new-type"
            >
              Transaction type
            </label>
            <select
              id="new-type"
              value={newType}
              onChange={(event) =>
                setNewType(event.target.value as "income" | "expense")
              }
              className="mb-6 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-sm font-semibold text-zinc-950 hover:bg-lime-300"
            >
              <Plus size={16} /> Save demo transaction
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
