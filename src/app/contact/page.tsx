import React from "react";
import ContactForm from "@/components/ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] py-16 px-4 md:px-8 max-w-3xl mx-auto z-10">
      <div className="ambient-glow-cyan top-1/4 left-10" />
      <div className="ambient-glow-indigo bottom-1/4 right-10" />

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          Contact Me
        </h1>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Have an exciting project, job opening, or collaboration idea? Send a message and let's construct something amazing.
        </p>
      </div>

      <div className="relative z-10 w-full">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
