"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signInWithOtp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    console.error("OTP SEND FAILED:", JSON.stringify(error, null, 2));
    const message = error.message || error.name || "unknown auth error";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  redirect(`/login/verify?email=${encodeURIComponent(email)}`);
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: formData.get("email") as string,
    token: formData.get("token") as string,
    type: "email",
  });

  if (error) {
    redirect(
      `/login/verify?email=${encodeURIComponent(formData.get("email") as string)}&error=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/");
}