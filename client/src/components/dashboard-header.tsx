"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: DashboardHeaderProps) {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="h-14 border-b border-[#333333] bg-[#191919] sticky top-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-[#a3a3a3] hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Help */}
          <button className="h-8 w-8 flex items-center justify-center rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#252525]">
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="h-8 w-8 flex items-center justify-center rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#252525]">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9333EA] text-[10px] font-medium flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 hover:bg-[#252525] rounded-md px-2">
                <div className="h-7 w-7 rounded-md overflow-hidden bg-[#333333]">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-[#a3a3a3]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#252525] border-[#333333] text-white"
            >
              <div className="px-4 py-3 border-b border-[#333333]">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-[#a3a3a3] mt-1">
                  alex.johnson@example.com
                </p>
              </div>
              <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333333]" />
              <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
