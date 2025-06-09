"use client";

import { useEffect, useState } from "react";
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

// Sample data
const statusData = [
  { name: "Applied", value: 12, color: "#3b82f6" },
  { name: "Screening", value: 5, color: "#9333EA" },
  { name: "Interview", value: 3, color: "#f59e0b" },
  { name: "Assessment", value: 2, color: "#06b6d4" },
  { name: "Offer", value: 1, color: "#10b981" },
  { name: "Rejected", value: 4, color: "#ef4444" },
];

const monthlyData = [
  { name: "Jan", applications: 2 },
  { name: "Feb", applications: 5 },
  { name: "Mar", applications: 10 },
  { name: "Apr", applications: 7 },
];

export function ApplicationChart() {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252525] border border-[#333333] rounded-md p-2 shadow-md">
          <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px]">
      {chartType === "bar" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="applications" fill="#9333EA" radius={[4, 4, 0, 0]} />
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
