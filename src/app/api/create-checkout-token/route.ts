// ibzim.com/app/api/create-checkout-token/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkoutTokens, db } from '@/lib/server/db';
import { and, eq } from 'drizzle-orm';

type Body = { plan: string; price: number; interval: string; userId?: string };

export async function POST(req: Request) {
  const body: Body = await req.json();

  // validate input server-side
  if (!body.plan || !body.price || !body.userId) {
    return NextResponse.json(
      { error: 'Missing plan, price, or userId' },
      { status: 400 },
    );
  }

  // check if user already has a valid token
  const existingToken = await db.query.checkoutTokens.findFirst({
    where: and(
      eq(checkoutTokens.userId, Number(body.userId)),
      eq(checkoutTokens.status, 'pending'),
    ),
  });

  if (existingToken) {
    if (existingToken.expiresAt > new Date()) {
      return NextResponse.json({ checkoutToken: existingToken.token });
    }
    // delete expired token
    await db
      .delete(checkoutTokens)
      .where(eq(checkoutTokens.id, existingToken.id));
  }

  // create a short-lived token
  const token = 'ct_' + crypto.randomBytes(20).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  await db.insert(checkoutTokens).values({
    token,
    plan: body.plan,
    interval: body.interval,
    amount: String(body.price),
    currency: 'USD',
    status: 'pending',
    expiresAt,
    userId: Number(body.userId),
  });

  return NextResponse.json({ checkoutToken: token });
}
