import { NextResponse } from 'next/server';

// Health check endpoint for monitoring
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Boost Legends API',
    version: '1.0.2',
    environment: process.env.NODE_ENV || 'development'
  });
}