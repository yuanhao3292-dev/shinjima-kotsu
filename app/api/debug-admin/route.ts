import { NextResponse } from 'next/server';

export async function GET() {
  const adminEmails = process.env.ADMIN_EMAILS || '(not set)';

  return NextResponse.json({
    ADMIN_EMAILS: adminEmails,
    parsed: adminEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean),
    check_yuanhao: adminEmails.toLowerCase().includes('yuanhao3292@gmail.com'),
  });
}
