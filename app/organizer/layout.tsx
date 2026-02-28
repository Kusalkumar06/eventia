import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import { requireAuth } from "@/lib/auth-guards";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <OrganizerLayout
      user={{ name: session.user.name, email: session.user.email }}
    >
      {children}
    </OrganizerLayout>
  );
}
