"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

enum PasswordStrength {
  NONE = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4,
}

interface StrengthConfig {
  text: string;
  color: string;
}

const STRENGTH_CONFIGS: Record<PasswordStrength, StrengthConfig> = {
  [PasswordStrength.NONE]: { text: "", color: "bg-zinc-800" },
  [PasswordStrength.WEAK]: { text: "Weak", color: "bg-red-500" },
  [PasswordStrength.FAIR]: { text: "Fair", color: "bg-yellow-500" },
  [PasswordStrength.GOOD]: { text: "Good", color: "bg-blue-500" },
  [PasswordStrength.STRONG]: { text: "Strong", color: "bg-green-500" },
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Form submitted"); // 🧪 Test if this prints
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Success - redirect to login page
      router.push("/login");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (): PasswordStrength => {
    if (!password) return PasswordStrength.NONE;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength as PasswordStrength;
  };

  const strengthText = (): string => {
    return STRENGTH_CONFIGS[passwordStrength()].text;
  };

  const strengthColor = (): string => {
    return STRENGTH_CONFIGS[passwordStrength()].color;
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
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-zinc-400">
              Start tracking your internship applications today
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-[#9333EA]" : "bg-zinc-800"
                }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : <span>1</span>}
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${
                  step >= 2 ? "bg-[#9333EA]" : "bg-zinc-800"
                }`}
              ></div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-[#9333EA]" : "bg-zinc-800"
                }`}
              >
                <span>2</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-zinc-400">
              <span>Account details</span>
              <span>Confirmation</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}
            {step === 1 ? (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9333EA] transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
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
                      minLength={8}
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

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 w-6 rounded-full ${
                                i <= passwordStrength()
                                  ? strengthColor()
                                  : "bg-zinc-800"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs text-zinc-400">
                          {strengthText()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Use 8+ characters with a mix of letters, numbers &
                        symbols
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Confirm your details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-400">Name</p>
                    <p>{name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p>{email}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="feedback"
                          className="h-4 w-4 rounded border-zinc-600 text-[#9333EA] focus:ring-[#9333EA]"
                        />
                        <label htmlFor="feedback" className="ml-2 text-sm">
                          I agree to receive surveys and feedback forms
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 bg-transparent border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`py-3 px-4 bg-[#9333EA] hover:bg-[#7e22ce] text-white font-medium rounded-lg transition-colors flex justify-center items-center ${
                  step === 1 ? "w-full" : "w-auto"
                }`}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : step === 1 ? (
                  "Continue"
                ) : (
                  "Create account"
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#9333EA] hover:text-[#7e22ce] transition-colors"
                >
                  Sign in
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
                <h3 className="text-xl font-bold mb-4">
                  Why students love Maestro
                </h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="h-6 w-6 rounded-full bg-[#9333EA]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#9333EA]" />
                    </div>
                    <p className="text-zinc-300">
                      Automatically track all your internship applications in
                      one place
                    </p>
                  </li>
                  <li className="flex">
                    <div className="h-6 w-6 rounded-full bg-[#9333EA]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#9333EA]" />
                    </div>
                    <p className="text-zinc-300">
                      Get real-time updates when your application status changes
                    </p>
                  </li>
                  <li className="flex">
                    <div className="h-6 w-6 rounded-full bg-[#9333EA]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#9333EA]" />
                    </div>
                    <p className="text-zinc-300">
                      Never miss an important email or deadline again
                    </p>
                  </li>
                  <li className="flex">
                    <div className="h-6 w-6 rounded-full bg-[#9333EA]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#9333EA]" />
                    </div>
                    <p className="text-zinc-300">
                      Get insights on your application success rate and areas
                      for improvement
                    </p>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-zinc-700/50">
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
                      Join 10,000+ students today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
