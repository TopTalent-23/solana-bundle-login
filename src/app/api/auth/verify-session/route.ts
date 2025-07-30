import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Store active auth sessions temporarily (in production, use Redis or a database)
const authSessions = new Map<string, any>();

// Generate JWT token (simplified version)
function generateToken(user: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    id: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
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
    const { sessionToken } = await request.json();
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token required' }, { status: 400 });
    }
    
    const session = authSessions.get(sessionToken);
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    
    // Check if session is not too old (5 minutes)
    if (Date.now() - session.timestamp > 5 * 60 * 1000) {
      authSessions.delete(sessionToken);
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    
    // Generate JWT token
    const token = generateToken(session);
    
    // Delete the session token after use
    authSessions.delete(sessionToken);
    
    const user = {
      id: session.userId,
      firstName: session.firstName,
      lastName: session.lastName,
      username: session.username
    };
    
    return NextResponse.json({
      user,
      token
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to create session (this would be called by the bot)
export function createSession(userId: string, firstName: string, lastName?: string, username?: string): string {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  authSessions.set(sessionToken, {
    userId,
    firstName,
    lastName,
    username,
    timestamp: Date.now()
  });
  
  // Clean up old sessions (older than 5 minutes)
  for (const [token, session] of authSessions.entries()) {
    if (Date.now() - session.timestamp > 5 * 60 * 1000) {
      authSessions.delete(token);
    }
  }
  
  return sessionToken;
}