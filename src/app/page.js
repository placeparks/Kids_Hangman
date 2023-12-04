import React from "react"
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies
  })

  const { data: activeSession } = await supabase.auth.getSession();

  if (!activeSession.session) {
    return redirect("/auth"); // Redirects to the authentication page if not logged in
  }
  console.log("Active session:", activeSession);


  const { data: post } = await supabase.from("post").select("*");

  return (
    <>
      <div className="">
        <h1 className="">Thank you for playing with us</h1>
      
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>

    </>
  )
}
