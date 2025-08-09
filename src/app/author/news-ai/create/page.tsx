'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FiFeather, FiBook, FiImage, FiTag, FiEye, FiEdit, FiX, FiCpu } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface CategoryOption {
  value: string;
  label: string;
}

interface Author {
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

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

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
      <Input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={() => setIsInputActive(false)}
        placeholder={tags.length === 0 ? "Type a tag and press Enter..." : ""}
        className="flex-grow min-w-[120px] border-none focus:ring-0"
      />
    </div>
  );
};

interface FormData {
  name: string;
  url: string;
  summary: string;
  description: string;
  content: string;
  keyword: string;
  category: CategoryOption[];
  tags: string[];
  insight: string;
  author: string;
  prompt: string;
  image_source: string;
}

export default function AddNews() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    summary: '',
    description: '',
    content: '',
    keyword: '',
    category: [],
    tags: [],
    insight: '',
    author: '',
    prompt: '',
    image_source: '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/authorList`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data.data.authors.map((author: any) => ({
          value: author._id,
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setCoverImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  });

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/generate/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          title: formData.name,
          category: formData.category[0]?.value || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.content,
        description: data.description || prev.description,
        tags: [...prev.tags, ...(data.suggestedTags || [])],
        keyword: data.suggestedKeywords || prev.keyword,
        name: data.suggestedTitle || prev.name
      }));
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.name || !formData.description || !formData.content) {
        throw new Error('Please fill in all required fields');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('post_name', formData.name);
      formDataToSend.append('post_description', formData.description);
      formDataToSend.append('post_content', formData.content);
      formDataToSend.append('post_keyword', formData.keyword);
      formDataToSend.append('post_category', formData.category.map(cat => cat.value).join(','));
      formDataToSend.append('meta_tags', formData.tags.join(','));
      formDataToSend.append('author_key', localStorage.getItem('authorCode') || '');
      formDataToSend.append('author_name', localStorage.getItem('authorName') || '');
      formDataToSend.append('domain_owner', localStorage.getItem('authorDomainOwner') || '');
      formDataToSend.append('domain_key', localStorage.getItem('authorDomainKey') || '');
      formDataToSend.append('domain_name', localStorage.getItem('authorDomainName') || '');
      formDataToSend.append('top_news', '');
      formDataToSend.append('post_status', 'Draft');
      formDataToSend.append('editorial_news', '');
      formDataToSend.append('headline_news', '');
      formDataToSend.append('breaking_news', '');
      formDataToSend.append('optional_1', '');
      formDataToSend.append('optional_2', '');
      formDataToSend.append('optional_3', '');
      formDataToSend.append('optional_4', '');
      formDataToSend.append('image_source', formData.image_source);
      
      if (coverImage) {
        formDataToSend.append('myFile', coverImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/post/news`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error (not JSON):', errorText);
        throw new Error('Failed to submit news. See console.');
      }

      const result = await response.json();
      alert('News submitted successfully!');
      window.location.href = '/author/dashboard';
      
      setCoverImage(null);
      
    } catch (error) {
      console.error('Error submitting news:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add News Article</CardTitle>
          <CardDescription>Create and publish your news content</CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="destructive" className="mx-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          
            <div className="space-y-2">
              <Label>AI Content Generation</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Enter your prompt for AI content generation..."
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleChange}
                  className="h-24" // Set fixed height
                />
                <Button 
                  type="button" 
                  onClick={generateContent}
                  disabled={isGenerating || !formData.prompt}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <FiCpu className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="space-y-12">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>  

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              

              <div className="space-y-2">
                <Label>Categories</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: [{ value, label: categoryOptions.find(c => c.value === value)?.label || '' }] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
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
            </div>

            

            <div className="space-y-2">
              <Label>Content</Label>
              <Editor
                apiKey='iuydh6tdhtzd5buaia35qxb7gxofaulliy9l2s4b2dybzp65'
                value={formData.content}
                onEditorChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
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
              <Label htmlFor="keywords">Meta Keywords</Label>
              <Input
                id="keywords"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Meta Tags</Label>
              <TagInput 
                tags={formData.tags} 
                setTags={(newTags: string[]) => setFormData(prev => ({ ...prev, tags: newTags }))} 
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer"
              >
                <input {...getInputProps()} />
                <FiImage className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop an image here, or click to select
                </p>
              </div>
              {coverImage && (
                <p className="text-sm text-muted-foreground">
                  Selected: {coverImage.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSource">Image Source</Label>
              <Input
                id="image_source"
                name="image_source"
                value={formData.image_source}
                onChange={handleChange}
                placeholder="e.g. Unsplash, Author Name, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full">
              Publish Article
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}