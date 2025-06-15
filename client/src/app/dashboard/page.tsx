"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Calendar, Clock, Briefcase, Mail } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ApplicationTable } from "@/components/application-table";
import { StatsCard } from "@/components/stats-card";
import { ApplicationChart } from "@/components/application-chart";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
console.log(API_BASE_URL);

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is already connected and fetch jobs on mount
  useEffect(() => {
    // Check localStorage for previous connection
    const isConnected =
      localStorage.getItem("googleAccountConnected") === "true";
    if (isConnected) {
      setConnected(true);
    }

    // Always try to fetch jobs (this will also help determine if connected)
    fetchJobs();

    // Check if user just completed OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "success") {
      setConnected(true);
      localStorage.setItem("googleAccountConnected", "true");
      // Clean up URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Update connected state based on jobs availability
  useEffect(() => {
    if (jobs.length > 0 && !connected) {
      setConnected(true);
      localStorage.setItem("googleAccountConnected", "true");
    }
  }, [jobs, connected]);

  const connectGoogleAccount = async () => {
    try {
      setLoading(true);
      // Call backend to initiate OAuth
      const response = await fetch(
        `https://maestro-production-0a0f.up.railway.app/auth/google-login`
      );
      const data = await response.json();

      // Redirect to Google OAuth
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error("Failed to connect Google account:", error);
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      console.log(
        `Attempting to fetch jobs from: https://maestro-production-0a0f.up.railway.app/api/jobs`
      );

      const response = await fetch(
        `https://maestro-production-0a0f.up.railway.app/api/jobs`,
        {
          credentials: "include",
        }
      );

      console.log("Jobs API response:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Jobs data received:", data);
        // Ensure data is an array
        const jobsArray = Array.isArray(data) ? data : [];
        setJobs(jobsArray);

        // If we got jobs successfully, mark as connected
        if (jobsArray.length > 0) {
          setConnected(true);
          localStorage.setItem("googleAccountConnected", "true");
        }
      } else {
        const errorText = await response.text();
        console.error("API returned error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: response.url,
        });
        setJobs([]);
      }
    } catch (error) {
      console.error("Network error - backend might not be running:", error);
      console.error("Make sure your backend server is running on port 8000");
      setJobs([]);
    }
  };

  const disconnectGoogleAccount = () => {
    localStorage.removeItem("googleAccountConnected");
    setConnected(false);
    setJobs([]);
  };

  const syncEmails = async () => {
    try {
      setSyncing(true);
      console.log("Manually syncing emails...");

      const response = await fetch(
        `https://maestro-production-0a0f.up.railway.app/api/sync-emails`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Sync result:", data);
        // Refresh jobs after sync
        fetchJobs();
      } else {
        const errorText = await response.text();
        console.error("Sync failed:", errorText);
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
    } finally {
      setSyncing(false);
    }
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      job.company.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query) ||
      job.status.toLowerCase().includes(query)
    );
  });

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link
                  href="/dashboard/applications/new"
                  className="flex items-center gap-2 bg-[#9333EA] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Application</span>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatsCard
                title="Total Applications"
                value={filteredJobs.length.toString()}
                icon={<Briefcase className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={true}
              />
              <StatsCard
                title="Interviews Scheduled"
                value={filteredJobs
                  .filter((job) => job.status === "interviewing")
                  .length.toString()}
                icon={<Calendar className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={true}
              />
              <StatsCard
                title="Pending Responses"
                value={filteredJobs
                  .filter((job) => job.status === "applied")
                  .length.toString()}
                icon={<Clock className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={false}
              />
              <StatsCard
                title="Offers Received"
                value={filteredJobs
                  .filter((job) => job.status === "offered")
                  .length.toString()}
                icon={<Briefcase className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={true}
              />
            </div>

            <div className="mb-10">
              {/* Application Status Chart */}
              <div className="bg-[#252525] border border-[#333333] rounded-md p-6">
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
                <ApplicationChart jobs={filteredJobs} />
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#252525] border border-[#333333] rounded-md overflow-hidden">
              <div className="p-6 border-b border-[#333333]">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">
                    Applications
                  </h2>
                  {searchQuery.trim() && (
                    <p className="text-sm text-[#a3a3a3]">
                      {filteredJobs.length} of {jobs.length} applications
                    </p>
                  )}
                </div>
              </div>
              <ApplicationTable jobs={filteredJobs} />
            </div>

            {/* Not connected at all */}
            {!connected && (
              <div className="bg-[#252525] border border-[#333333] rounded-lg p-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Connect Your Email
                      </h3>
                      <p className="text-[#a3a3a3] text-sm">
                        Automatically import job applications from your Gmail
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={connectGoogleAccount}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {loading ? "Connecting..." : "Connect Google"}
                  </button>
                </div>
              </div>
            )}

            {/* Connected but no applications found */}
            {connected && jobs.length === 0 && (
              <div className="bg-[#252525] border border-[#333333] rounded-lg p-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        No Applications Found
                      </h3>
                      <p className="text-[#a3a3a3] text-sm">
                        We couldn&apos;t find any job applications in your
                        Gmail. Try syncing again or add applications manually.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={syncEmails}
                      disabled={syncing}
                      className="bg-[#9333EA] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors text-sm"
                    >
                      {syncing ? "Syncing..." : "Sync Again"}
                    </button>
                    <button
                      onClick={disconnectGoogleAccount}
                      className="text-sm text-[#a3a3a3] hover:text-white underline whitespace-nowrap"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Connected with applications */}
            {connected && jobs.length > 0 && (
              <div className="bg-[#252525] border border-[#333333] rounded-lg p-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Google Account Connected
                      </h3>
                      <p className="text-[#a3a3a3] text-sm">
                        Applications are being automatically imported
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={syncEmails}
                      disabled={syncing}
                      className="bg-[#9333EA] hover:bg-[#7e22ce] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors text-sm"
                    >
                      {syncing ? "Syncing..." : "Sync Now"}
                    </button>
                    <button
                      onClick={disconnectGoogleAccount}
                      className="text-sm text-[#a3a3a3] hover:text-white underline whitespace-nowrap"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
