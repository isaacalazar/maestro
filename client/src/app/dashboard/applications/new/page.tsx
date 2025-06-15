"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function NewApplicationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    status: "applied",
    applied_date: new Date().toISOString().split("T")[0],
    job_url: "",
    notes: "",
  });

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://maestro-production-0a0f.up.railway.app/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: formData.company,
            position: formData.position,
            status: formData.status,
            applied_date: formData.applied_date,
            location: formData.location || null,
            salary: formData.salary || null,
            job_url: formData.job_url || null,
            notes: formData.notes || null,
          }),
        }
      );

      if (response.ok) {
        router.push("/dashboard/applications");
      } else {
        console.error("Failed to create application");
      }
    } catch (error) {
      console.error("Error creating application:", error);
    } finally {
      setIsSubmitting(false);
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/dashboard/applications"
                className="inline-flex items-center text-[#a3a3a3] hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Link>
              <h1 className="text-3xl font-medium text-white">
                Add New Application
              </h1>
              <p className="text-[#a3a3a3] mt-1">
                Track a new internship application
              </p>
            </div>

            {/* Form */}
            <div className="bg-[#252525] border border-[#333333] rounded-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                      placeholder="e.g. Google, Microsoft, Apple"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Position *
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                      placeholder="e.g. Software Engineering Intern"
                      required
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salary"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Salary/Stipend
                    </label>
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                      placeholder="e.g. $25/hour, $5000/month"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offered">Offered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="applied_date"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Applied Date
                    </label>
                    <input
                      type="date"
                      id="applied_date"
                      name="applied_date"
                      value={formData.applied_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="job_url"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <LinkIcon className="inline h-4 w-4 mr-1" />
                    Job URL
                  </label>
                  <input
                    type="url"
                    id="job_url"
                    name="job_url"
                    value={formData.job_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white"
                    placeholder="https://company.com/careers/job-id"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    <FileText className="inline h-4 w-4 mr-1" />
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#191919] border border-[#333333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9333EA] text-white resize-none"
                    placeholder="Any additional notes about this application..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-6 border-t border-[#333333]">
                  <Link
                    href="/dashboard/applications"
                    className="px-6 py-2 border border-[#333333] text-[#a3a3a3] rounded-md hover:text-white hover:border-[#666666] transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.company || !formData.position
                    }
                    className="px-6 py-2 bg-[#9333EA] hover:bg-[#7e22ce] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Adding..." : "Add Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
