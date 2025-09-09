'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageCircle, Phone } from 'lucide-react';

export default function SupportPageWrapper() {
  const whatsappNumber = '+263780105064'; // Replace with your IBZIM WhatsApp number
  const supportMessage = 'Support Ticket ### Hi I am ...';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(supportMessage)}`;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Phone className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Need Help?</CardTitle>
          <CardDescription className="text-muted-foreground">
            Get instant support through WhatsApp. Our team is ready to assist
            you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            asChild
            className="h-12 w-full text-base font-medium"
            size="lg"
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact Support via WhatsApp
            </div>
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Click the button above to start a conversation with our support team
            on WhatsApp.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
