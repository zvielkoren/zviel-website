import React from "react";
import ContactForm from "@/components/ContactForm";
import { FaWhatsapp, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const ContactPage: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] py-16 px-4 md:px-8 max-w-5xl mx-auto z-10">
      {/* Decorative ambient glowing grids */}
      <div className="ambient-glow-cyan top-1/4 left-10" />
      <div className="ambient-glow-indigo bottom-1/4 right-10" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          Contact Me
        </h1>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Have an exciting project, job opening, or collaboration idea? Send a message or reach out through social channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start relative z-10">
        {/* Left Side: Contact Information Cards */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="glass-panel border border-white/5 p-6 rounded-2xl relative overflow-hidden bg-[#0c1325]/40 flex flex-col gap-5">
            <div className="ambient-glow-cyan -top-12 -left-12 w-24 h-24 blur-xl opacity-50" />
            
            <h2 className="text-xl font-bold text-white mb-2">Connect Directly</h2>
            
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/972559519870"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 bg-white/5 hover:bg-emerald-950/20 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <FaWhatsapp className="text-2xl" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">WhatsApp</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  +972 55-951-9870
                </span>
              </div>
            </a>

            {/* Email Link */}
            <a
              href="mailto:contact@zviel.com"
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 bg-white/5 hover:bg-cyan-950/20 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                <FaEnvelope className="text-2xl" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email</span>
                <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  contact@zviel.com
                </span>
              </div>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/zviel-koren-39b6542b2/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 bg-white/5 hover:bg-indigo-950/20 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <FaLinkedin className="text-2xl" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">LinkedIn</span>
                <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  zviel-koren
                </span>
              </div>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/zvielkoren"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-violet-500/30 bg-white/5 hover:bg-violet-950/20 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                <FaGithub className="text-2xl" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">GitHub</span>
                <span className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                  zvielkoren
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="md:col-span-7 w-full">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
