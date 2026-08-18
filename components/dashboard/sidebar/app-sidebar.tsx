"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarClockIcon,
  ChartArea,
  ChartAreaIcon,
  ChartBar,
  ChartBarBig,
  ChartBarIcon,
  Code,
  Command,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  Inbox,
  Link2,
  Map,
  MessageCircle,
  PieChart,
  PieChartIcon,
  Rss,
  Settings2,
  Share,
  SquareTerminal,
  Wifi,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavProjects } from "@/components/dashboard/sidebar/nav-projects";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import { TeamSwitcher } from "@/components/dashboard/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "jay",
    email: "jay@example.com",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  teams: [
    {
      name: "EveOps",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Learn",
      url: "#",
      icon: BookOpen,
      isActive: false,
    },
    {
      title: "Build",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Lab",
      url: "#",
      icon: Code,
    },
    /*   {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    }, */
  ],
  projects: [
    {
      name: "Links",
      url: "/dashboard/links", //  url: "/dashboard/feed",
      icon: Link2,
    },
    {
      name: "Payouts",
      url: "/dashboard/payout", //  url: "/dashboard/dashboard",
      icon: CreditCard,
    },
    {
      name: "Dashboards",
      url: "",
      icon: PieChart,
    },
    {
      name: "Stats",
      url: "", //  url: "/dashboard/blogs",
      icon: Map,
    },
    {
      name: "Plan",
      url: "", //  url: "/dashboard/events",
      icon: CalendarClockIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/*  <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
