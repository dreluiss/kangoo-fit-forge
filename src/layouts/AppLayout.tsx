
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function AppLayout() {
  return (
    <SidebarProvider defaultCollapsed={false} collapsedWidth={64}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
