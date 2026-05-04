"use client";

import * as React from "react";
import Link from "next/link";

import { Logo } from "@/shared/components/ui/logo";
import { NavUser } from "@/shared/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  Plus,
  Settings,
} from "lucide-react";

const adminNav = {
  main: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Productos",
      url: "/admin/productos",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Nuevo Producto",
      url: "/admin/productos/nuevo",
      icon: <Plus className="h-4 w-4" />,
    },
  ],
  secondary: [
    {
      title: "Configuración",
      url: "/admin/config",
      icon: <Settings className="h-4 w-4" />,
    },
  ],
};

interface SidebarNavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={item.url} className="flex items-center gap-3">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar({ 
  user, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar?: string
  } | null
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex h-16 items-center">
            <SidebarMenuButton
              asChild
              className="h-full data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4">
        <div className="px-2">
          <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Principal
          </div>
          <SidebarNav items={adminNav.main} />
        </div>
        <div className="px-2">
          <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Sistema
          </div>
          <SidebarNav items={adminNav.secondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
