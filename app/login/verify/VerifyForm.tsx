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
    <div className="min-h-screen bg-ink noise-overlay flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 border-r border-paper/10 px-12 py-16 relative overflow-hidden">
        <div>
          <a href="/" className="font-heading italic text-3xl text-paper hover:text-rust transition-colors">
            Pass
          </a>
        </div>
        <div>
          <p className="font-heading italic text-5xl text-paper leading-tight mb-6">
            Your code<br />
            is on<br />
            <span className="text-rust">its way.</span>
          </p>
          <p className="font-mono text-xs text-paper/30 max-w-xs leading-relaxed">
            Check your email. The code expires in 10 minutes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-chalkboard" />
          <span className="font-mono text-[10px] text-paper/40">code sent to {email}</span>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16">
        <div className="lg:hidden mb-12">
          <a href="/" className="font-heading italic text-2xl text-paper hover:text-rust transition-colors">
            Pass
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-sm w-full"
        >
          <div className="mb-10">
            <p className="font-mono text-[10px] text-paper/40 tracking-[0.3em] mb-3">
              enter the code
            </p>
            <h1 className="font-heading italic text-4xl text-paper">
              Check your line
            </h1>
            <p className="font-mono text-xs text-paper/30 mt-2">
              Sent to {email}
            </p>
          </div>

          {error && (
            <div className="border border-brick/50 bg-brick/10 px-4 py-3 mb-6">
              <p className="font-mono text-xs text-brick">{decodeURIComponent(error)}</p>
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
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-paper text-ink font-mono text-sm py-4 hover:bg-rust hover:text-paper transition-colors duration-300"
            >
              Confirm and enter
            </motion.button>
          </form>

          <p className="font-mono text-[10px] text-paper/20 mt-8 text-center">
            Wrong email?{" "}
            <a href="/login" className="text-rust hover:underline">
              Start over
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
