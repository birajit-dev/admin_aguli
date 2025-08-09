'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiImage, FiVideo, FiLink } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VideoUploadPage() {
  const [formData, setFormData] = useState({
    video_tittle: '',
    video_description: '',
    video_cat: '',
    video_status: 'active',
    video_url: '',
    thumbnail_url: ''
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [useVideoUrl, setUseVideoUrl] = useState(false);
  const [useThumbnailUrl, setUseThumbnailUrl] = useState(false);

  const onVideoDrop = useCallback((acceptedFiles: File[]) => {
    setVideoFile(acceptedFiles[0]);
    setFormData(prev => ({ ...prev, video_url: '' }));
  }, []);

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    setThumbnailFile(acceptedFiles[0]);
    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (videoFile) formDataToSend.append('video', videoFile);
    if (thumbnailFile) formDataToSend.append('thumbnail', thumbnailFile);
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/video/add`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to upload video');
      
      // Reset form after successful upload
      setFormData({
        video_tittle: '',
        video_description: '',
        video_cat: '',
        video_status: 'active',
        video_url: '',
        thumbnail_url: ''
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setUseVideoUrl(false);
      setUseThumbnailUrl(false);
      
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video_tittle">Video Title</Label>
              <Input
                id="video_tittle"
                name="video_tittle"
                value={formData.video_tittle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_description">Video Description</Label>
              <Textarea
                id="video_description"
                name="video_description"
                value={formData.video_description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Video</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setUseVideoUrl(!useVideoUrl);
                    setVideoFile(null);
                    setFormData(prev => ({ ...prev, video_url: '' }));
                  }}
                >
                  <FiLink className="mr-2" />
                  {useVideoUrl ? 'Upload File Instead' : 'Use URL Instead'}
                </Button>
              </div>
              
              {useVideoUrl ? (
                <Input
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="Enter video URL"
                  type="url"
                />
              ) : (
                <>
                  <div 
                    {...getVideoRootProps()} 
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer"
                  >
                    <input {...getVideoInputProps()} />
                    <FiVideo className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drop a video file here, or click to select
                    </p>
                  </div>
                  {videoFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {videoFile.name}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Thumbnail</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setUseThumbnailUrl(!useThumbnailUrl);
                    setThumbnailFile(null);
                    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                  }}
                >
                  <FiLink className="mr-2" />
                  {useThumbnailUrl ? 'Upload File Instead' : 'Use URL Instead'}
                </Button>
              </div>

              {useThumbnailUrl ? (
                <Input
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  placeholder="Enter thumbnail URL"
                  type="url"
                />
              ) : (
                <>
                  <div 
                    {...getThumbnailRootProps()} 
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer"
                  >
                    <input {...getThumbnailInputProps()} />
                    <FiImage className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drop a thumbnail image here, or click to select
                    </p>
                  </div>
                  {thumbnailFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {thumbnailFile.name}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_cat">Category</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, video_cat: value }))}
                value={formData.video_cat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_status">Status</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, video_status: value }))}
                value={formData.video_status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Upload Video
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
