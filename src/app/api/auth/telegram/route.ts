export const runtime = 'nodejs'; // Ensure this runs in the Node.js runtime on Vercel

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// In-memory user store (replace with DB in production)
const users = new Map<string, any>();

// ✅ Validate Telegram hash
function verifyTelegramAuth(authData: any): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("Missing TELEGRAM_BOT_TOKEN");
    return false;
  }

  const secret = crypto.createHash('sha256').update(botToken).digest();

  const checkString = Object.keys(authData)
    .filter(k => k !== 'hash')
    .sort()
    .map(k => `${k}=${authData[k]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === authData.hash;
}

// ✅ Generate JWT token (simple version)
function generateToken(user: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: user.id,
    username: user.username,
    telegramId: user.telegramId,
    evmAddress: user.evmAddress || null,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // expires in 7 days
  };

  const secret = process.env.JWT_SECRET || 'bL3g3nDs$BuNdL3r@2025!sEcUr3K3y#xYz9mN4pQ8wR2tV6';

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// ✅ API route
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      id: telegramId,
      first_name,
      last_name,
      username,
      photo_url,
      auth_date,
      hash,
      address,
      signature
    } = data;

    // Validate hash
    if (!verifyTelegramAuth(data)) {
      console.warn("❌ Invalid Telegram auth");
      return NextResponse.json({ error: 'Invalid Telegram authentication' }, { status: 401 });
    }

    // Validate timestamp
    const now = Math.floor(Date.now() / 1000);
    if (now - parseInt(auth_date) > 3600) {
      return NextResponse.json({ error: 'Authentication expired' }, { status: 401 });
    }

    let user = users.get(telegramId);

    // New user registration
    if (!user) {
      const wallet = Keypair.generate();
      const walletSecret = bs58.encode(wallet.secretKey);

      user = {
        id: telegramId,
        telegramId,
        username,
        firstName: first_name,
        lastName: last_name,
        photoUrl: photo_url,
        evmAddress: address || null,
        signature: signature || null,
        solanaWallet: walletSecret,
        createdAt: new Date().toISOString()
      };

      users.set(telegramId, user);
      console.log('✅ Registered new user:', username);
    } else {
      console.log('🔁 User logged in:', username);
    }

    const token = generateToken(user);

    return NextResponse.json({
      message: 'Authenticated successfully',
      user,
      token
    });

  } catch (err) {
    console.error('🔥 Telegram login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
