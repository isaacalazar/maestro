"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { Command } from "lucide-react";

export function WorkflowSteps() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Capture the Problem",
      subtitle: "Start tracking your applications",
      description:
        "Connect your email and let Maestro automatically detect your internship applications, or add them manually.",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-purple-600 to-indigo-700",
    },
    {
      title: "Track Your Progress",
      subtitle: "Stay on top of your applications",
      description:
        "View all your applications in one dashboard with real-time status updates and important deadlines.",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-blue-600 to-cyan-700",
    },
    {
      title: "Get Insights",
      subtitle: "Understand your application patterns",
      description:
        "Analyze your application success rates and identify areas for improvement with our AI-powered insights.",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-emerald-600 to-teal-700",
    },
    {
      title: "Land Your Dream Job",
      subtitle: "Achieve your career goals",
      description:
        "Focus on preparing for interviews while Maestro handles the tedious tracking and organization.",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-rose-600 to-pink-700",
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Left side vertical line with dots */}
      <div className="absolute left-8 top-0 bottom-0 hidden lg:block">
        <div className="h-full w-0.5 bg-gradient-to-b from-[#9333EA]/30 via-[#9333EA]/10 to-[#9333EA]/30 relative">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`absolute w-4 h-4 rounded-full -left-[7px] transition-all duration-300 ${
                activeStep === index ? "bg-[#9333EA]" : "bg-[#9333EA]/30"
              }`}
              style={{ top: `${(index + 1) * 25}%` }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeStep === index ? 1 : 0,
              y: activeStep === index ? 0 : 20,
              display: activeStep === index ? "block" : "none",
            }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1">
              <div className="text-[#9333EA] mb-2">{step.subtitle}</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {step.title}
              </h2>
              <p className="text-zinc-400 text-lg mb-8">{step.description}</p>

              <div className="flex items-center gap-2 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 max-w-md">
                <Command className="h-5 w-5 text-[#9333EA]" />
                <span className="text-zinc-300">
                  Connect your email to get started
                </span>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div
                className={`bg-gradient-to-tr ${step.color} rounded-xl overflow-hidden border border-zinc-800 shadow-2xl opacity-10 absolute inset-0`}
              ></div>
              <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex justify-center mt-12">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-all ${
                activeStep === index ? "bg-[#9333EA]" : "bg-zinc-700"
              }`}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
