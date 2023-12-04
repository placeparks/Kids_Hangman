"use client"
import React from "react"
import { useSupabase } from "../supabase-provider"

import { useRouter } from 'next/navigation'; // Import useRouter from next/router

export default function Logout() {
    const { supabase } = useSupabase();
    const router = useRouter(); // Initialize the useRouter hook

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth'); // Redirect to the auth page after logout
    };


  return (
    <div>
      <button
       style={{ background: "red", border: "none", color: "white", padding: "10px", cursor: "pointer", borderRadius: '5px' }}
       onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
