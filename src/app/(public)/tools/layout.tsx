import Container from '@/components/container';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Full Disclosure</AlertTitle>
        <AlertDescription>
          This feature is still being developed and may not be fully functional.
          Please use with caution and report any issues you encounter.
        </AlertDescription>
      </Alert>
      {children}
    </Container>
  );
}
