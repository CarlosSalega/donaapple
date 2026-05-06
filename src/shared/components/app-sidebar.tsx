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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  Settings,
  MessageSquare,
  Tag,
  Smartphone,
  Layers,
  HardDrive,
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
  catalogo: [
    {
      title: "Marcas",
      url: "/admin/catalogo/marcas",
      icon: Tag,
    },
    {
      title: "Categorías",
      url: "/admin/catalogo/categorias",
      icon: Smartphone,
    },
    {
      title: "Modelos",
      url: "/admin/catalogo/modelos",
      icon: Layers,
    },
    {
      title: "Variantes",
      url: "/admin/catalogo/variantes",
      icon: HardDrive,
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
  items?: SidebarNavItem[];
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

  const hasActiveSubItem = (item: SidebarNavItem) => {
    if (!item.items) return false;
    return item.items.some((sub) => pathname.startsWith(sub.url));
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url) || hasActiveSubItem(item);
        const IconComponent = item.icon;

        if (item.items) {
          const isSubMenuOpen = pathname.startsWith(
            item.url.replace("/admin/", "/admin/catalogo/"),
          );

          return (
            <SidebarMenuSub
              key={item.title}
              className={isSubMenuOpen ? "bg-accent" : ""}
            >
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link
                    href={item.url}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-2 ${active ? "text-brand" : "text-muted-foreground"}`}
                  >
                    <IconComponent className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const subActive = isActive(subItem.url);
                    const SubIconComponent = subItem.icon;

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-2 ${subActive ? "text-brand bg-accent" : "text-muted-foreground"}`}
                          >
                            <SubIconComponent className="size-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          );
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                onClick={handleLinkClick} // 👈
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
          <div className="pl-4">
            <SidebarNav items={adminNav.main} />
          </div>
        </div>
        <div className="px-2">
          <div className="text-muted-foreground mb-2 px-2 text-xs font-medium">
            Catálogo
          </div>
          <div className="pl-4">
            <SidebarNav items={adminNav.catalogo} />
          </div>
        </div>
        <div className="px-2">
          <div className="text-muted-foreground mb-2 px-2 text-xs font-medium">
            Sistema
          </div>
          <div className="pl-4">
            <SidebarNav items={adminNav.secondary} />
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t"></div>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
