import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Phone,
  FolderOpen,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Call Scripts", url: "/call-script", icon: Phone },
  { title: "Proposals", url: "/proposals", icon: FolderOpen },
  { title: "Generate", url: "/generate", icon: FileText },
  { title: "Settings", url: "/profile", icon: Settings },
];

export default function Dashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <Sidebar className="border-r border-border">
            <SidebarContent className="pt-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                        >
                          <Link
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                              isActive(item.url)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold">
                {sidebarItems.find((item) => isActive(item.url))?.title || "Dashboard"}
              </h1>
            </div>
            
            <DashboardOverview />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link
        to="/leads"
        className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <Users className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold text-lg">Leads</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your DM conversations and track lead qualification
        </p>
      </Link>

      <Link
        to="/call-script"
        className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <Phone className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold text-lg">Call Scripts</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Generate NEPQ-style scripts for sales calls
        </p>
      </Link>

      <Link
        to="/proposals"
        className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <FolderOpen className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold text-lg">Proposals</h3>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your saved proposals
        </p>
      </Link>

      <Link
        to="/generate"
        className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <FileText className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold text-lg">New Proposal</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Generate a new client proposal with AI
        </p>
      </Link>

      <Link
        to="/profile"
        className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <Settings className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold text-lg">Settings</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and business profile
        </p>
      </Link>
    </div>
  );
}
