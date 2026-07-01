'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import { useAuthActions } from '@/hooks/useAuthActions';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuthActions();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      return;
    }
    await signup(form);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--surface-1)]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <LayoutDashboard size={14} color="#fff" />
          </div>
          <span className="text-sm font-medium">CollabBoard</span>
        </div>

        <h1 className="text-xl font-medium text-[var(--text-primary)] mb-1">
          Create an account
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Start building boards with your team.
        </p>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            label="First name"
            name="firstName"
            placeholder="Hazem"
            value={form.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last name"
            name="lastName"
            placeholder="Ghannem"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-1">
          <div className="relative">
            <Input
              label="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="8+ characters"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              Icon={showPassword ? EyeOff : Eye}
              ButtonClick={() => setShowPassword((p) => !p)}
            />
          </div>
        </div>
        {/* Error */}
        {error && (
          <p className="text-xs text-[var(--text-danger,#E24B4A)] mb-3 mt-1">
            {error}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
          className="w-full h-9 mt-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
