import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { SearchForm } from "@/components/search-form";
// import { RippleButton } from "./magicui/ripple-button";
import { ChevronLeft } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation items
const data = {
  navMain: [
    {
      title: "Manage Users",
      url: "/dashboard/manage-users",
    },
    {
      title: "Manage Orders",
      url: "/dashboard/manage-orders",
    },
    {
      title: "Manage Listings",
      url: "/dashboard/manage-listings",
    },
    {
      title: "Manage Spam",
      url: "/dashboard/manage-spam",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full px-2 py-1">
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-2" />
              </div>
              <span className="font-semibold text-lg">Dashboard</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>{item.title}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
