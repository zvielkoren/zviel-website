"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { FaPaperPlane, FaCheckCircle, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  // Countdown timer for rate limiting
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setRateLimitError(null);
      
      // Local Rate Limiting validation
      const lastSent = localStorage.getItem("contact_form_last_sent");
      const now = Date.now();
      if (lastSent && now - parseInt(lastSent) < 60000) {
        const remainingSeconds = Math.ceil((60000 - (now - parseInt(lastSent))) / 1000);
        setCountdown(remainingSeconds);
        setRateLimitError(`Please wait ${remainingSeconds} seconds before sending another message.`);
        return;
      }

      setIsSending(true);
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
      };

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      await emailjs.send(serviceId!, templateId!, templateParams, userId!);
      
      // Store success timestamp in localStorage
      localStorage.setItem("contact_form_last_sent", Date.now().toString());
      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      console.error("Error sending email:", error);
      setRateLimitError(error.message || "An error occurred while sending your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel border border-white/10 max-w-lg mx-auto py-10 px-6 text-center shadow-2xl rounded-2xl relative overflow-hidden bg-[#0c1325]/85">
        <div className="ambient-glow-cyan top-1/4 -left-12 w-24 h-24 blur-2xl" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400">
            <FaCheckCircle className="text-5xl animate-pulse" />
          </div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Message Dispatched!
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
            Thank you for reaching out. Your message has been successfully transmitted. I will respond to your inquiry shortly!
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-4 px-5 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel border border-white/5 max-w-lg mx-auto p-8 rounded-2xl shadow-2xl relative bg-[#0c1325]/60">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-left">
        
        {/* Rate Limiting or Global Error Indicator */}
        {(rateLimitError || countdown > 0) && (
          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <FaExclamationTriangle className="shrink-0" />
            <span>
              {countdown > 0 
                ? `Please wait ${countdown} seconds before sending another message.`
                : rateLimitError
              }
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="name" className="text-gray-300 font-semibold text-sm">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 ${
              errors.name ? "border-red-500/50" : "border-white/5 hover:border-white/10 focus:border-cyan-500"
            }`}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-400 text-xs mt-1 font-medium">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="email" className="text-gray-300 font-semibold text-sm">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 ${
              errors.email ? "border-red-500/50" : "border-white/5 hover:border-white/10 focus:border-cyan-500"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="message" className="text-gray-300 font-semibold text-sm">
            Message Body <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Type your message..."
            rows={4}
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 resize-none ${
              errors.message ? "border-red-500/50" : "border-white/5 hover:border-white/10 focus:border-cyan-500"
            }`}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <span className="text-red-400 text-xs mt-1 font-medium">{errors.message.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSending || countdown > 0}
          className="w-full flex items-center gap-2 justify-center font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-xl px-6 py-3 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 shadow-lg shadow-cyan-500/20 text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isSending ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <FaPaperPlane className="text-xs" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
