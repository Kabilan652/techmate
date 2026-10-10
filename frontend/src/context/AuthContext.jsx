import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
  
    if (error) {
      console.error("Signup error:", error.message);
      return { error };
    }
  
    if (!data.user) {
      return {
        error: new Error("Account creation could not be confirmed.")
      };
    }
  
    // Email confirmation may be required.
    // If no session exists, the user may need to verify their email.
    if (!data.session) {
      return {
        error: null,
        needsEmailConfirmation: true
      };
    }
  
    // Create the profile when signup provides an authenticated session.
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: data.user.id,
          email: email.trim(),
          full_name: fullName,
          skill_level: "Beginner"
        },
        { onConflict: "id" }
      );
  
    if (profileError) {
      console.error("Profile creation error:", profileError.message);
      return { error: profileError };
    }
  
    return { error: null, needsEmailConfirmation: false };
  };

    console.log("SUPABASE RAW RESPONSE:", { data, error }); // 👈 DEBUG LOG

    if (error) return { error };

    if (data?.user) {
      // 2. Store the user data in your custom profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        skill_level: "Beginner"
      });

      if (profileError) {
        console.error("Error creating profile in database:", profileError);
        // Optional: you could return this error if you want to show it in the UI
      }

      // 3. Sign out immediately if you require them to log in manually afterward
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
