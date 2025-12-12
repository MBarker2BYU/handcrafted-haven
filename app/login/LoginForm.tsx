// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { loginAction } from '@/app/lib/actions';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(undefined, formData);

    if (result?.message) {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-osu-xl p-10 space-y-8">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-bold">
          {error}
        </div>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={loading}
        className="w-full px-6 py-4 text-lg border-2 border-silver rounded-xl focus:border-scarlet focus:outline-none transition disabled:opacity-50"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        disabled={loading}
        className="w-full px-6 py-4 text-lg border-2 border-silver rounded-xl focus:border-scarlet focus:outline-none transition disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-scarlet hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xl py-5 rounded-xl transition flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Logging In...
          </>
        ) : (
          'Log In'
        )}
      </button>

      <p className="text-center text-gray">
        New here? <a href="/register" className="text-scarlet font-bold hover:underline">Register</a>
      </p>
    </form>
  );
}