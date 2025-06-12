"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

interface ApplicationChartProps {
  jobs?: Job[];
}

export function ApplicationChart({ jobs = [] }: ApplicationChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate status data from real jobs
  const statusData = useMemo(() => {
    const statusCounts = {
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
    };

    jobs.forEach((job) => {
      const status = job.status.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    });

    return [
      { name: "Applied", value: statusCounts.applied, color: "#3b82f6" },
      {
        name: "Interviewing",
        value: statusCounts.interviewing,
        color: "#f59e0b",
      },
      { name: "Offered", value: statusCounts.offered, color: "#10b981" },
      { name: "Rejected", value: statusCounts.rejected, color: "#ef4444" },
    ].filter((item) => item.value > 0); // Only show statuses with data
  }, [jobs]);

  // Generate monthly data from real jobs
  const monthlyData = useMemo(() => {
    const monthCounts: { [key: string]: number } = {};

    jobs.forEach((job) => {
      try {
        const date = new Date(job.applied_date);
        const monthKey = date.toLocaleDateString("en-US", { month: "short" });
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      } catch (error) {
        console.warn("Invalid date:", job.applied_date);
      }
    });

    // Convert to array and sort by month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months
      .map((month) => ({
        name: month,
        applications: monthCounts[month] || 0,
      }))
      .filter((item) => item.applications > 0); // Only show months with applications
  }, [jobs]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252525] border border-[#333333] rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Show empty state if no data
  if (jobs.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a3a3a3] mb-2">No application data yet</p>
          <p className="text-sm text-[#666]">
            Connect your email or add applications to see charts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <div className="flex justify-end mb-4">
        <div className="flex bg-[#191919] rounded-md p-1">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "bar"
                ? "bg-[#9333EA] text-white"
                : "text-[#a3a3a3] hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "pie"
                ? "bg-[#9333EA] text-white"
                : "text-[#a3a3a3] hover:text-white"
            }`}
          >
            Status
          </button>
        </div>
      </div>

      {chartType === "bar" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333EA" stopOpacity={1} />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333"
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
              tickCount={5}
            />
            <Bar
              dataKey="applications"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={windowWidth < 768 ? 40 : 60}
              outerRadius={windowWidth < 768 ? 80 : 100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => (
                <span className="text-[#e6e6e6]">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
