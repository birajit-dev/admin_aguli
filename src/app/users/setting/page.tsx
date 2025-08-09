'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { FiSettings, FiUpload, FiGlobe, FiEdit } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WebsiteSettings {
  name: string;
  title: string;
  description: string;
  domain: string;
  customDomain: string;
  logo: File | null;
}

export default function Settings() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    name: '',
    title: '',
    description: '',
    domain: '',
    customDomain: '',
    logo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          name: data.name || '',
          title: data.title || '',
          description: data.description || '',
          domain: data.domain || '',
          customDomain: data.customDomain || ''
        }));
      } catch (err) {
        setError('Failed to load settings');
      }
    };

    fetchSettings();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSettings(prev => ({ ...prev, logo: file }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', settings.name);
      formData.append('title', settings.title);
      formData.append('description', settings.description);
      formData.append('domain', settings.domain);
      formData.append('customDomain', settings.customDomain);
      if (settings.logo) {
        formData.append('logo', settings.logo);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update settings');
      
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiSettings className="h-6 w-6" />
            Website Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label>Website Logo</Label>
                <div 
                  {...getRootProps()} 
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer mt-2"
                >
                  <input {...getInputProps()} />
                  <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isDragActive ? "Drop logo here..." : "Drag & drop logo here, or click to select"}
                  </p>
                </div>
                {settings.logo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {settings.logo.name}
                  </p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Website Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    placeholder="My Website"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Website Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={settings.title}
                    onChange={handleChange}
                    placeholder="Welcome to My Website"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Website Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleChange}
                  placeholder="A brief description of your website"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiGlobe className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Domain Settings</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Default Domain</Label>
                  <Input
                    id="domain"
                    name="domain"
                    value={settings.domain}
                    onChange={handleChange}
                    placeholder="mywebsite.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    name="customDomain"
                    value={settings.customDomain}
                    onChange={handleChange}
                    placeholder="www.mycustomdomain.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your custom domain if you want to use your own domain name
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
