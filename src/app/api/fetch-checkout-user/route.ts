// ibzim.com/app/api/fetch-checkout-user/route.ts
import { checkoutTokens, db, users } from '@/lib/server/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const PEYA_PEYA_API_KEY =
  process.env.PEYA_PEYA_API_KEY || 'replace_with_real_key';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const auth = req.headers.get('authorization') || '';

  if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== PEYA_PEYA_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!token)
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const session = await db.query.checkoutTokens.findFirst({
    where: eq(checkoutTokens.token, token),
    with: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 404 },
    );
  }

  if (!session.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.fullName,
      avatarUrl: session.user.avatar,
    },
  });
}
