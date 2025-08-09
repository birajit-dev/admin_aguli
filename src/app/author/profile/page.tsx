'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FiUser, FiMail, FiLink } from 'react-icons/fi';

interface AuthorProfile {
  user_name: string;
  user_mail: string;
  author_bio: string;
  facebook_link: string;
  twitter_link: string;
  instagram_link: string;
  linkedin_link: string;
  tag_line: string;
}

export default function AuthorProfile() {
  const [profile, setProfile] = useState<AuthorProfile>({
    user_name: '',
    user_mail: '',
    author_bio: '',
    facebook_link: '',
    twitter_link: '',
    instagram_link: '',
    linkedin_link: '',
    tag_line: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const domainKey = localStorage.getItem('authorDomainKey');
      const authorKey = localStorage.getItem('authorCode');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/author/profile?key=${domainKey}&authorKey=${authorKey}`
      );

      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        throw new Error(data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const domainKey = localStorage.getItem('authorDomainKey');
      const authorKey = localStorage.getItem('authorCode');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/author/profile/update?key=${domainKey}&authorKey=${authorKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        }
      );

      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUser className="h-6 w-6" />
            Author Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      name="user_name"
                      value={profile.user_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="email"
                      name="user_mail"
                      value={profile.user_mail}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tagline</Label>
                  <Input
                    name="tag_line"
                    value={profile.tag_line}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    name="author_bio"
                    value={profile.author_bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="space-y-2">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                      <div key={platform} className="relative">
                        <FiLink className="absolute left-3 top-3 text-gray-400" />
                        <Input
                          name={`${platform}_link`}
                          value={profile[`${platform}_link` as keyof AuthorProfile]}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                          className="pl-10"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {!isEditing ? (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
