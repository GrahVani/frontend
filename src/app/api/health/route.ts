import { NextResponse } from 'next/server';

export function GET() {
    return NextResponse.json({
        status: 'ok',
        service: 'grahvani-frontend',
        version: process.env.npm_package_version || '0.1.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV,
    });
}
