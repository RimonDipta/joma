import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import RegisterForm from "./register-form";

export const instant = false;

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  return <RegisterForm />;
}
