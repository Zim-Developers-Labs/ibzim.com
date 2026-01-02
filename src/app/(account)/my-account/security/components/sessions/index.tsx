import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Laptop, Smartphone, Chrome, Clock } from 'lucide-react';
import { revokeSession, SessionData } from './actions';
import { toast } from 'sonner';
import { logoutAction } from '@/lib/logout';

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'mobile':
      return Smartphone;
    case 'laptop':
      return Laptop;
    default:
      return Globe;
  }
};

function formatLastActive(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just Now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function SessionsManager({
  sessions,
}: {
  sessions: SessionData[];
}) {
  return (
    <Card className="rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Manage your active login sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.deviceType || 'Unknown');

            return (
              <div className="rounded-lg border p-3" key={session.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <DeviceIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {session.deviceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chrome className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {session.browserName}
                      </span>
                    </div>
                    {session.isCurrent && (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          className={`bg-green-600 text-xs`}
                        >
                          Current
                        </Badge>
                      </div>
                    )}
                  </div>
                  {session.isCurrent ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                      onClick={async () => {
                        await logoutAction();
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                      onClick={async () => {
                        const result = await revokeSession(session.id);

                        if (result.done) {
                          toast.success('Session revoked successfully');
                          window.location.reload();
                        }

                        if (result.error) {
                          toast.error(result.error);
                        }
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
                <div className="mb-4 w-full border-b border-zinc-200 pt-4" />
                <div className="text-xs">
                  <span className="font-bold">
                    {formatLastActive(session.lastActiveAt)}
                  </span>{' '}
                  From <span className="font-bold">{session.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
