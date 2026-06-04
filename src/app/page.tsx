"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { LiveClock } from "@/utils/liveClock";
import { Card, CardHeader, CardContent, Chip, Button } from "@heroui/react";
import { FaArrowRight, FaEnvelope, FaCode, FaServer, FaBrain } from "react-icons/fa";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const [topSkills, setTopSkills] = useState<string[]>(["TypeScript", "Java", "Python", "SQL", "Rust"]);
  const [otherSkills, setOtherSkills] = useState<string[]>(["JavaScript", "Next.js", "C#", "Node.js", "Kotlin", "React", "Docker", "Git"]);

  useEffect(() => {
    fetch("/api/languages")
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const core = data.filter(l => l.type === "core").map(l => l.name);
          const other = data.filter(l => l.type === "other").map(l => l.name);
          setTopSkills(core);
          setOtherSkills(other);
        }
      })
      .catch(err => console.error("Failed to fetch languages:", err));
  }, []);


  return (
    <main className="relative min-h-screen overflow-hidden py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between z-10">
      {/* Decorative ambient glowing grids */}
      <div className="ambient-glow-cyan top-1/4 -left-32" />
      <div className="ambient-glow-indigo top-1/2 -right-32" />

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center mt-8 md:mt-16 mb-20 relative z-10"
      >
        <motion.div variants={itemVariants} className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <div className="relative border-4 border-[#080e1b] rounded-full overflow-hidden w-40 h-40">
            <Image
              src="/profile-picture.png"
              alt="Zviel Koren"
              fill
              sizes="160px"
              className="object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
              draggable="false"
              priority
            />
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Zviel Koren
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-400 font-medium mb-8 max-w-lg"
        >
          Full Stack Developer
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-10 px-4"
        >
          Hi, I'm Zviel — a Systems & Full-Stack Engineer dedicated to building high-performance, scalable, and elegant digital experiences. I specialize in robust backend architecture, modern frontend design, and low-level optimization to deliver fast, reliable, and user-centric software
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 justify-center font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-full px-6 py-3 transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-cyan-500/20 text-base"
          >
            <span>Explore Projects</span>
            <FaArrowRight className="text-xs" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 justify-center font-semibold border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-gray-200 transition-all hover:scale-105 active:scale-95 duration-200 rounded-full px-6 py-3 text-base bg-white/5 hover:bg-white/10"
          >
            <FaCode className="text-xs" />
            <span>View Services</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 justify-center font-semibold border border-white/20 hover:border-indigo-400 hover:text-indigo-400 text-gray-200 transition-all hover:scale-105 active:scale-95 duration-200 rounded-full px-6 py-3 text-base bg-white/5 hover:bg-white/10"
          >
            <FaEnvelope />
            <span>Get in Touch</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="skills"
        className="w-full max-w-5xl mx-auto my-12 relative z-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Technical Skillset
          </h2>
          <p className="text-gray-400 mt-2">Tools, languages, and frameworks in my sandbox</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Card className="glass-panel border-white/5 shadow-xl hover:shadow-cyan-950/20 hover:border-cyan-500/30 transition-all duration-300">
            <CardHeader className="flex gap-3 px-6 pt-6">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <FaCode size={20} />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-lg font-bold text-white">Core Technologies</p>
                <p className="text-xs text-gray-400">Primary programming languages</p>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4 flex flex-row flex-wrap gap-2.5">
              {topSkills.map((skill) => (
                <Chip
                  key={skill}
                  variant="soft"
                  color="accent"
                  className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:scale-105 hover:bg-cyan-500/20 transition-all duration-200 text-sm py-1.5 px-3"
                >
                  {skill}
                </Chip>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 shadow-xl hover:shadow-indigo-950/20 hover:border-indigo-500/30 transition-all duration-300">
            <CardHeader className="flex gap-3 px-6 pt-6">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <FaServer size={20} />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-lg font-bold text-white">Frameworks & Tools</p>
                <p className="text-xs text-gray-400">Modern stack extensions</p>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4 flex flex-row flex-wrap gap-2.5">
              {otherSkills.map((skill) => (
                <Chip
                  key={skill}
                  variant="soft"
                  color="accent"
                  className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:scale-105 hover:bg-indigo-500/20 transition-all duration-200 text-sm py-1.5 px-3"
                >
                  {skill}
                </Chip>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-8 mt-20 border-t border-white/5 relative z-10 flex flex-col items-center">
        <LiveClock />
      </footer>
    </main>
  );
}
