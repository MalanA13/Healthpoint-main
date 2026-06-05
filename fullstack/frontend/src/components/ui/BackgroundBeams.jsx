import React from "react";

export function BackgroundBeams({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Diagonal light beams */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="beam-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(13,148,136,0)" />
            <stop offset="50%" stopColor="rgba(13,148,136,0.06)" />
            <stop offset="100%" stopColor="rgba(13,148,136,0)" />
          </linearGradient>
          <linearGradient id="beam-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0)" />
            <stop offset="50%" stopColor="rgba(16,185,129,0.04)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </linearGradient>
        </defs>
        <line x1="-20%" y1="0" x2="120%" y2="100%" stroke="url(#beam-grad-1)" strokeWidth="1.5" />
        <line x1="20%" y1="0" x2="140%" y2="100%" stroke="url(#beam-grad-1)" strokeWidth="1" />
        <line x1="-40%" y1="0" x2="80%" y2="100%" stroke="url(#beam-grad-2)" strokeWidth="1.5" />
        <line x1="50%" y1="0" x2="200%" y2="100%" stroke="url(#beam-grad-1)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
