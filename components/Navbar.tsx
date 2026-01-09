"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthData {
  email: string;
  password: string;
  username?: string;
}

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loginData, setLoginData] = useState<AuthData>({ email: '', password: '' });
  const [signupData, setSignupData] = useState<AuthData & { username?: string }>({ email: '', password: '', username: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);

      setIsLoginOpen(false);
      setLoginData({ email: '', password: '' });
      // TODO: Update app state to show user is logged in
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      // Store tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);

      setIsSignupOpen(false);
      setSignupData({ email: '', password: '', username: '' });
      // TODO: Update app state to show user is logged in
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className={cn("fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50", className)}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/showup-icon.svg"
                alt="Showup Icon"
                width={32}
                height={32}
                className="drop-shadow-sm"
              />
              <div className="text-2xl font-serif font-bold text-foreground">
                Showup
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                className="neumorphic-inset hover:bg-muted hover:border-primary/50 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </button>
              <button
                className="neumorphic hover:scale-105 hover:shadow-lg transition-all duration-300 px-4 py-2 rounded-lg font-medium"
                onClick={() => setIsSignupOpen(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="neumorphic max-w-md w-full mx-4 p-6 rounded-xl bg-background">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold">Login</h3>
              <button
                onClick={() => {
                  setIsLoginOpen(false);
                  setError('');
                  setLoginData({ email: '', password: '' });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center p-2 neumorphic-inset rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inset rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inset rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full neumorphic hover:scale-105 transition-all duration-300 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="neumorphic max-w-md w-full mx-4 p-6 rounded-xl bg-background">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold">Sign Up</h3>
              <button
                onClick={() => {
                  setIsSignupOpen(false);
                  setError('');
                  setSignupData({ email: '', password: '', username: '' });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center p-2 neumorphic-inset rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inset rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Username (optional)</label>
                <input
                  type="text"
                  value={signupData.username || ''}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inset rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inset rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Create a password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full neumorphic hover:scale-105 transition-all duration-300 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}