"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  ExternalLink,
  Star,
  Calendar,
  Mail,
} from "lucide-react";
import { ApplicationStatusBadge } from "@/components/application-status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data
const applications = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    logo: "/placeholder.svg?height=40&width=40&text=G",
    location: "Mountain View, CA",
    status: "Interview Scheduled",
    date: "2025-04-15",
    lastActivity: "2025-03-24",
    favorite: true,
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Product Management Intern",
    logo: "/placeholder.svg?height=40&width=40&text=M",
    location: "Redmond, WA",
    status: "Applied",
    date: "2025-03-10",
    lastActivity: "2025-03-10",
    favorite: false,
  },
  {
    id: 3,
    company: "Amazon",
    position: "Data Science Intern",
    logo: "/placeholder.svg?height=40&width=40&text=A",
    location: "Seattle, WA",
    status: "Assessment Completed",
    date: "2025-03-05",
    lastActivity: "2025-03-20",
    favorite: true,
  },
  {
    id: 4,
    company: "Apple",
    position: "UX Design Intern",
    logo: "/placeholder.svg?height=40&width=40&text=A",
    location: "Cupertino, CA",
    status: "Screening",
    date: "2025-03-18",
    lastActivity: "2025-03-22",
    favorite: false,
  },
  {
    id: 5,
    company: "Meta",
    position: "Frontend Engineer Intern",
    logo: "/placeholder.svg?height=40&width=40&text=F",
    location: "Menlo Park, CA",
    status: "Rejected",
    date: "2025-02-28",
    lastActivity: "2025-03-15",
    favorite: false,
  },
  {
    id: 6,
    company: "Netflix",
    position: "Backend Engineer Intern",
    logo: "/placeholder.svg?height=40&width=40&text=N",
    location: "Los Gatos, CA",
    status: "Offer",
    date: "2025-02-15",
    lastActivity: "2025-03-25",
    favorite: true,
  },
  {
    id: 7,
    company: "Airbnb",
    position: "Mobile Engineer Intern",
    logo: "/placeholder.svg?height=40&width=40&text=A",
    location: "San Francisco, CA",
    status: "Applied",
    date: "2025-03-22",
    lastActivity: "2025-03-22",
    favorite: false,
  },
];

export function ApplicationTable() {
  const [favorites, setFavorites] = useState<number[]>(
    applications.filter((app) => app.favorite).map((app) => app.id)
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
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
            <th className="px-6 py-3 text-right text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <tr
              key={application.id}
              className={`hover:bg-[#252525] transition-colors ${
                index !== applications.length - 1
                  ? "border-b border-[#333333]"
                  : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0 rounded-md overflow-hidden bg-[#333333] mr-3">
                    <Image
                      src={application.logo || "/placeholder.svg"}
                      alt={application.company}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {application.company}
                    </div>
                    <div className="text-xs text-[#a3a3a3]">
                      {application.location}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">{application.position}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ApplicationStatusBadge status={application.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#a3a3a3]">
                {formatDate(application.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#a3a3a3]">
                {formatDate(application.lastActivity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    className={`text-[#a3a3a3] hover:text-amber-400 transition-colors ${
                      favorites.includes(application.id) ? "text-amber-400" : ""
                    }`}
                    onClick={() => toggleFavorite(application.id)}
                  >
                    <Star className="h-4 w-4" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[#a3a3a3] hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-[#252525] border-[#333333] text-white"
                    >
                      <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Application</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Send Follow-up</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#333333] hover:text-white cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Schedule Interview</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#333333]" />
                      <DropdownMenuItem className="text-red-400 hover:bg-[#333333] hover:text-red-400 cursor-pointer">
                        <span>Delete Application</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
