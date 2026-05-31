import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

export const Signup = () => {
  const navigate = useNavigate();
  const { register, error: authError, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!firstName || !lastName || !email || !password) {
      setFormError('Please complete all fields.');
      return;
    }

    try {
      await register(email, password, firstName, lastName);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Unable to sign up. Please try again.');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,_#08101f_0%,_#112a4b_60%,_#f2e8d8_100%)] px-4 py-10">
      <div className="w-full max-w-2xl bg-[rgba(255,255,255,0.95)] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-[var(--color-primary)]">Create account</h1>
            <p className="text-[var(--color-muted)]">Sign up to start booking hotels, saving trips, and managing reservations.</p>

            {formError && <div className="rounded-2xl bg-red-100 px-4 py-3 text-red-700">{formError}</div>}
            {authError && <div className="rounded-2xl bg-red-100 px-4 py-3 text-red-700">{authError}</div>}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-primary)]">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl input-glow px-4 py-3"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-primary)]">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl input-glow px-4 py-3"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-2xl px-4 py-3 text-white font-semibold disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-[var(--color-muted)] lg:col-span-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[var(--color-secondary)] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
