import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function UsersPage() {
  redirect(routes.dashboard.usersAssures);
}
