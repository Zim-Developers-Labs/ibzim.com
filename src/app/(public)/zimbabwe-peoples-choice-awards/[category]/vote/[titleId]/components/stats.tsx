import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, LockIcon, CircleDollarSign } from 'lucide-react';

interface StatsProps {
  stats: {
    totalVotes: number;
    daysRemaining: number;
    totalTitles: number;
  };
}

export default function VotingStats({ stats }: StatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Votes - Blue Gradient */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <CardContent className="relative p-6">
          <div className="absolute top-4 right-4 opacity-20">
            <Users className="h-20 w-20" strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="mb-1 text-sm font-medium text-blue-100">
              Total Votes
            </div>
            <div className="text-4xl font-bold text-white">
              {stats.totalVotes}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-200" />
              <span className="text-xs text-blue-100">Submitted votes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Days Remaining - Orange Gradient */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <CardContent className="relative p-6">
          <div className="absolute top-4 right-4 opacity-20">
            <Clock className="h-20 w-20" strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="mb-1 text-sm font-medium text-orange-100">
              Days Remaining
            </div>
            <div className="text-4xl font-bold text-white">
              {stats.daysRemaining}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-200" />
              <span className="text-xs text-orange-100">Until next season</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Voted - Emerald Gradient */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700">
        <CardContent className="relative p-6">
          <div className="absolute top-4 right-4 opacity-20">
            <CircleDollarSign className="h-20 w-20" strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="mb-1 text-sm font-medium text-emerald-100">
              Your Referral Income
            </div>
            <div className="text-4xl font-bold text-white">$0.00</div>
            <div className="mt-4 flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-emerald-200" />
              <span className="text-xs text-emerald-100">
                In BETA for Leader+ rank users only
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
