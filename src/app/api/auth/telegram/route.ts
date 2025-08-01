export const runtime = 'nodejs'; // ✅ Force this route to use Node.js runtime

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// 🔐 In-memory user store (replace with real DB)
const users = new Map<string, any>();

// Telegram authentication verification
function verifyTelegramAuth(authData: any): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8204685943:AAEJHPugVMk5zYi-51KNJLJDEHe0QI4SRWU';
  const secret = crypto.createHash('sha256').update(botToken).digest();

  const checkString = Object.keys(authData)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${authData[key]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === authData.hash;
}

// JWT token generation
function generateToken(user: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    id: user.id,
    username: user.username,
    telegramId: user.telegramId,
    evmAddress: user.evmAddress || null,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
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
      address,          // optional: EVM address
      signature         // optional: EVM signature
    } = data;

    if (!verifyTelegramAuth(data)) {
      return NextResponse.json({ error: 'Invalid Telegram authentication' }, { status: 401 });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - parseInt(auth_date) > 3600) {
      return NextResponse.json({ error: 'Authentication expired' }, { status: 401 });
    }

    let user = users.get(telegramId);

    // 👤 Create new user if not found
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
      console.log('[REGISTERED] New user created:', username);
    } else {
      console.log('[LOGIN] Returning existing user:', username);
    }

    const token = generateToken(user);

    return NextResponse.json({
      message: 'Authenticated successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
