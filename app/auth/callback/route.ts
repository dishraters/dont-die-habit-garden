import { NextRequest, NextResponse } from 'next/server';

function parseStateRedirect(state: string | null) {
  if (!state) return '/';

  try {
    const parsed = JSON.parse(decodeURIComponent(state));
    return typeof parsed?.redirect === 'string' ? parsed.redirect : '/';
  } catch {
    return '/';
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const redirect = parseStateRedirect(state);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/auth/callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId || '',
        client_secret: clientSecret || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error || 'token_exchange_failed'}`, request.url));
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userInfo = await userInfoResponse.json();

    const issueResponse = await fetch(new URL('/api/auth/validate', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'issue',
        user: {
          id: userInfo.id || userInfo.email,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      }),
    });
    const issued = await issueResponse.json();

    if (!issueResponse.ok || !issued?.token || !issued?.user) {
      return NextResponse.redirect(new URL('/login?error=issue_failed', request.url));
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('token', issued.token);
    loginUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(issued.user)));
    loginUrl.searchParams.set('redirect', redirect);

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
