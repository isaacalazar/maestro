"use client";

import type React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-8 relative z-10">
        <div className="bg-[#1e1e1e] w-16 h-16 rounded-lg flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </motion.div>
  );
}
