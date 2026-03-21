'use client';

import { useState } from 'react';

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to Google OAuth
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'openid email profile';
      const responseType = 'code';

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId || '',
        redirect_uri: redirectUri,
        response_type: responseType,
        scope: scope,
      }).toString()}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login error:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.25,12.545,1.25 c-6.343,0-11.5,5.157-11.5,11.5c0,6.343,5.157,11.5,11.5,11.5c6.344,0,11.5-5.157,11.5-11.5c0-0.828-0.084-1.628-0.239-2.405 H12.545z" />
      </svg>
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
