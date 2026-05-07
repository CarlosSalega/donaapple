"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/shared/components/ui/logo";
import { NavUser } from "@/shared/components/nav-user";
import {
  useSidebar,
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
  Settings,
  MessageSquare,
} from "lucide-react";

const adminNav = {
  main: [
    {
      title: "Panel",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Productos",
      url: "/admin/productos",
      icon: Package,
    },
  ],
  secondary: [
    {
      title: "Configuración",
      url: "/admin/config",
      icon: Settings,
    },
    {
      title: "Testimonios",
      url: "/admin/testimonios",
      icon: MessageSquare,
    },
  ],
};

interface SidebarNavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => setOpenMobile(false);

  const isActive = (url: string) => {
    if (url === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url);
        const IconComponent = item.icon;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 ${active ? "bg-accent text-brand border" : ""}`}
              >
                <IconComponent
                  className={`size-4 ${active ? "text-brand" : "text-muted-foreground"}`}
                />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
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
      <SidebarContent className="flex flex-col gap-2">
        <div className="px-2">
          <div className="text-muted-foreground mb-2 px-2 text-xs font-medium">
            Principal
          </div>
          <SidebarNav items={adminNav.main} />
        </div>
        <div className="px-2">
          <div className="text-muted-foreground mb-2 px-2 text-xs font-medium">
            Sistema
          </div>
          <SidebarNav items={adminNav.secondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t"></div>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
