"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Mail,
  Calendar,
  Settings,
  ChevronRight,
  ChevronLeft,
  BarChart4,
  Users,
  FileText,
  Star,
  Clock,
} from "lucide-react";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
    { name: "Inbox", href: "/dashboard/inbox", icon: Mail },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart4 },
  ];

  const secondaryNavItems = [
    { name: "Companies", href: "/dashboard/companies", icon: Users },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Saved", href: "/dashboard/saved", icon: Star },
    { name: "History", href: "/dashboard/history", icon: Clock },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#191919] border-r border-[#333333] transition-all duration-300 ${
          open ? "w-64" : "w-0 md:w-16 overflow-hidden"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div
            className={`h-14 flex items-center px-4 ${
              !open && "md:justify-center"
            }`}
          >
            <Link href="/dashboard" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-[#9333EA] flex items-center justify-center">
                <span className="font-medium text-white">M</span>
              </div>
              {open && (
                <span className="ml-2 font-medium text-white">Maestro</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-[#9333EA]/10 text-[#9333EA]"
                        : "text-[#a3a3a3] hover:text-white hover:bg-[#252525]"
                    } ${!open && "md:justify-center"}`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {open && <span className="ml-3 text-sm">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>

            {open && (
              <div className="mt-8 px-4">
                <div className="h-px bg-[#333333]" />
              </div>
            )}

            <nav className="mt-8 px-2 space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#252525] transition-colors ${
                    !open && "md:justify-center"
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {open && <span className="ml-3 text-sm">{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Toggle button */}
          <button
            className="hidden md:flex items-center justify-center h-8 w-8 mx-auto mb-6 rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#252525]"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
