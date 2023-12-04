"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const Context = createContext(undefined);

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState(null); // Add a user state
  const router = useRouter();

  useEffect(() => {
    // Check the current session and update user
    const session = supabase.auth.session;
    setUser(session?.user);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      // Optionally, you can perform actions here based on the event
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
}