"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/application-status-badge";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

interface ApplicationTableProps {
  jobs: Job[];
}

export function ApplicationTable({ jobs = [] }: ApplicationTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 rounded-full bg-[#333333] mx-auto mb-4 flex items-center justify-center">
          <Mail className="h-6 w-6 text-[#a3a3a3]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No applications yet
        </h3>
        <p className="text-[#a3a3a3]">
          Connect your Google account to automatically import job applications
          from your email.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#191919]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Applied
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Last Activity
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#252525] divide-y divide-[#333333]">
          {jobs.map((application, index) => (
            <tr
              key={application.id}
              className="hover:bg-[#333333] transition-colors duration-150 cursor-pointer select-none"
              style={{
                backgroundColor: "inherit",
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-white select-text">
                  {application.company}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#e6e6e6] select-text">
                  {application.position}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ApplicationStatusBadge status={application.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#a3a3a3] select-text">
                {formatDate(application.applied_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#a3a3a3] select-text">
                {formatDate(application.applied_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
