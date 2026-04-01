"use client";

import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  label: string;
  aspect?: "video" | "square" | "portrait" | "wide";
  className?: string;
  dark?: boolean;
  icon?: React.ReactNode;
}

const aspectMap = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export default function PlaceholderImage({
  label,
  aspect = "video",
  className,
  dark = false,
  icon,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg flex items-center justify-center",
        aspectMap[aspect],
        dark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50"
          : "bg-gradient-to-br from-tckr-50 to-tckr-100 border border-tckr-200/50",
        className
      )}
    >
      {/* Grid pattern overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          dark ? "opacity-5" : "opacity-10"
        )}
        style={{
          backgroundImage: `linear-gradient(${dark ? '#fff' : '#283389'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? '#fff' : '#283389'} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative text-center px-4">
        {icon && <div className="mb-2 flex justify-center">{icon}</div>}
        <p
          className={cn(
            "text-xs font-medium tracking-wider uppercase",
            dark ? "text-gray-500" : "text-tckr-400"
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
