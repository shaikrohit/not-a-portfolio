import { NextRequest, NextResponse } from 'next/server';
import { declineTriviaScore } from '@/app/_actions/trivia';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');

  if (!id || !secret) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const result = await declineTriviaScore(id, secret);

  if (result.success) {
    return new NextResponse(
      `
      <html>
        <head>
          <title>Submission Declined</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fef2f2; color: #991b1b; }
            .card { background: white; padding: 2rem; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #fecaca; text-align: center; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🗑️ Submission Declined</h1>
            <p>The record has been permanently deleted from the database.</p>
            <a href="/" style="color: #dc2626; text-decoration: none; font-weight: bold;">Return to Portfolio</a>
          </div>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } else {
    return NextResponse.json({ error: result.error || 'Failed to decline' }, { status: 400 });
  }
}
