import type React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  positive,
}: StatsCardProps) {
  return (
    <div className="bg-[#252525] border border-[#333333] rounded-md p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#a3a3a3] text-sm">{title}</p>
          <h3 className="text-2xl font-medium text-white mt-1">{value}</h3>

          {change && (
            <div className="flex items-center mt-2">
              {positive !== undefined &&
                (positive ? (
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-400 mr-1" />
                ))}
              <span
                className={`text-xs ${
                  positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>

        <div className="h-9 w-9 rounded-md bg-[#9333EA]/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}
