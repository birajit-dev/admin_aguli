'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Load Google Sign-In API
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    try {
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        googleId: decoded.sub,
        email: decoded.email,
        full_name: decoded.name,
        profile_picture: decoded.picture
      };

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/profile/google/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await apiResponse.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/users/videos-pages');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Video Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div id="g_id_onload"
            data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            data-callback="handleGoogleSignIn">
          </div>
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border"
            onClick={() => window.google?.accounts.id.prompt()}
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
