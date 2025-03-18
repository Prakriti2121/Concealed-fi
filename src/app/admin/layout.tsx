import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/AppSidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  // If there's no active session, redirect to the home page
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <SidebarProvider>
        <div className="relative">
          <AppSidebar />
          <div className="absolute right-12 top-0">
            <SidebarTrigger />
          </div>
        </div>

        <div>{children}</div>
      </SidebarProvider>
    </div>
  );
}
