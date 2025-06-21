"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { login } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (result?.error) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-bold">Maestro</h1>
          </div>

          <div className="my-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-zinc-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9333EA] transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9333EA] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#9333EA] hover:text-[#7e22ce] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#9333EA] hover:bg-[#7e22ce] text-white font-medium rounded-lg transition-colors flex justify-center items-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign in"
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#9333EA] hover:text-[#7e22ce] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md">
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-700 mr-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                    <p className="text-zinc-400 text-sm">
                      Computer Science Student
                    </p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-6">
                  &ldquo;Maestro has completely transformed how I manage my
                  internship applications. I used to miss important emails and
                  deadlines, but now everything is organized in one
                  place.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-zinc-800 bg-zinc-700 overflow-hidden"
                      >
                        <Image
                          src={`/placeholder.svg?height=50&width=50&text=${i}`}
                          alt={`User ${i}`}
                          width={50}
                          height={50}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400">
                    Joined by 10,000+ students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
