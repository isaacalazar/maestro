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
      className="group relative overflow-hidden"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/20 via-[#7c3aed]/10 to-[#a855f7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Glass morphism card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.1] rounded-2xl p-8 h-full transition-all duration-500 group-hover:border-[#9333EA]/30 group-hover:shadow-2xl group-hover:shadow-[#9333EA]/20">
        {/* Animated glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9333EA] via-[#a855f7] to-[#7c3aed] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

        {/* Content container */}
        <div className="relative z-10">
          {/* Icon container with enhanced styling */}
          <motion.div
            className="relative mb-6 w-fit"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/30 to-[#a855f7]/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative bg-gradient-to-br from-[#1f1f23] to-[#2a2a2f] w-16 h-16 rounded-xl flex items-center justify-center border border-white/[0.1] group-hover:border-[#9333EA]/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">{icon}</div>
            </div>
          </motion.div>

          {/* Title with gradient text on hover */}
          <motion.h3
            className="text-xl font-bold mb-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#9333EA]/80 group-hover:bg-clip-text group-hover:text-transparent"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
          >
            {title}
          </motion.h3>

          {/* Description with enhanced styling */}
          <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
            {description}
          </p>

          {/* Subtle animated border */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#9333EA]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Corner accent */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#9333EA]/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#9333EA]/60 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#a855f7]/60 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-[#7c3aed]/60 rounded-full animate-pulse delay-700" />
        </div>
      </div>
    </motion.div>
  );
}
