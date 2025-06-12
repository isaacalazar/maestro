"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function NewApplicationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    jobUrl: "",
    notes: "",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          company: formData.company,
          position: formData.position,
          status: formData.status,
          applied_date: formData.appliedDate,
          location: formData.location,
          salary: formData.salary,
          job_url: formData.jobUrl,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/applications");
      } else {
        console.error("Failed to create application");
      }
    } catch (error) {
      console.error("Error creating application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-3xl font-medium text-white">
                  New Application
                </h1>
                <p className="text-[#a3a3a3] mt-1">
                  Add a new job application to track your progress
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-[#252525] border border-[#333333] rounded-lg p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <Building className="inline h-4 w-4 mr-2" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                    placeholder="e.g., Google, Microsoft, Apple"
                  />
                </div>

                {/* Position */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Position Title *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                    placeholder="e.g., Software Engineer Intern, Product Manager Intern"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                    placeholder="e.g., San Francisco, CA / Remote"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label
                    htmlFor="salary"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <DollarSign className="inline h-4 w-4 mr-2" />
                    Salary/Hourly Rate
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                    placeholder="e.g., $25/hour, $5000/month"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Applied Date */}
                <div>
                  <label
                    htmlFor="appliedDate"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Applied Date
                  </label>
                  <input
                    type="date"
                    id="appliedDate"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                  />
                </div>

                {/* Job URL */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="jobUrl"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Job Posting URL
                  </label>
                  <input
                    type="url"
                    id="jobUrl"
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white"
                    placeholder="https://careers.company.com/jobs/123456"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA] text-white resize-none"
                    placeholder="Add any additional notes, requirements, or details about this application..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#333333]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-[#333333] text-[#a3a3a3] hover:text-white hover:border-[#555555] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.company || !formData.position}
                  className="px-6 py-3 bg-[#9333EA] hover:bg-[#7e22ce] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Application"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
