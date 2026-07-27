"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { signInWithPassword, signInWithOtp, signInWithGoogle } from "./actions";

const CLOCK_LINES = [
  "19:12 — table 4 — fired",
  "19:09 — table 9 — in progress",
  "19:04 — table 12 — served",
  "18:58 — table 7 — bumped",
  "18:51 — table 2 — served",
];

function ClockLog() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {CLOCK_LINES.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0.25, 0] }}
          transition={{
            delay: i * 1.8,
            duration: 5,
            repeat: Infinity,
            repeatDelay: CLOCK_LINES.length * 1.8 - 5,
          }}
          className="absolute font-mono text-[10px] text-rust/50"
          style={{ top: `${15 + i * 18}%`, left: `${5 + (i % 3) * 10}%` }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="min-h-screen bg-ink noise-overlay flex">
      {/* Left — decoration panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 border-r border-paper/10 px-12 py-16 relative overflow-hidden">
        <ClockLog />
        <div>
          <a href="/" className="font-heading italic text-3xl text-paper hover:text-rust transition-colors">
            Pass
          </a>
        </div>
        <div>
          <p className="font-heading italic text-5xl text-paper leading-tight mb-6">
            The kitchen<br />
            is waiting<br />
            <span className="text-rust">for you.</span>
          </p>
          <p className="font-mono text-xs text-paper/30 max-w-xs leading-relaxed">
            Staff and managers only beyond this point. 
            Customers, use the menu directly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rust animate-pulse" />
          <span className="font-mono text-[10px] text-paper/40">kitchen systems online</span>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16">
        {/* Mobile logo */}
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
              clocking in
            </p>
            <h1 className="font-heading italic text-4xl text-paper">
              Who's on tonight?
            </h1>
          </div>

          {/* Password form */}
          <form action={signInWithPassword} className="flex flex-col gap-4 mb-6">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="group">
              <Input
                label="Email"
                type="email"
                name="email"
                required
                placeholder="you@service.com"
                dark
              />
            </div>
            <div className="group">
              <Input
                label="Password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                dark
              />
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-paper text-ink font-mono text-sm py-4 hover:bg-rust hover:text-paper transition-colors duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign in</span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-paper/10" />
            <span className="font-mono text-[10px] text-paper/30">or</span>
            <div className="flex-1 h-px bg-paper/10" />
          </div>

          {/* OTP form */}
          <form action={signInWithOtp} className="flex flex-col gap-3 mb-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Input
              label="Get a one-time code"
              type="email"
              name="email"
              required
              placeholder="you@service.com"
              dark
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full border border-paper/20 text-paper/60 font-mono text-sm py-3 hover:border-rust/60 hover:text-rust transition-all duration-300"
            >
              Send code
            </motion.button>
          </form>

          {/* Google */}
          <form action={signInWithGoogle}>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full border border-paper/10 text-paper/40 font-mono text-xs py-3 hover:border-paper/30 hover:text-paper/70 transition-all duration-300"
            >
              Continue with Google
            </motion.button>
          </form>

          <p className="font-mono text-[10px] text-paper/20 mt-8 text-center">
            Customers — <a href="/menu" className="text-rust hover:underline">go straight to the menu</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
