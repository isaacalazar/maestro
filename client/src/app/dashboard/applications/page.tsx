"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Filter, ArrowUpDown, Briefcase } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ApplicationTable } from "@/components/application-table";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  // }
}

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `https://maestro-production-0a0f.up.railway.app/api/jobs`
      );

      if (response.ok) {
        const data = await response.json();

        const jobsArray = Array.isArray(data) ? data : [];
        setJobs(jobsArray);
      } else {
        console.error("Failed to fetch jobs");
        setJobs([]);
      }
    } catch (error) {
      console.error("Network error fetching jobs:", error);
      setJobs([]);
    }
  };

  // Filter jobs based on search query and status
  const filteredJobs = jobs.filter((job) => {
    // First, apply search query filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
      matchesSearch =
      job.company.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query) ||
        job.status.toLowerCase().includes(query);
    }

    // Then, apply status filter
    let matchesStatus = true;
    if (filterStatus !== "all") {
      matchesStatus = job.status.toLowerCase() === filterStatus.toLowerCase();
    }

    // Job must match both search and status filters
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: jobs.length,
    applied: jobs.filter((job) => job.status === "applied").length,
    interviewing: jobs.filter((job) => job.status === "interviewing").length,
    offered: jobs.filter((job) => job.status === "offered").length,
    rejected: jobs.filter((job) => job.status === "rejected").length,
  };

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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-medium text-white">
                  Applications
                </h1>
                <p className="text-[#a3a3a3] mt-1">
                  Manage all your internship applications in one place
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#a3a3a3]" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 bg-[#252525] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] w-full md:w-64 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {(searchQuery || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="px-3 py-2 text-sm text-[#a3a3a3] hover:text-white border border-[#333333] rounded-md hover:bg-[#333333] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  href="/dashboard/applications/new"
                  className="flex items-center gap-2 bg-[#9333EA] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Application</span>
                </Link>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-[#9333EA] text-white"
                      : "bg-[#252525] text-[#a3a3a3] hover:text-white hover:bg-[#333333]"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#252525] border border-[#333333] rounded-md p-4">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-[#9333EA] mr-3" />
                  <div>
                    <p className="text-[#a3a3a3] text-sm">Total Applications</p>
                    <p className="text-2xl font-medium text-white">
                      {jobs.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#252525] border border-[#333333] rounded-md p-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-yellow-500 rounded mr-3"></div>
                  <div>
                    <p className="text-[#a3a3a3] text-sm">Interviews</p>
                    <p className="text-2xl font-medium text-white">
                      {statusCounts.interviewing}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#252525] border border-[#333333] rounded-md p-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded mr-3"></div>
                  <div>
                    <p className="text-[#a3a3a3] text-sm">Offers</p>
                    <p className="text-2xl font-medium text-white">
                      {statusCounts.offered}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#252525] border border-[#333333] rounded-md p-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-blue-500 rounded mr-3"></div>
                  <div>
                    <p className="text-[#a3a3a3] text-sm">Pending</p>
                    <p className="text-2xl font-medium text-white">
                      {statusCounts.applied}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#252525] border border-[#333333] rounded-md overflow-hidden">
              <div className="p-6 border-b border-[#333333] flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">
                  {searchQuery || filterStatus !== "all"
                    ? `Filtered Applications (${filteredJobs.length})`
                    : "All Applications"}
                </h2>
                {(searchQuery || filterStatus !== "all") && (
                  <div className="text-sm text-[#a3a3a3]">
                    {searchQuery && `Search: "${searchQuery}"`}
                    {searchQuery && filterStatus !== "all" && " • "}
                    {filterStatus !== "all" &&
                      `Status: ${
                        filterStatus.charAt(0).toUpperCase() +
                        filterStatus.slice(1)
                      }`}
                  </div>
                )}
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
              <ApplicationTable jobs={filteredJobs} />
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No applications yet
                </h3>
                <p className="text-[#a3a3a3] mb-4">
                  Get started by connecting your email or adding applications
                  manually.
                </p>
                <button className="bg-[#9333EA] hover:bg-[#7e22ce] text-white px-6 py-2 rounded-md transition-colors">
                  Add Your First Application
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
