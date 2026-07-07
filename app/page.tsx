import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { roleHome } from "@/lib/permissions";

export default async function HomePage() {
  const user = await getSessionUser();
  redirect(user ? roleHome[user.role] : "/login");
}
