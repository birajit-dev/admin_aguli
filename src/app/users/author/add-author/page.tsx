'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiLink, FiInfo } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';

export default function AddAuthor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_mail: '',
    user_name: '',
    user_role: 'Author',
    user_status: 'ACTIVE', 
    user_pic: '',
    login_id: '',
    password: '',
    author_bio: '',
    facebook_link: '',
    twitter_link: '',
    instagram_link: '',
    linkedin_link: '',
    tag_line: '',
    domain_owner: '',
    domain_key: '',
    domain_name: ''
  });

  useEffect(() => {
    // Set localStorage values after component mounts
    setFormData(prev => ({
      ...prev,
      domain_owner: localStorage.getItem('saasUser') || '',
      domain_key: localStorage.getItem('saasAPI') || '',
      domain_name: localStorage.getItem('saasDomain') || ''
    }));
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/post/adduser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add author');
      }

      router.push('/users/author');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUser className="h-6 w-6" />
            Add New Author
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="email"
                      name="user_mail"
                      required
                      value={formData.user_mail}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <Label>Full Name</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="text"
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <Label>Login ID</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="text"
                      name="login_id"
                      required
                      value={formData.login_id}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Choose login ID"
                    />
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Profile Picture URL</Label>
                  <div className="relative">
                    <FiLink className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="url"
                      name="user_pic"
                      value={formData.user_pic}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter profile picture URL"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tag Line</Label>
                  <div className="relative">
                    <FiInfo className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="text"
                      name="tag_line"
                      value={formData.tag_line}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter tagline"
                    />
                  </div>
                </div>

                <div>
                  <Label>Author Bio</Label>
                  <Textarea
                    name="author_bio"
                    value={formData.author_bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write author bio here..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Facebook Link</Label>
                <Input
                  type="url"
                  name="facebook_link"
                  value={formData.facebook_link}
                  onChange={handleChange}
                  placeholder="Facebook profile URL"
                />
              </div>

              <div>
                <Label>Twitter Link</Label>
                <Input
                  type="url"
                  name="twitter_link"
                  value={formData.twitter_link}
                  onChange={handleChange}
                  placeholder="Twitter profile URL"
                />
              </div>

              <div>
                <Label>Instagram Link</Label>
                <Input
                  type="url"
                  name="instagram_link"
                  value={formData.instagram_link}
                  onChange={handleChange}
                  placeholder="Instagram profile URL"
                />
              </div>

              <div>
                <Label>LinkedIn Link</Label>
                <Input
                  type="url"
                  name="linkedin_link"
                  value={formData.linkedin_link}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Author'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
