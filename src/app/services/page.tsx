"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCode,
  FaServer,
  FaBrain,
  FaWrench,
  FaHandshake,
  FaRocket,
  FaComments,
  FaArrowRight
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Chip,
  Button
} from "@heroui/react";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  category: string;
  description: string;
  techs: string[];
  colorClass: string;
}

interface TierItem {
  icon: React.ReactNode;
  title: string;
  priceEstimate: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaText: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: <FaCode size={24} />,
    title: "Full-Stack Web Applications",
    category: "Frontend & Logic",
    description: "Engineering beautiful, highly responsive frontend interfaces backed by fast logical layers. Designed with type-safety and modern performance patterns.",
    techs: ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "HeroUI"],
    colorClass: "from-cyan-400 to-teal-400 text-cyan-400"
  },
  {
    icon: <FaServer size={24} />,
    title: "Backend & Cloud Architecture",
    category: "Infrastructure & APIs",
    description: "Designing robust, highly concurrent backend systems, microservices, and database schemas. Optimized for rapid scaling and serverless edge runtimes.",
    techs: ["Node.js", "Rust", "Python", "SQL / NoSQL", "Docker", "Serverless Edge"],
    colorClass: "from-indigo-400 to-cyan-400 text-indigo-400"
  },
  {
    icon: <FaBrain size={24} />,
    title: "AI & Agentic Orchestration",
    category: "Intelligence & Automations",
    description: "Integrating intelligent LLM functions into modern business logic. Constructing stateful, tool-enabled autonomous agents and scalable pipelines.",
    techs: ["Gemini API", "LangChain", "Autonomous Workflows", "Structured JSON Outputs"],
    colorClass: "from-purple-400 to-indigo-400 text-purple-400"
  },
  {
    icon: <FaWrench size={24} />,
    title: "Developer Tooling & Systems",
    category: "Performance & DX",
    description: "Creating premium developer tools, hand-written compiler pipelines, performance-tuned CLI engines, and isolated helper scripts to optimize team productivity.",
    techs: ["Rust", "Python", "Compiler Design", "Bash scripting", "Automation"],
    colorClass: "from-teal-400 to-purple-400 text-teal-400"
  }
];

const TIERS: TierItem[] = [
  {
    icon: <FaComments className="text-cyan-400" size={20} />,
    title: "Strategy & Consultation",
    priceEstimate: "Hourly or Flat Audit",
    description: "Focused sessions to design system architecture, audit codebases for performance issues, solve complex bugs, and map out product roadmaps.",
    features: [
      "1-on-1 collaborative session",
      "System architecture review",
      "TypeScript & React optimization",
      "Actionable technical report"
    ],
    popular: false,
    ctaText: "Book Consultation"
  },
  {
    icon: <FaRocket className="text-teal-400" size={20} />,
    title: "End-to-End Projects",
    priceEstimate: "Milestone-Based Fixed Quote",
    description: "Full product engineering from planning to deployment. Ideal for launching MVPs, coding custom compilers, or building secure agent workflows.",
    features: [
      "Strict scope & design mockups",
      "Full-stack/Backend/AI build",
      "Production-ready deployment",
      "30 days post-launch support"
    ],
    popular: true,
    ctaText: "Start a Project"
  },
  {
    icon: <FaHandshake className="text-indigo-400" size={20} />,
    title: "Retainer Partnership",
    priceEstimate: "Monthly Technical Advisor",
    description: "Ongoing developer scaling, regular advisory, direct priority communication, and technical team support for growing architectures.",
    features: [
      "Priority communication access",
      "Flexible monthly engineering hours",
      "Systems maintenance & features",
      "Strategic tech stack direction"
    ],
    popular: false,
    ctaText: "Partner Together"
  }
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* Decorative background gradients */}
      <div className="ambient-glow-cyan top-1/4 -right-16" />
      <div className="ambient-glow-indigo bottom-1/4 -left-16" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >
        <Chip
          size="sm"
          variant="soft"
          color="accent"
          className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold mb-4"
        >
          ENGINEERING & INTEGRATIONS
        </Chip>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Professional Services
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Crafting elite software systems, type-safe full-stack platforms, autonomous agentic integrations, and developer tooling.
        </p>
      </motion.div>

      {/* Services Grid */}
      <section className="my-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-panel border-white/5 shadow-xl hover:shadow-cyan-950/20 hover:border-cyan-500/30 transition-all duration-300 h-full flex flex-col justify-between text-left group">
                <CardHeader className="flex gap-4 p-6">
                  <div className={`p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300 ${service.colorClass.split(" ")[2]}`}>
                    {service.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold font-mono">
                      {service.category}
                    </span>
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mt-0.5">
                      {service.title}
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-0 flex-grow">
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
                  {service.techs.map((tech) => (
                    <Chip
                      key={tech}
                      size="sm"
                      variant="soft"
                      className="bg-white/5 text-gray-300 border border-white/5 text-xs font-medium py-0.5"
                    >
                      {tech}
                    </Chip>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collaboration / Pricing Tiers */}
      <section className="my-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Collaboration Channels
          </h2>
          <p className="text-gray-400 mt-2">Flexible engagements tailored to your product needs</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                className={`glass-panel border-white/5 h-full flex flex-col justify-between text-left transition-all duration-300 relative group !overflow-visible ${
                  tier.popular
                    ? "border-cyan-500/30 shadow-2xl shadow-cyan-950/20 bg-gradient-to-b from-[#0c1325]/90 to-[#060a13]/95 scale-105 z-10"
                    : "hover:border-white/15"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-teal-400 text-[#080e1b] font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md z-20">
                    Most Requested
                  </span>
                )}
                
                <CardHeader className="flex flex-col items-start gap-2 p-6 pb-2 text-left">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 mb-2">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{tier.title}</h3>
                  <div className="text-sm font-semibold text-cyan-400 mt-1 font-mono uppercase">
                    {tier.priceEstimate}
                  </div>
                </CardHeader>

                <CardContent className="px-6 py-4 flex-grow flex flex-col justify-between">
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {tier.description}
                  </p>
                  
                  <ul className="space-y-3.5 mb-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-300 leading-tight">
                        <span className="text-cyan-400 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 pt-2">
                  <Link href="/contact" className="w-full">
                    <Button
                      variant={tier.popular ? "primary" : "ghost"}
                      className={`w-full font-bold text-sm py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        tier.popular
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-white/5 text-gray-200 border border-white/15 hover:border-cyan-400 hover:text-cyan-400"
                      }`}
                    >
                      {tier.ctaText}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="my-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden glass-panel border border-white/5 p-8 md:p-12 text-center bg-gradient-to-tr from-[#0a1120]/80 via-[#0c1428]/90 to-[#0e172f]/80 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/10 opacity-30 animate-pulse pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Let's Build Something Exceptional Together
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Have an idea for a web platform, a custom compiler, or want to automate complex business workflows using autonomous agent pipelines? Let's strategize and engineer it.
            </p>
            <Link href="/contact" className="mt-4">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-base py-3 px-8 rounded-full shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95 duration-200 inline-flex items-center gap-2"
              >
                <span>Initiate Contact</span>
                <FaArrowRight className="text-xs" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
