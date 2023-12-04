"use client"
import React, { useState, useEffect } from "react";
import { useSupabase } from "../supabase-provider";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Auth() {
  const { supabase } = useSupabase();
  const router = useRouter(); // Initialize useRouter
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if user is already logged in and redirect
    const user = supabase.auth.user;
    if (user) {
      router.push('/game'); // Replace '/game' with your game page route
    }
  }, [supabase, router]);

  const handleCreateUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (data) {
      // Update the user's profile with their name
      await supabase
        .from('users')
        .update({ name: name })
        .eq('id', data.user.id);

      alert("Sign up successful! Please check your email to confirm your account.");
      router.push('/game'); // Redirect to game page after sign up
    }
    if (error) {
      console.error('Error signing up:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error('Error signing in:', error);
      alert(`Error: ${error.message}`);
    } else {
      router.push('/game'); // Redirect to game page after successful login
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <input
        type="text" // Change to text input for name
        placeholder="Name" // Update placeholder
        value={name} // Bind to the 'name' state
        onChange={(e) => setName(e.target.value)} // Update 'name' state
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
      />
      <button onClick={handleCreateUser} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}>Sign Up new User</button>
      <button onClick={handleLogin} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}>Sign In</button>
   
    </div>
  );
}
