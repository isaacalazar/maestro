"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return user-friendly error messages based on error type
    if (error.message.includes("Invalid login credentials")) {
      return {
        error:
          "Invalid email or password. Please check your credentials and try again.",
      };
    } else if (error.message.includes("Email not confirmed")) {
      return {
        error:
          "Please check your email and click the confirmation link before signing in.",
      };
    } else if (error.message.includes("Too many requests")) {
      return {
        error:
          "Too many login attempts. Please wait a few minutes before trying again.",
      };
    } else {
      return { error: "Unable to sign in. Please try again later." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
