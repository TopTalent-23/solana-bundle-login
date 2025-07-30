import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

// Generate JWT token (simplified version without external library for now)
function generateToken(user: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    photoUrl: user.photo_url,
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
    const authData = await request.json();
    
    console.log('Received auth data:', { ...authData, hash: authData.hash?.substring(0, 10) + '...' });
    
    if (!verifyTelegramAuth(authData)) {
      console.error('Telegram auth verification failed');
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }
    
    // Check if auth_date is not too old (within 1 hour)
    const authDate = parseInt(authData.auth_date);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authDate > 3600) {
      console.error('Auth data too old:', { authDate, currentTime, diff: currentTime - authDate });
      return NextResponse.json({ error: 'Authentication expired' }, { status: 401 });
    }
    
    const token = generateToken(authData);
    
    const user = {
      id: authData.id,
      firstName: authData.first_name,
      lastName: authData.last_name,
      username: authData.username,
      photoUrl: authData.photo_url
    };
    
    console.log('Successfully authenticated user:', user.firstName);
    
    return NextResponse.json({
      user,
      token
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}