"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Calendar,
  Clock,
  Briefcase,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ApplicationTable } from "@/components/application-table";
import { StatsCard } from "@/components/stats-card";
import { UpcomingEvents } from "@/components/upcoming-events";
import { ApplicationChart } from "@/components/application-chart";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#191919] text-[#e6e6e6] flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h1 className="text-3xl font-medium text-white">Dashboard</h1>
                <p className="text-[#a3a3a3] mt-1">
                  Track and manage your internship applications
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#a3a3a3]" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 bg-[#252525] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] w-full md:w-64 text-sm"
                  />
                </div>
                <button className="flex items-center gap-2 bg-[#9333EA] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-md transition-colors text-sm">
                  <Plus className="h-4 w-4" />
                  <span>New Application</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatsCard
                title="Total Applications"
                value="24"
                icon={<Briefcase className="h-5 w-5 text-[#9333EA]" />}
                change="+3 this week"
                positive={true}
              />
              <StatsCard
                title="Interviews Scheduled"
                value="5"
                icon={<Calendar className="h-5 w-5 text-[#9333EA]" />}
                change="2 upcoming"
                positive={true}
              />
              <StatsCard
                title="Pending Responses"
                value="12"
                icon={<Clock className="h-5 w-5 text-[#9333EA]" />}
                change="4 over 2 weeks"
                positive={false}
              />
              <StatsCard
                title="Response Rate"
                value="42%"
                icon={<Briefcase className="h-5 w-5 text-[#9333EA]" />}
                change="+5% from last month"
                positive={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Application Status Chart */}
              <div className="lg:col-span-2 bg-[#252525] border border-[#333333] rounded-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      Application Status
                    </h2>
                    <p className="text-[#a3a3a3] text-sm">
                      Overview of your applications
                    </p>
                  </div>
                </div>
                <ApplicationChart />
              </div>

              {/* Upcoming Events */}
              <div className="bg-[#252525] border border-[#333333] rounded-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-white">
                    Upcoming Events
                  </h2>
                  <button className="text-sm text-[#9333EA] hover:text-[#7e22ce]">
                    View all
                  </button>
                </div>
                <UpcomingEvents />
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#252525] border border-[#333333] rounded-md overflow-hidden">
              <div className="p-6 border-b border-[#333333] flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">Applications</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-sm">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort</span>
                  </button>
                </div>
              </div>
              <ApplicationTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
