import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { roleHome } from "@/lib/permissions";
import { LoginContent } from "./login-content";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(roleHome[user.role]);
  }

  return <LoginContent />;
}
