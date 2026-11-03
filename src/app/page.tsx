import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import DashboardClient from "./dashboard-client";

export const instant = false;

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardClient
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
    />
  );
}
