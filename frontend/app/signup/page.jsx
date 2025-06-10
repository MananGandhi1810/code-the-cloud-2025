"use client";
import React from "react";

export default function SignUpPage() {
  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/github`;
  };

  return (
    <div>
          <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user%20repo`}
      className="block"
    >

      <button onClick={handleGithubLogin}>
        Sign in with GitHub
      </button>
      </a>
    </div>
  );
}
