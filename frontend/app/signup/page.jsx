import React from "react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-8 sm:px-12 lg:px-16">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-left">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-yellow-900 bg-yellow-200 rounded-full">
              🚀 Get Started in Seconds
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6 sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Product Sans', sans-serif" }}>
            Create Mock API Data
            <br />
            <span className="text-primary">Instantly</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light" style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 300 }}>
            Connect your GitHub account to generate realistic mock data for your APIs in seconds. No setup required.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user%20repo`}
            className="block"
          >
            <Button
              className="bg-primary w-full h-14 text-lg px-8 font-medium py-5 border-2 border-black hover:opacity-70"
              style={{ fontFamily: "'Product Sans', sans-serif", fontWeight: 500 }}
            >
              <svg
                className="w-6 h-6 mr-3 inline-block align-middle"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
              </svg>
              Continue with GitHub →
            </Button>
          </a>

          <p className="text-sm text-muted-foreground font-mono">
            By signing up, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}