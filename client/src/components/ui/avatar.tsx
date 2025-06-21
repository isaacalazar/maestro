"use client";

import React from "react";

interface AvatarProps {
  email?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({
  email,
  name,
  size = 32,
  className = "",
}: AvatarProps) {
  // Generate a consistent color based on email/name
  const generateColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate HSL color with good saturation and lightness
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  // Get initials from name or email
  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    if (email) {
      const emailPart = email.split("@")[0];
      if (emailPart.includes(".")) {
        return emailPart
          .split(".")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      return emailPart.slice(0, 2).toUpperCase();
    }

    return "U";
  };

  const initials = getInitials();
  const backgroundColor = generateColor(email || name || "user");

  return (
    <div
      className={`rounded-md flex items-center justify-center text-white font-medium ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}
