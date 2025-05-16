import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChartBar, Dumbbell, User, Plus, Calendar, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { KangooMascot } from "./kangoo-mascot";

export function AppSidebar() {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  // Main navigation items
  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: ChartBar },
    { title: "Meus Treinos", url: "/workouts", icon: Dumbbell },
    { title: "Exercícios", url: "/exercises", icon: Plus },
    { title: "Calendário", url: "/calendar", icon: Calendar },
    { title: "Perfil", url: "/profile", icon: User },
  ];

  // Check if path is active
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);
  
  // Keep groups expanded if they contain the active route
  const isDashboardActive = navItems.slice(0, 2).some((item) => isActive(item.url));
  const isWorkoutActive = navItems.slice(2, 4).some((item) => isActive(item.url));
  const isProfileActive = isActive(navItems[4].url);
  
  // Helper for nav link classes - making colors more visible in light mode
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/90 dark:text-sidebar-foreground";

  return (
    <Sidebar
      className={cn(
        "border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className={cn(
        "flex items-center h-14 px-4 border-b",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/e7a0f49c-67f9-4534-87fc-f47996238d73.png" 
                alt="KangoFit" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KangoFit
            </span>
          </div>
        )}
        {collapsed && <KangooMascot variant="small" />}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        {/* Dashboard & Workouts */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(0, 2).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={getNavCls}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Exercise & Calendar */}
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(2, 4).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile */}
        <SidebarGroup>
          <SidebarGroupLabel>Usuário</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(4).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Kangoo at bottom if not collapsed */}
      {!collapsed && (
        <div className="mt-auto p-4 border-t">
          <KangooMascot variant="small" className="flex-row gap-3 justify-start" />
        </div>
      )}
    </Sidebar>
  );
}

// Helper function for conditionally joining classNames
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
