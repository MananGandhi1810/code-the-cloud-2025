"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";



export default function TokenPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessTokenAndUser = async (requestToken) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-access-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${requestToken}`,
            },
          }
        );

        const data = response.data.data;

        if (!data.accessToken) throw new Error("No access token in response");

        const token = data.accessToken;
        sessionStorage.setItem("accessToken", token);
        console.log("Access token retrieved successfully:", data);

        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User data response:", userResponse);
        const user = userResponse.data.data.user; 
        console.log("User data retrieved successfully:", user);


     
        router.push("/dashboard");
      } catch (err) {
        const error = err;
        console.error("Error during login process:", error);
        setError(
          error.response?.data?.message ||
          error.message ||
          "Login process failed"
        );
        setTimeout(() => {
          router.push("/signup");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get("requestToken");

    if (token) {
      fetchAccessTokenAndUser(token);
    } else {
      setError("Missing requestToken in URL");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/signup");
      }, 3000);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <p className="text-muted-foreground">Redirecting back to signup...</p>
        </div>
      </div>
    );
  }

  return null;
}
