import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'frontend',
  })
}
