"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

export function HowItWorks() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const steps = [
    {
      title: "Connect your email",
      description:
        "Link your email account to Maestro with our secure OAuth integration. We only scan for internship-related emails.",
    },
    {
      title: "Add your applications",
      description:
        "Manually add existing applications or let Maestro automatically detect them from your email history.",
    },
    {
      title: "Get automatic updates",
      description:
        "Our AI scans incoming emails and updates your application statuses in real-time, from application to offer.",
    },
    {
      title: "Stay organized",
      description:
        "View all your applications in one dashboard, with important dates, status changes, and next steps.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How Maestro works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Get started in minutes and let Maestro do the heavy lifting
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="bg-gradient-to-tr from-[#9333EA]/10 to-[#9333EA]/5 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
              <Image
                src="/placeholder.svg?height=800&width=800"
                alt="Maestro Dashboard"
                width={800}
                height={800}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-zinc-400">Live updates</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9333EA]/20 flex items-center justify-center">
                  <span className="font-bold text-[#9333EA]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
