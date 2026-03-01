"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Megaphone,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/superadmin",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/superadmin/users",
      icon: Users,
      items: [
        { title: "All Users", url: "/superadmin/users" },
        { title: "Permissions", url: "/superadmin/users/permissions" },
      ],
    },
    {
      title: "Service Delivery",
      url: "/superadmin/services",
      icon: Briefcase,
      items: [
        { title: "Services", url: "/superadmin/services" },
        // { title: "Service Config", url: "/superadmin/services" },
      ],
    },
    {
      title: "Content",
      url: "/superadmin/blogs",
      icon: FileText,
      items: [
        { title: "Blog Posts", url: "/superadmin/blogs" },
        { title: "Comments", url: "/superadmin/blogs/comments" },
      ],
    },
    {
      title: "Marketing",
      url: "/superadmin/ads",
      icon: Megaphone,
    },
    {
      title: "Finances",
      url: "/superadmin/payments",
      icon: CreditCard,
    },
    {
      title: "CRM",
      url: "/superadmin/enquiries",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      url: "/superadmin/settings",
      icon: Settings,
    },
  ],
};

import { ThemeToggle } from "@/components/ThemeToggle";

export function SuperAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/superadmin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base">APX Platform</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Super Admin Access
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.items &&
                  item.items.some((subItem) =>
                    pathname.startsWith(subItem.url),
                  ));

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="font-medium"
                  >
                    <a href={item.url}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>

                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-sm font-medium">Theme Options</span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
