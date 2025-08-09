'use client';
import React, { useState, useEffect } from 'react';
import { FiFile, FiTrash2, FiDownload, FiUpload, FiFolder, FiSearch } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

interface FileItem {
  _id: string;
  file_name: string;
  file_path: string;
  uploaded_date: string;
}

export default function FileManagement() {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');
    const saasAPI = localStorage.getItem('saasAPI');

    if (!isAuthenticated || !token) {
      router.push('/login?returnUrl=/users/file-management');
      return;
    }
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const saasAPI = localStorage.getItem('saasAPI');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get/document?&key=${saasAPI}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setFiles(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file => 
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const formData = new FormData();
      // Only handle first file since backend expects single file
      const file = acceptedFiles[0];
      formData.append('document', file);
      formData.append('saasAPI', localStorage.getItem('saasAPI') || '');


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/upload/document`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result.filePath);

      // Refresh document list after successful upload
      fetchDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/documents/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setFiles(prev => prev.filter(file => file._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handleDownload = (file: FileItem) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}${file.file_path}`, '_blank');
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiFolder className="h-6 w-6" />
            File Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div 
            {...getRootProps()} 
            className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer mb-6"
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragActive ? 
                "Drop files here..." : 
                "Drag & drop files here, or click to select"}
            </p>
          </div>

          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div 
                key={file._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FiFile className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{file.file_name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on: {new Date(file.uploaded_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <FiDownload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file._id)}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
