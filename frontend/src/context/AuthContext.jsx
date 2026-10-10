import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

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

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // SIGN UP
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
    if (!data.session) {
      return {
        error: null,
        needsEmailConfirmation: true
      };
    }

    // Create or update the user profile.
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

    return {
      error: null,
      needsEmailConfirmation: false
    };
  };

  // SIGN IN
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      console.error("Login error:", error.message);
      return { data, error };
    }

    setUser(data.user);

    return { data, error: null };
  };

  // SIGN OUT
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
    }

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
