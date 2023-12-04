"use client"
// Profile.js
import React from 'react';
import { useSupabase } from "../supabase-provider";

const Profile = () => {
  const { user } = useSupabase();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div style={{marginTop:"20px", color:"white"}}>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>User Id: {user.id}</p>
    </div>
  );
};

export default Profile;
