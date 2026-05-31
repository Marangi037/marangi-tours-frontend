import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Unable to log in. Please try again.');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,_#08101f_0%,_#112a4b_60%,_#f2e8d8_100%)] px-4 py-10">
      <div className="w-full max-w-md bg-[rgba(255,255,255,0.95)] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
        <div className="p-10">
          <h1 className="text-5xl font-bold mb-2 text-[var(--color-primary)]">Login</h1>
          <p className="text-[var(--color-muted)] mb-8">Access your travel bookings and manage your next adventure.</p>

          {formError && <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-red-700">{formError}</div>}
          {authError && <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-red-700">{authError}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--color-primary)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl input-glow px-4 py-3"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--color-primary)]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl input-glow px-4 py-3"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-2xl px-4 py-3 text-white font-semibold disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-semibold text-[var(--color-secondary)] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
