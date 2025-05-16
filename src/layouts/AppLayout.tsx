
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function SidebarToggleButton() {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";
  
  if (!collapsed) return null;
  
  return (
    <SidebarTrigger className="fixed left-4 bottom-4 z-50 bg-primary text-white rounded-full shadow-lg p-2">
      <Menu className="h-5 w-5" />
    </SidebarTrigger>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Outlet />
          <SidebarToggleButton />
        </div>
      </div>
    </SidebarProvider>
  );
}
