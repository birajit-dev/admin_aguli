'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEdit, FaTrash } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Author {
  _id: string; 
  user_name: string;
  user_pic: string;
  author_bio: string;
  tag_line: string;
  facebook_link: string;
  twitter_link: string;
  instagram_link: string;
  linkedin_link: string;
  author_code: string;
  user_status: string;
  login_id: string;
  password: string;
}

export default function AuthorPage() {
  const router = useRouter();
  // Authentication check should be the first hook

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<Partial<Author>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/authorList?key=` + localStorage.getItem('saasAPI'));
      if (!response.ok) throw new Error('Failed to fetch authors');
      const data = await response.json();
      if (data.success) {
        setAuthors(data.data.authors);
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData(author);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/author/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setAuthors(authors.filter(author => author._id !== id));
          setSuccessMessage('Author deleted successfully');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete author');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error deleting author');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/author/update/${editingAuthor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAuthors();
        setEditingAuthor(null);
        setSuccessMessage('Author updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update author');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating author');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, don't render content
  
  return (

    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Author Management</h1>
        <Dialog>
          <Button size="sm" onClick={() => router.push('/users/author/add-author')}>
            Add New Author
          </Button>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {authors.map((author) => (
          <Card key={author._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="relative p-0">
              <div className="relative h-32 w-full">
                {!author.user_pic || author.user_pic === 'hh' ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                ) : (
                  <Image
                    src={author.user_pic}
                    alt={author.user_name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Handle image loading errors
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                )}
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(author)}
                  className="h-7 w-7 bg-white/90 hover:bg-white"
                >
                  <FaEdit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(author._id)}
                  className="h-7 w-7 bg-white/90 hover:bg-white"
                >
                  <FaTrash className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">{author.user_name}</h2>
              <p className="text-xs text-muted-foreground mb-2">{author.tag_line}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">{author.author_bio}</p>
              <div className="flex gap-2">
                {author.facebook_link && (
                  <a href={author.facebook_link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaFacebook className="h-4 w-4 text-blue-600" />
                  </a>
                )}
                {author.twitter_link && (
                  <a href={author.twitter_link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaTwitter className="h-4 w-4 text-blue-400" />
                  </a>
                )}
                {author.instagram_link && (
                  <a href={author.instagram_link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaInstagram className="h-4 w-4 text-pink-600" />
                  </a>
                )}
                {author.linkedin_link && (
                  <a href={author.linkedin_link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaLinkedin className="h-4 w-4 text-blue-800" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingAuthor} onOpenChange={(open) => !open && setEditingAuthor(null)}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="user_name" className="text-sm">Name</Label>
                <Input
                  id="user_name"
                  value={formData.user_name || ''}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  className="h-8"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="user_pic" className="text-sm">Profile Picture URL</Label>
                <Input
                  id="user_pic"
                  value={formData.user_pic || ''}
                  onChange={(e) => setFormData({ ...formData, user_pic: e.target.value })}
                  className="h-8"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="login_id" className="text-sm">Login ID</Label>
                <Input
                  id="login_id"
                  value={formData.login_id || ''}
                  onChange={(e) => setFormData({ ...formData, login_id: e.target.value })}
                  className="h-8"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-8"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm">Status</Label>
                <Select
                  value={formData.user_status || ''}
                  onValueChange={(value) => setFormData({ ...formData, user_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tag_line" className="text-sm">Tag Line</Label>
                <Input
                  id="tag_line"
                  value={formData.tag_line || ''}
                  onChange={(e) => setFormData({ ...formData, tag_line: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="author_bio" className="text-sm">Bio</Label>
              <Textarea
                id="author_bio"
                value={formData.author_bio || ''}
                onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                className="h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="facebook_link" className="text-sm">Facebook</Label>
                <Input
                  id="facebook_link"
                  value={formData.facebook_link || ''}
                  onChange={(e) => setFormData({ ...formData, facebook_link: e.target.value })}
                  className="h-8"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="twitter_link" className="text-sm">Twitter</Label>
                <Input
                  id="twitter_link"
                  value={formData.twitter_link || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_link: e.target.value })}
                  className="h-8"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="instagram_link" className="text-sm">Instagram</Label>
                <Input
                  id="instagram_link"
                  value={formData.instagram_link || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
                  className="h-8"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="linkedin_link" className="text-sm">LinkedIn</Label>
                <Input
                  id="linkedin_link"
                  value={formData.linkedin_link || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                  className="h-8"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setEditingAuthor(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}