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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);

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
      const response = await fetch("http://localhost:8000/auth/google-login");
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
        "Attempting to fetch jobs from: http://localhost:8000/api/jobs"
      );

      const response = await fetch("http://localhost:8000/api/jobs", {
        credentials: "include",
      });

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

  const createManualJob = async () => {
    const company = prompt("Company name:");
    const position = prompt("Position:");

    if (company && position) {
      try {
        const response = await fetch("http://localhost:8000/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            company,
            position,
            status: "applied",
          }),
        });

        console.log(response);

        if (response.ok) {
          fetchJobs(); // Refresh the list
        }
      } catch (error) {
        console.error("Failed to create job:", error);
      }
    }
  };

  const disconnectGoogleAccount = () => {
    localStorage.removeItem("googleAccountConnected");
    setConnected(false);
    setJobs([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "offered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const syncEmails = async () => {
    try {
      setSyncing(true);
      console.log("Manually syncing emails...");

      const response = await fetch("http://localhost:8000/api/sync-emails", {
        method: "POST",
        credentials: "include",
      });

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
                value={jobs.length.toString()}
                icon={<Briefcase className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={true}
              />
              <StatsCard
                title="Interviews Scheduled"
                value={jobs
                  .filter((job) => job.status === "interviewing")
                  .length.toString()}
                icon={<Calendar className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={true}
              />
              <StatsCard
                title="Pending Responses"
                value={jobs
                  .filter((job) => job.status === "applied")
                  .length.toString()}
                icon={<Clock className="h-5 w-5 text-[#9333EA]" />}
                change=""
                positive={false}
              />
              <StatsCard
                title="Offers Received"
                value={jobs
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
                <ApplicationChart jobs={jobs} />
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#252525] border border-[#333333] rounded-md overflow-hidden">
              <div className="p-6 border-b border-[#333333]">
                <h2 className="text-lg font-medium text-white">Applications</h2>
              </div>
              <ApplicationTable jobs={jobs} />
            </div>

            {(!connected || (connected && jobs.length === 0)) && (
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
                        {connected && jobs.length === 0
                          ? "Re-sync your Gmail to import applications"
                          : "Automatically import job applications from your Gmail"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={connectGoogleAccount}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {loading
                      ? "Connecting..."
                      : connected
                      ? "Re-connect"
                      : "Connect Google"}
                  </button>
                </div>
              </div>
            )}

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
