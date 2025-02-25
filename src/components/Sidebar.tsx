import {
  Clapperboard,
  Home,
  MessageSquareHeart,
  PartyPopper,
  Settings,
  TicketIcon,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Events",
    url: "/events",
    icon: PartyPopper,
  },
  {
    title: "Customer",
    url: "/customer",
    icon: User,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: MessageSquareHeart,
  },
  {
    title: "Cinemas",
    url: "/cinemas",
    icon: Clapperboard,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="col-span-2 w-auto dark:text-white dark:bg-tuna-1000 bg-tuna-100 text-tuna-950"
    >
      <SidebarContent>
        <SidebarGroup className="py-20">
          <SidebarGroupLabel className="text-3xl self-center text-tuna-950 dark:text-white">
            <NavLink
              to={"/"}
              end
              className={"text-center flex flex-col items-center"}
            >
              <TicketIcon size={40} color="#4f39f6" />
              Ticketers
            </NavLink>
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-20 ">
            <SidebarMenu className="gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="text-base py-5 px-3 " asChild>
                    <NavLink
                      className={"flex items-center gap-x-4"}
                      to={item.url}
                      end
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
