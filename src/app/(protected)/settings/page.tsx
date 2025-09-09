import { getCurrentUser } from "@/services/user";
import { notFound } from "next/navigation";
import Settings from "@/app/(protected)/settings/Settings";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) return notFound();

  return <Settings user={user} />;
}
