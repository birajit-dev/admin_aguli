'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthorLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/author/dashboard';
  
  const [formData, setFormData] = useState({ login_id: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if author is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authorToken');
    if (token) {
      router.push('/author/dashboard');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/author/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: formData.login_id,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data in localStorage
      const authData = {
        authorId: data.author.id,
        authorName: data.author.name,
        authorLoginId: data.author.login_id,
        authorCode: data.author.authorKey,
        authorDomainOwner: data.author.author_domain_owner,
        authorDomainKey: data.author.author_domain_key,
        authorDomainName: data.author.author_domain_name,
        authorToken: data.token,
        authorRole: 'author',
        isAuthorAuthenticated: 'true'
      };

      Object.entries(authData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Redirect after successful login
      router.push(returnUrl);
    } catch (err: any) {
      console.error('Author login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Author Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="login_id">Login ID</Label>
              <Input
                id="login_id"
                name="login_id"
                type="text"
                required
                placeholder="Enter your login ID"
                value={formData.login_id}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                <Link href="/reset-password" className="text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthorLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthorLoginContent />
    </Suspense>
  );
}