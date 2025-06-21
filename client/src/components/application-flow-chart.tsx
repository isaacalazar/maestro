"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

interface ApplicationFlowChartProps {
  jobs: Job[];
}

interface SankeyNode {
  id: string;
  name: string;
  value?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
}

export function ApplicationFlowChart({ jobs }: ApplicationFlowChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!jobs.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 30, right: 100, bottom: 30, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data to create proper Sankey flow
    const statusCounts = {
      applied: jobs.filter((j) => j.status === "applied").length,
      interviewing: jobs.filter((j) => j.status === "interviewing").length,
      offered: jobs.filter((j) => j.status === "offered").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
    };

    // Create a proper flow structure
    // We'll simulate the progression: some applied → interviewing → offered/rejected
    // and some applied → directly rejected

    const totalApps = jobs.length;
    const currentInterviewing = statusCounts.interviewing;
    const currentOffered = statusCounts.offered;
    const currentRejected = statusCounts.rejected;
    const currentApplied = statusCounts.applied;

    // For Sankey, we need to show the flow, not just current states
    // Let's assume: Total → Applied → (Interviewing + Direct Rejections) → (Offers + Interview Rejections)

    const nodes: SankeyNode[] = [
      { id: "start", name: "Applications" },
      { id: "applied", name: "Applied" },
      { id: "interviewing", name: "Interviewing" },
      { id: "offered", name: "Offered" },
      { id: "rejected", name: "Rejected" },
    ];

    const links: SankeyLink[] = [
      // Everyone starts by applying
      { source: "start", target: "applied", value: totalApps },

      // From applied, some go to interviewing, some get rejected directly
      {
        source: "applied",
        target: "interviewing",
        value: currentInterviewing + currentOffered,
      },
      {
        source: "applied",
        target: "rejected",
        value: Math.max(1, Math.floor(currentRejected * 0.7)),
      },

      // From interviewing, some get offers, some get rejected
      { source: "interviewing", target: "offered", value: currentOffered },
      {
        source: "interviewing",
        target: "rejected",
        value: Math.max(
          1,
          currentInterviewing + Math.floor(currentRejected * 0.3)
        ),
      },
    ];

    // If we only have applied status, show a simpler flow
    if (currentApplied === totalApps) {
      nodes.splice(2); // Keep only start, applied
      nodes.push({ id: "pending", name: "Pending" });
      links.length = 0;
      links.push(
        { source: "start", target: "applied", value: totalApps },
        { source: "applied", target: "pending", value: totalApps }
      );
    }

    // Filter out zero-value links
    const validLinks = links.filter((link) => link.value > 0);

    if (validLinks.length === 0) {
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#a3a3a3")
        .style("font-size", "16px")
        .text("No application data available");
      return;
    }

    // Create sankey generator with proper settings
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeId((d) => d.id)
      .nodeWidth(20)
      .nodePadding(30)
      .extent([
        [0, 0],
        [width, height],
      ]);

    // Generate the sankey diagram
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: validLinks.map((d) => ({ ...d })),
    });

    // Color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain([
        "start",
        "applied",
        "interviewing",
        "offered",
        "rejected",
        "pending",
      ])
      .range([
        "#8B5CF6",
        "#3B82F6",
        "#F59E0B",
        "#10B981",
        "#EF4444",
        "#6B7280",
      ]);

    // Draw the curved links (this is what makes it look like a Sankey)
    g.append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => {
        const targetId = typeof d.target === "string" ? d.target : d.target.id;
        return colorScale(targetId);
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.max(1, d.width || 0))
      .attr("fill", "none")
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-opacity", 0.8);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("stroke-opacity", 0.6);
      })
      .append("title")
      .text((d) => {
        const sourceName =
          typeof d.source === "string" ? d.source : d.source.name;
        const targetName =
          typeof d.target === "string" ? d.target : d.target.name;
        return `${sourceName} → ${targetName}: ${d.value} application${
          d.value === 1 ? "" : "s"
        }`;
      });

    // Draw nodes
    const nodeGroups = g.append("g").selectAll("g").data(sankeyNodes).join("g");

    nodeGroups
      .append("rect")
      .attr("x", (d) => d.x0 || 0)
      .attr("y", (d) => d.y0 || 0)
      .attr("height", (d) => (d.y1 || 0) - (d.y0 || 0))
      .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr("fill", (d) => colorScale(d.id))
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
      });

    // Add node labels
    nodeGroups
      .append("text")
      .attr("x", (d) => {
        const x0 = d.x0 || 0;
        const x1 = d.x1 || 0;
        return x0 < width / 2 ? x1 + 8 : x0 - 8;
      })
      .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => {
        const x0 = d.x0 || 0;
        return x0 < width / 2 ? "start" : "end";
      })
      .attr("fill", "#e6e6e6")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .text((d) => d.name);

    // Add value labels
    nodeGroups
      .append("text")
      .attr("x", (d) => {
        const x0 = d.x0 || 0;
        const x1 = d.x1 || 0;
        return x0 < width / 2 ? x1 + 8 : x0 - 8;
      })
      .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2 + 16)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => {
        const x0 = d.x0 || 0;
        return x0 < width / 2 ? "start" : "end";
      })
      .attr("fill", "#a3a3a3")
      .style("font-size", "11px")
      .text((d) => {
        if (d.id === "start") return `${totalApps} total`;
        if (d.id === "pending") return `${currentApplied} pending`;
        if (d.id === "applied") return `${totalApps} applied`;
        if (d.id === "interviewing")
          return `${currentInterviewing} interviewing`;
        if (d.id === "offered") return `${currentOffered} offered`;
        if (d.id === "rejected") return `${currentRejected} rejected`;
        return "";
      });
  }, [jobs]);

  if (!jobs.length) {
    return (
      <div className="flex items-center justify-center h-64 text-[#a3a3a3]">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">No Applications Yet</div>
          <div className="text-sm">
            Add some applications to see the flow visualization
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">
          Application Flow
        </h3>
        <p className="text-sm text-[#a3a3a3]">
          Visualize how your applications flow through different statuses
        </p>
      </div>
      <div className="bg-[#252525] border border-[#333333] rounded-lg p-6 overflow-x-auto">
        <svg ref={svgRef} className="w-full h-auto min-w-[800px]" />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3B82F6] rounded"></div>
          <span className="text-[#e6e6e6]">Applied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F59E0B] rounded"></div>
          <span className="text-[#e6e6e6]">Interviewing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#10B981] rounded"></div>
          <span className="text-[#e6e6e6]">Offered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#EF4444] rounded"></div>
          <span className="text-[#e6e6e6]">Rejected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#6B7280] rounded"></div>
          <span className="text-[#e6e6e6]">Pending</span>
        </div>
      </div>
    </div>
  );
}
