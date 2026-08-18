import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import DropdownAvatar from "@/components/dashboard/sidebar/avatar";
import { AppBreadcrumb } from "@/components/dashboard/sidebar/breadcrumbs/app-breadcrumb";
//import { AppBreadcrumb } from "@/components/dashboard/sidebar/breadcrumps";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectedGuard } from "@/providers/guards";
import { ThemeProvider } from "@/providers/theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <AppBreadcrumb />
            </div>
            <div className="flex items-center gap-5 pr-5">
              <ThemeToggle className="size-10 rounded-full" />
              <DropdownAvatar />
            </div>
          </header>
          <Separator />
          <ProtectedGuard>
            <div className="relative h-full w-full px-6 py-3">{children}</div>
          </ProtectedGuard>
        </SidebarInset>
      </ThemeProvider>
    </SidebarProvider>
  );
}
