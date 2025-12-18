interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

export default function ProgressCircle({
  progress,
  size = 40,
  strokeWidth = 4,
  className = '',
  color = 'currentColor',
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className={className}>
      <circle
        className="text-muted"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={color}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="transition-all duration-300"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="fill-foreground text-[10px] font-medium"
      >
        {progress}%
      </text>
    </svg>
  );
}
