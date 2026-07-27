"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { verifyOtp } from "../actions";

export function VerifyForm({ email, redirectTo, error }: {
  email: string;
  redirectTo: string;
  error?: string;
}) {
  return (
    <div className="min-h-screen bg-ink noise-overlay flex items-center justify-center p-6">
      
      {/* Back link */}
      <a 
        href="/" 
        className="fixed top-8 left-8 font-mono text-xs text-paper/40 hover:text-paper transition-colors z-50"
      >
        ← back to pass
      </a>

      {/* Main Circular/Pill Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl flex flex-col lg:flex-row bg-paper-dim/5 backdrop-blur-xl border border-paper/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        {/* Left Side — Branding */}
        <div className="lg:w-5/12 bg-chalkboard p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Abstract Circle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-paper/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="font-heading italic text-4xl md:text-5xl text-paper mb-4">
              Verify
            </h2>
            <p className="font-body text-paper/80 leading-relaxed max-w-[200px]">
              We sent a secure code to your inbox.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 lg:mt-0 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-paper animate-pulse" />
            <span className="font-mono text-[10px] text-paper/80">
              awaiting code
            </span>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-xs mx-auto w-full">
            <h1 className="font-heading italic text-3xl text-paper mb-2 text-center">
              Enter Code
            </h1>
            <p className="font-mono text-xs text-paper/40 mb-8 text-center">
              Sent to {email}
            </p>

            {error && (
              <div className="border border-brick/50 bg-brick/10 px-4 py-3 mb-6 rounded-xl">
                <p className="font-mono text-xs text-brick text-center">{decodeURIComponent(error)}</p>
              </div>
            )}

            <form action={verifyOtp} className="flex flex-col gap-4">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Input
                label="One-time code"
                type="text"
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                placeholder="000000"
                dark
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 bg-paper text-ink rounded-full font-mono text-sm py-3.5 hover:bg-chalkboard hover:text-paper transition-colors duration-300 shadow-md"
              >
                Confirm
              </motion.button>
            </form>

            <p className="font-mono text-[10px] text-paper/30 mt-8 text-center">
              Wrong email?{" "}
              <a href="/login" className="text-rust hover:underline">
                Start over
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
