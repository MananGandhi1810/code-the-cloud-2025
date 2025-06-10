import React from "react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1e23]">
      <div className="bg-[#23232a] rounded-2xl shadow-2xl p-10 max-w-md w-full border border-[#2e2e38]">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Create Mock API Data Instantly
        </h1>
        <p className="text-[#b0b0c3] text-center mb-8">
          Sign up with GitHub to generate realistic mock data for your APIs in seconds.
        </p>
        <a
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user%20repo`}
          className="block"
        >
          <Button
            className="w-full h-14 bg-gradient-to-r cursor-pointer from-[#f8ffae] to-[#43c6ac] text-black font-semibold text-lg rounded-xl shadow-lg hover:from-[#43c6ac] hover:to-[#f8ffae] transition-all border-none"
            size="lg"
          >
            <svg
              className="w-6 h-6 mr-3 inline-block align-middle"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
            Sign in with GitHub
          </Button>
        </a>
      </div>
    </div>
  );
}