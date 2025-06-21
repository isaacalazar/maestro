"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#9333EA]/10 to-transparent opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
              Finding internships is hard.{" "}
              <span className="text-[#9333EA]">Tracking them is easy.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8">
              The all-in-one platform that automatically tracks your internship
              applications by scanning your emails and keeping everything
              organized.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/login"
                className="relative inline-flex min-w-max px-6 py-3 justify-center items-center text-xl font-medium border border-[#8043C8] rounded-lg transition-[background-size,box-shadow] duration-[150ms] ease-in-out [--c1:#B301B3] [--c2:#381DBD] [--c3:#381dbd] [--rx:18px] [background-image:radial-gradient(134.26%_244.64%_at_42.92%_-80.36%,var(--c1)_25.45%,var(--c2)_100%)] [background-size:100%_100%] hover:bg-[length:100%_200%] hover:shadow-[0px_0px_8px_0px_rgba(180,40,180,0.35),0px_0px_24px_0px_rgba(102,43,223,0.35)] active:[--c1:#9A059A] active:[--c2:#2409A9] active:scale-95 active:bg-[length:100%_100%] active:shadow-[0px_0px_11.7px_0px_rgba(180,40,180,0.50),0px_0px_28.8px_0px_rgba(102,43,223,0.50)] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
              >
                Get Started Free
              </Link>
              <Link href="#how-it-works" className="primary-button-outline">
                See How It Works
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`relative mx-auto max-w-5xl transition-all duration-1000 delay-300 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-tr from-[#9333EA]/10 to-[#9333EA]/5 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="relative aspect-[16/9]">
              <iframe
                src="https://www.loom.com/embed/a672f0b8a9a04c238850a0e6880c15f8"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title="Product Demo Video"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-3 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#9333EA]"></div>
              <span className="text-sm text-zinc-400">
                Tracking 24 applications
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
