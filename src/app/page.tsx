import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";

import DashboardClient from "./dashboard-client";

export const instant = false;

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/login",
          });
        }}
        className="fixed right-6 top-6 z-50"
      >
        <button
          type="submit"
          className="rounded-lg border border-white/10 bg-[#18181b] px-4 py-2 text-sm font-medium text-zinc-300 shadow-lg transition hover:border-red-500/30 hover:text-red-400"
        >
          Sign out
        </button>
      </form>

      <DashboardClient />
    </>
  );
}
