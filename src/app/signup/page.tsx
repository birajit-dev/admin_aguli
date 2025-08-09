'use client';
import React, { useState } from 'react';
import { FiGlobe, FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    saas_user: '',
    saas_email: '',
    saas_password: '',
    confirmPassword: '',
    saas_domain: '',
    saas_company_name: '',
    saas_country: '+91',
    saas_phone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

    // Basic validation
    if (formData.saas_password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/global/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saas_user: formData.saas_user,
          saas_email: formData.saas_email,
          saas_phone: formData.saas_phone,
          saas_country: formData.saas_country,
          saas_company_name: formData.saas_company_name,
          saas_domain: formData.saas_domain,
          saas_password: formData.saas_password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store necessary data in sessionStorage for verification
      sessionStorage.setItem('saas_api', data.data.saas_api);
      sessionStorage.setItem('saas_key', data.data.saas_key);
      sessionStorage.setItem('saas_email', formData.saas_email);
      sessionStorage.setItem('verification_pending', 'true');

      // Show success dialog
      setShowSuccessDialog(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/verify-code');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Get started with your SaaS account and connect your domain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saas_user">Full Name</Label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="saas_user"
                    name="saas_user"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="John Doe"
                    value={formData.saas_user}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saas_email">Email</Label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="saas_email"
                    name="saas_email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="you@example.com"
                    value={formData.saas_email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="w-[120px]">
                    <Select 
                      value={formData.saas_country}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, saas_country: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">🇺🇸 +1 (US)</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                        <SelectItem value="+91">🇮🇳 +91 (IN)</SelectItem>
                        <SelectItem value="+86">🇨🇳 +86 (CN)</SelectItem>
                        <SelectItem value="+81">🇯🇵 +81 (JP)</SelectItem>
                        <SelectItem value="+49">🇩🇪 +49 (DE)</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33 (FR)</SelectItem>
                        <SelectItem value="+39">🇮🇹 +39 (IT)</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34 (ES)</SelectItem>
                        <SelectItem value="+7">🇷🇺 +7 (RU)</SelectItem>
                        <SelectItem value="+82">🇰🇷 +82 (KR)</SelectItem>
                        <SelectItem value="+55">🇧🇷 +55 (BR)</SelectItem>
                        <SelectItem value="+61">🇦🇺 +61 (AU)</SelectItem>
                        <SelectItem value="+1">🇨🇦 +1 (CA)</SelectItem>
                        <SelectItem value="+52">🇲🇽 +52 (MX)</SelectItem>
                        <SelectItem value="+65">🇸🇬 +65 (SG)</SelectItem>
                        <SelectItem value="+971">🇦🇪 +971 (AE)</SelectItem>
                        <SelectItem value="+972">🇮🇱 +972 (IL)</SelectItem>
                        <SelectItem value="+27">🇿🇦 +27 (ZA)</SelectItem>
                        <SelectItem value="+234">🇳🇬 +234 (NG)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="saas_phone"
                      name="saas_phone"
                      type="tel"
                      required
                      className="pl-10"
                      placeholder="123-456-7890"
                      value={formData.saas_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saas_company_name">Company Name</Label>
                <div className="relative flex items-center">
                  <Input
                    id="saas_company_name"
                    name="saas_company_name"
                    type="text"
                    required
                    placeholder="Your Company"
                    value={formData.saas_company_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saas_domain">Domain</Label>
                <div className="relative flex items-center">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="saas_domain"
                    name="saas_domain"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="mycompany.com"
                    value={formData.saas_domain}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saas_password">Password</Label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="saas_password"
                    name="saas_password"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="••••••••"
                    value={formData.saas_password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Your account has been created successfully. Redirecting to verification page...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
