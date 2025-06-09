"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-zinc-800 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#9333EA] mr-2 flex items-center justify-center">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="font-bold text-xl">Maestro</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Testimonials
            </Link>
            <Link
              href="#how-it-works"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link className="primary-button-outline" href="/login">
              Log in
            </Link>
            <div className="relative">
              <Link className="primary-button" href="signup">
                Sign up
              </Link>
              <div className="absolute -top-1 -right-1 bg-[#9333EA] text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full">
                PRO
              </div>
            </div>
          </div>

          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="#features"
              className="block text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="block text-zinc-400 hover:text-white transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#how-it-works"
              className="block text-zinc-400 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="block text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                href="/login"
                className="bg-transparent text-white font-medium px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <button className="primary-button w-full">Sign up</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
