"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserData {
  name?: string;
  email?: string;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: DashboardHeaderProps) {
  const [userData, setUserData] = useState<UserData>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        if (user) {
          setUserData({
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || "No email",
          });
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
      } else {
        // Clear any local storage or session data if needed
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if there's an error
      router.push("/login");
    }
  };

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
                <p className="text-sm font-medium">
                  {userData.name || "Loading..."}
                </p>
                <p className="text-xs text-[#a3a3a3] mt-1">
                  {userData.email || "Loading..."}
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
              <DropdownMenuItem
                className="hover:bg-[#333333] hover:text-white cursor-pointer"
                onClick={handleLogout}
              >
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
