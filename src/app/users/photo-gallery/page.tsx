'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FiImage, FiTrash2, FiDownload, FiChevronLeft, FiChevronRight, FiUpload } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

interface ImageFile {
  post_image: string;
  update_date: string;
  file_path: string;
  file_name: string;
  uploaded_date: string;
}

interface ImageResponse {
  currentPage: number;
  totalPages: number;
  totalImages: number;
  images: ImageFile[];
}

export default function PhotoGallery() {
  const [imageData, setImageData] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');
    const saasAPI = localStorage.getItem('saasAPI');

    if (!isAuthenticated || !token) {
      router.push('/login?returnUrl=/users/photo-gallery');
      return;
    }

    fetchImages();
  }, [currentPage, router]);

  const fetchImages = async () => {
    try {
      const saasAPI = localStorage.getItem('saasAPI');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/imageGallery?page=${currentPage}&key=${saasAPI}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images from server');
      }
      const data: ImageResponse = await response.json();
      setImageData(data);
    } catch (err) {
      setError('Failed to load images from server');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('saasAPI', localStorage.getItem('saasAPI') || '');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/upload/image`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
      }
      // Refresh the image list after upload
      fetchImages();
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/images/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image from server');
      }

      // Refresh image list after deletion
      setImageData(prev => prev ? {
        ...prev,
        images: prev.images.filter(img => !img.post_image.includes(filename)),
        totalImages: prev.totalImages - 1
      } : null);
    } catch (err) {
      console.error('Error deleting image from server:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true);
  };

  const handleImageClick = async (image: ImageFile) => {
    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${image.file_path}`;
      
      // Create a temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = fullUrl;
      document.body.appendChild(tempInput);
      
      // Select and copy the text
      tempInput.select();
      document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(tempInput);
      
      alert(`Image URL copied to clipboard!\n\nURL: ${fullUrl}`);
      window.open(fullUrl, '_blank');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiImage className="h-6 w-6" />
            Image Gallery Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer mb-6"
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragActive ? 
                "Drop images here..." : 
                "Drag & drop images here, or click to select"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageData?.images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image.file_path}`}
                    alt={image.file_path.split('/').pop() || ''}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm">Click to copy URL and open image</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium truncate">{image.file_name.split('/').pop()}</p>
                  <p className="text-xs text-gray-500">{image.uploaded_date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {imageData && imageData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {imageData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === imageData.totalPages}
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
