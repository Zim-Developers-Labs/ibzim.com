import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  variant?: 'gold' | 'silver' | 'bronze' | 'platinum' | 'emerald' | 'ruby';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShinyBadge({
  text,
  variant = 'gold',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    gold: {
      background:
        'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
      shadow: 'shadow-yellow-500/50',
      border: 'border-yellow-300',
      text: 'text-yellow-900',
    },
    silver: {
      background: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
      shadow: 'shadow-gray-500/50',
      border: 'border-gray-200',
      text: 'text-gray-800',
    },
    bronze: {
      background:
        'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600',
      shadow: 'shadow-orange-500/50',
      border: 'border-orange-300',
      text: 'text-orange-900',
    },
    platinum: {
      background: 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500',
      shadow: 'shadow-slate-500/50',
      border: 'border-slate-200',
      text: 'text-slate-800',
    },
    emerald: {
      background:
        'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
    },
    ruby: {
      background: 'bg-gradient-to-r from-red-400 via-red-500 to-red-600',
      shadow: 'shadow-red-500/50',
      border: 'border-red-300',
      text: 'text-red-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        `flex items-center gap-2 rounded-full ${sizeClasses[size]} ${style.background} ${style.text} shadow-lg ${style.shadow} relative mx-auto w-fit cursor-pointer overflow-hidden font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl`,
        className,
      )}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Inner highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/40 to-transparent" />

      <Icons.ibzimAwardsIcon className="relative z-10 h-8 w-8" />

      {/* Text */}
      <div className="text-light relative z-10 text-sm tracking-wide">
        {text}
      </div>
    </div>
  );
}
