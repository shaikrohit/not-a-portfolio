import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { approveTriviaScore } from '@/app/_actions/trivia';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');

  if (!id || !secret) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const result = await approveTriviaScore(id, secret);

  if (result.success) {
    return new NextResponse(
      `
      <html>
        <head>
          <title>Score Approved</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0fdf4; color: #166534; }
            .card { background: white; padding: 2rem; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #bbf7d0; text-align: center; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Score Approved!</h1>
            <p>The score has been added to the leaderboard.</p>
            <a href="/" style="color: #16a34a; text-decoration: none; font-weight: bold;">Return to Portfolio</a>
          </div>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } else {
    return NextResponse.json({ error: result.error || 'Failed to approve' }, { status: 400 });
  }
}
