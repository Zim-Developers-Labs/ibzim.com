"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CircleProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
  backgroundColor?: string;
  animate?: boolean;
  animationDuration?: number;
}

export function CircleProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 5,
  showValue = true,
  valuePrefix = "",
  valueSuffix = "",
  color = "var(--primary)",
  backgroundColor = "rgba(0,0,0,.2)",
  animate = true,
  animationDuration = 1000,
  className,
  ...props
}: CircleProgressProps) {
  const [progress, setProgress] = React.useState(0);
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = (normalizedValue / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  React.useEffect(() => {
    if (!animate) {
      setProgress(percentage);
      return;
    }

    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage, animate]);

  const displayValue = animate ? Math.round(progress) : Math.round(percentage);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={
            animate
              ? (circumference - (progress / 100) * circumference).toString()
              : strokeDashoffset
          }
          strokeLinecap="round"
          style={
            animate
              ? {
                  transition: `stroke-dashoffset ${animationDuration}ms ease-in-out`,
                }
              : undefined
          }
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="text-xs font-medium">
            {valuePrefix}
            {displayValue}
            {valueSuffix}
          </span>
        </div>
      )}
    </div>
  );
}
