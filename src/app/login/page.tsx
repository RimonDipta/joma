import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import LoginForm from "./login-form";

export const instant = false;

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  return <LoginForm />;
}
