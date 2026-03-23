'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type DDHGUser = {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
};

const AUTH_API = '/api/auth/validate';

function sanitizeRedirect(redirect: string | null) {
  if (!redirect) return '/';

  try {
    const parsed = new URL(redirect, window.location.origin);
    if (!/^https?:$/.test(parsed.protocol)) return '/';
    return parsed.toString();
  } catch {
    return '/';
  }
}

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTarget = useMemo(() => sanitizeRedirect(searchParams.get('redirect')), [searchParams]);
  const callbackToken = searchParams.get('token');
  const callbackUser = searchParams.get('user');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persistAuth = (token: string, user: DDHGUser) => {
    localStorage.setItem('ddhg_auth_token', token);
    localStorage.setItem('ddhg_user_id', user.id);
    localStorage.setItem('ddhg_user', JSON.stringify(user));
  };

  const finishLogin = (token: string, user: DDHGUser) => {
    persistAuth(token, user);
    window.location.href = redirectTarget;
  };

  useEffect(() => {
    if (!callbackToken || !callbackUser) return;

    try {
      const user = JSON.parse(decodeURIComponent(callbackUser)) as DDHGUser;
      finishLogin(callbackToken, user);
    } catch {
      setError('Could not finish sign-in. Please try again.');
    }
  }, [callbackToken, callbackUser, redirectTarget]);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'openid email profile';
    const state = encodeURIComponent(JSON.stringify({ redirect: redirectTarget }));

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      state,
    }).toString()}`;

    window.location.href = authUrl;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userName = email.split('@')[0] || 'DDHG User';
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'issue',
          user: {
            id: email.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            name: userName,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.token || !data?.user) {
        throw new Error(data?.error || 'Login failed');
      }

      finishLogin(data.token, data.user as DDHGUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            🌱 DDHG
          </h1>
          <p className="text-gray-600 mt-2">Don&apos;t Die Habit Garden</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.25,12.545,1.25 c-6.343,0-11.5,5.157-11.5,11.5c0,6.343,5.157,11.5,11.5,11.5c6.344,0,11.5-5.157,11.5-11.5c0-0.828-0.084-1.628-0.239-2.405 H12.545z" />
          </svg>
          Sign in with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4 break-all">
          Redirect after login: <span className="font-medium text-gray-800">{redirectTarget}</span>
        </p>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <a href="/auth" className="text-green-600 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" />}>
      <LoginContent />
    </Suspense>
  );
}
