"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { signUpWithPassword, signInWithGoogle } from "@/app/login/actions";

export function SignupForm({ redirectTo }: { redirectTo: string }) {
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
        <div className="lg:w-5/12 bg-rust p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Abstract Circle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-paper/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="font-heading italic text-4xl md:text-5xl text-paper mb-4">
              Join Pass
            </h2>
            <p className="font-body text-paper/80 leading-relaxed max-w-[200px]">
              Set up your account for the kitchen rail and command center.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 lg:mt-0 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-paper animate-pulse" />
            <span className="font-mono text-[10px] text-paper/80">
              new staff registration
            </span>
          </div>
        </div>

        {/* Right Side — Forms */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-xs mx-auto w-full">
            <h1 className="font-heading italic text-3xl text-paper mb-8 text-center">
              Create Account
            </h1>

            {/* Password form */}
            <form action={signUpWithPassword} className="flex flex-col gap-4 mb-8">
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Input
                label="Email"
                type="email"
                name="email"
                required
                placeholder="you@service.com"
                dark
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                dark
              />
              
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 bg-paper text-ink rounded-full font-mono text-sm py-3.5 hover:bg-rust hover:text-paper transition-colors duration-300 shadow-md"
              >
                Clock in, first time
              </motion.button>
              
              <a
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="text-center block font-mono text-[10px] text-paper/60 hover:text-paper mt-2 transition-colors"
              >
                Already have an account? Sign in
              </a>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-paper/10" />
              <span className="font-mono text-[10px] text-paper/30">or</span>
              <div className="flex-1 h-px bg-paper/10" />
            </div>

            {/* Google form */}
            <form action={signInWithGoogle} className="flex flex-col">
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 border border-paper/20 rounded-full text-paper/70 font-mono text-sm py-3.5 hover:border-rust/60 hover:text-rust transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Sign up with Google
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
