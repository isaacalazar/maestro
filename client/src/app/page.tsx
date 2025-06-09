import Link from "next/link";
import { Mail, Briefcase, CheckCircle } from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 h-[800px] bg-[linear-gradient(to_bottom,transparent_0%,black_100%)] z-10" />
      <div
        className="absolute inset-0 h-[800px] bg-black [mask-image:linear-gradient(to_bottom,white,transparent)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 0H0V100' stroke='rgba(255, 255, 255, 0.1)' fill='none' /%3E%3C/svg%3E")`,
          backgroundSize: "50px 50px",
          animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <div className="relative z-20">
        <LandingHeader />
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 py-24 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need in one place
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Stop juggling multiple spreadsheets and email folders. Maestro
              brings all your internship applications together.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Mail className="h-8 w-8 text-[#9333EA]" />}
              title="Email Integration"
              description="Automatically scan your inbox for internship updates and status changes. Never miss an important email again."
            />
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-[#9333EA]" />}
              title="Application Tracking"
              description="Keep all your internship applications in one place with real-time status updates and important deadlines."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-[#9333EA]" />}
              title="Smart Status Updates"
              description="Our AI automatically categorizes emails and updates your application statuses without any manual work."
            />
          </div>
        </section>

        <TestimonialSection />

        <HowItWorks />

        <section className="max-w-7xl mx-auto px-4 py-24 md:px-6 border-t border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to streamline your internship search?
            </h2>
            <p className="text-zinc-400 max-w-2xl mb-12 text-lg">
              Join thousands of students who are saving time and reducing stress
              with Maestro.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="relative inline-flex min-w-max px-6 py-3 justify-center items-center text-xl font-medium border border-[#8043C8] rounded-lg transition-[background-size,box-shadow] duration-[150ms] ease-in-out [--c1:#B301B3] [--c2:#381DBD] [--c3:#381dbd] [--rx:18px] [background-image:radial-gradient(134.26%_244.64%_at_42.92%_-80.36%,var(--c1)_25.45%,var(--c2)_100%)] [background-size:100%_100%] hover:bg-[length:100%_200%] hover:shadow-[0px_0px_8px_0px_rgba(180,40,180,0.35),0px_0px_24px_0px_rgba(102,43,223,0.35)] active:[--c1:#9A059A] active:[--c2:#2409A9] active:scale-95 active:bg-[length:100%_100%] active:shadow-[0px_0px_11.7px_0px_rgba(180,40,180,0.50),0px_0px_28.8px_0px_rgba(102,43,223,0.50)] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600">
                Get Started Free
              </button>
              <button className="primary-button-outline">
                See How It Works
              </button>
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-[#9333EA] mr-2 flex items-center justify-center">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="font-bold text-xl">Maestro</span>
            </div>
            <div className="flex gap-8">
              <Link
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
