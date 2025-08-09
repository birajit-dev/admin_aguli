'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import { Badge } from "@/components/ui/badge";
import { FiTag, FiX } from 'react-icons/fi';

interface Author {
  value: string;
  label: string;
}



interface NewsItem {
  _id: string;
  post_name: string;
  post_url: string;
  post_category: string;
  post_description: string;
  post_content: string;
  author_name: string;
  author_key: string;
  post_status: string;
  post_image?: string;
  meta_tags?: string;
  post_keyword?: string;
  domain_owner: string;
  domain_key: string;
  domain_name: string;
  top_news: string;
  editorial_news: string;
  breaking_news: string;
  headline_news: string;
  optional_1: string;
  optional_2: string;
  optional_3: string;
  optional_4: string;
  update_date: string;
  ai_seq: number;
  image_source: string;
}

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}



interface CategoryOption {
  value: string;
  label: string;
}

const categoryOptions: CategoryOption[] = [
  { value: 'tripura', label: 'Tripura' },
  { value: 'national', label: 'National' },
  { value: 'career', label: 'Jobs' },
  { value: 'politics', label: 'Politics' },
  { value: 'culture', label: 'Culture' },
  { value: 'education', label: 'Education' },
  { value: 'northeast', label: 'Northeast' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'business', label: 'Business' },
  { value: 'international', label: 'International' },
  { value: 'article', label: 'Article' },
  { value: 'biography', label: 'Biography' },
  { value: 'festival', label: 'Festival' }
];

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [input, setInput] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInputActive) {
      inputRef.current?.focus();
    }
  }, [isInputActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag.trim()) && tag.trim() !== '') {
      setTags([...tags, tag.trim()]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          <FiTag className="h-3 w-3" />
          {tag}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => removeTag(tag)}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setIsInputActive(true)}
        onBlur={() => setIsInputActive(false)}
        className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none"
        placeholder="Add a tag..."
      />
    </div>
  );
};

export default function EditNews() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id;

  const [news, setNews] = useState<NewsItem>({
    _id: '',
    post_name: '',
    post_url: '',
    post_category: '',
    post_description: '',
    post_content: '',
    author_name: '',
    author_key: '',
    post_status: '',
    post_image: '',
    meta_tags: '',
    post_keyword: '',
    domain_owner: '',
    domain_key: '',
    domain_name: '',
    top_news: '',
    editorial_news: '',
    breaking_news: '',
    headline_news: '',
    optional_1: '',
    optional_2: '',
    optional_3: '',
    optional_4: '',
    update_date: '',
    image_source: '',
    ai_seq: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const saasAPI = localStorage.getItem('saasAPI');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/authorList?key=${saasAPI}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data.data.authors.map((author: any) => ({
          value: author.author_code,
          label: author.user_name
        })));
      } catch (error) {
        console.error('Error fetching authors:', error);
        setError('Failed to fetch authors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!newsId) {
          throw new Error('News ID is missing');
        }

        const saasAPI = localStorage.getItem('saasAPI');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/news/${newsId}?key=${saasAPI}`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNews(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    if (field === 'author_key') {
      const selectedAuthor = authors.find(author => author.value === value);
      setNews(prev => ({
        ...prev,
        author_key: value,
        author_name: selectedAuthor ? selectedAuthor.label : prev.author_name
      }));
    } else {
      setNews(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEditorChange = (content: string) => {
    setNews(prev => ({
      ...prev,
      post_content: content
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!newsId) {
        throw new Error('News ID is missing');
      }

      const saasAPI = localStorage.getItem('saasAPI');
      const formData = new FormData();
      
      // Append all news data
      Object.entries(news).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (coverImage) {
        formData.append('myFile', coverImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/news/update/${newsId}?key=${saasAPI}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update news');
      router.push('/users/news-ai');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit News</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="post_name">Title</Label>
              <Input
                id="post_name"
                name="post_name"
                value={news.post_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select 
                value={news.author_key || ''}
                onValueChange={(value) => handleSelectChange(value, 'author_key')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={news.author_name || "Select Author"} />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.value} value={author.value}>
                      {author.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_category">Category</Label>
              <Select 
                value={news.post_category}
                onValueChange={(value) => handleSelectChange(value, 'post_category')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={news.post_category || "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_image">Cover Image</Label>
              <Input
                id="post_image"
                name="post_image" 
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              {news.post_image && (
                <div className="relative h-48 w-full mt-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${news.post_image}`}
                    alt="Current cover image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_source">Image Source</Label>
              <Input
                id="image_source"
                name="image_source"
                value={news.image_source}
                onChange={handleChange}
                placeholder="e.g. Unsplash, Author Name, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_description">Description</Label>
              <Textarea
                id="post_description"
                name="post_description"
                value={news.post_description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_content">Content</Label>
              <Editor
                apiKey='iuydh6tdhtzd5buaia35qxb7gxofaulliy9l2s4b2dybzp65'
                value={news.post_content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'textcolor'
                  ],
                  toolbar: 'undo redo | blocks | formatselect | ' +
                    'bold italic | forecolor backcolor alignleft aligncenter alignright | ' +
                    'bullist numlist outdent indent | link image | ' + 
                    'fontsizepicker fontsize | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                  link_title: false,
                  link_default_target: '_blank',
                  images_upload_url: `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                  images_upload_base_path: '/uploads',
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  file_picker_callback: function(cb: (url: string, obj?: { title: string }) => void, value: string, meta: { filetype: string }) {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.onchange = function() {
                      if (input.files) {
                        const file = input.files[0];
                        const reader = new FileReader();
                        reader.onload = function() {
                          const id = 'blobid' + (new Date()).getTime();
                          const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                          const base64 = (reader.result as string).split(',')[1];
                          const blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);
                          cb(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_tags">Meta Tags</Label>
              <TagInput 
                tags={news.meta_tags ? news.meta_tags.split(',') : []}
                setTags={(newTags: string[]) => {
                  handleChange({
                    target: {
                      name: 'meta_tags',
                      value: newTags.join(',')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_keyword">Keywords</Label>
              <Input
                id="post_keyword"
                name="post_keyword"
                value={news.post_keyword}
                onChange={handleChange}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_status">Status</Label>
              <Select
                value={news.post_status}
                onValueChange={(value) => handleSelectChange(value, 'post_status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/users/news-ai')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
