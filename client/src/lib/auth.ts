import { supabase } from "./supabase";

export async function signupUser(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
