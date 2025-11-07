import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UserVotesComponents() {
  return (
    <>
      <div>User Votes</div>
      {/* Summary */}
      <Card className="mb-8 border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-zinc-900">Voting Summary</CardTitle>
          <CardDescription className="text-zinc-600">
            Your progress across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">0</div>
              <div className="text-sm text-zinc-600">Voted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">$12</div>
              <div className="text-sm text-zinc-600">Gifted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-600">0</div>
              <div className="text-sm text-zinc-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
