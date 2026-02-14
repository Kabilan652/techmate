import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => subscription.unsubscribe();

  }, []);

  const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return { error };

  if (data?.user) {
    // 1. Store the user data in the profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      skill_level: "Beginner"
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    // 2.  SIGN OUT IMMEDIATELY to prevent the automatic login
    await supabase.auth.signOut();
  }

  return { error: null };
};

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
