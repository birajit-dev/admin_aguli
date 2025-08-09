'use client';
import { useState, useEffect } from 'react';
import { FiKey, FiLock, FiSave } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SettingsForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function AuthorSettings() {
  const [formData, setFormData] = useState<SettingsForm>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const domainKey = localStorage.getItem('authorDomainKey');
      const authorKey = localStorage.getItem('authorCode');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/author/settings/password?key=${domainKey}&authorKey=${authorKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_password: formData.current_password,
            new_password: formData.new_password
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Password updated successfully');
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        throw new Error(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiKey className="h-6 w-6" />
            Author Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Updating Password...'
              ) : (
                <span className="flex items-center gap-2">
                  <FiSave className="h-4 w-4" />
                  Update Password
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
