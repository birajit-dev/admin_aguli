'use client';

import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ExploreFormData {
  explore_title: string;
  explore_descriptions: string;
  explore_status: string;
  images: File[];
}

interface DraggableImageProps {
  file: File;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  removeImage: (index: number) => void;
}

const DraggableImage = ({ file, index, moveImage, removeImage }: DraggableImageProps) => {
  const ref = useCallback((node: HTMLDivElement | null) => {
    drop(node);
    preview(node);
  }, []);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item: { index: number }, monitor) => {
      const node = ref;
      if (!node) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <Image
        src={URL.createObjectURL(file)}
        alt={`Preview ${index}`}
        width={200}
        height={200}
        className="w-full h-48 object-cover rounded-lg"
      />
      <Button
        variant="destructive"
        size="icon"
        onClick={() => removeImage(index)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </Button>
    </div>
  );
};

export default function ExplorePage() {
  const [formData, setFormData] = useState<ExploreFormData>({
    explore_title: '',
    explore_descriptions: '',
    explore_status: 'active',
    images: []
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit to 5 images total
    setFormData(prev => {
      const newImages = [...prev.images, ...acceptedFiles];
      return {
        ...prev,
        images: newImages.slice(0, 5)
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true,
    maxFiles: 5
  });

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('explore_title', formData.explore_title);
    formDataToSend.append('explore_descriptions', formData.explore_descriptions);
    formDataToSend.append('explore_status', formData.explore_status);
    
    // Append all images with the same field name 'explore_thumb'
    formData.images.forEach((image) => {
      formDataToSend.append('explore_thumb', image);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/explore/add`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create explore post');
      }

      const result = await response.json();
      
      if (result.success) {
        // Reset form after successful submission
        setFormData({
          explore_title: '',
          explore_descriptions: '',
          explore_status: 'active',
          images: []
        });
      }

    } catch (error) {
      console.error('Error creating explore post:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6">Create Explore Post</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={formData.explore_title}
                onChange={e => setFormData(prev => ({ ...prev, explore_title: e.target.value }))}
                className="w-full px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.explore_descriptions}
                onChange={e => setFormData(prev => ({ ...prev, explore_descriptions: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={formData.explore_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, explore_status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Images (Max 5)</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getInputProps()} />
                <p className="text-gray-600">Drag & drop images here, or click to select files</p>
                <p className="text-gray-500 text-sm mt-2">You can upload up to 5 images and reorder them after upload</p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <DraggableImage
                    key={index}
                    file={file}
                    index={index}
                    moveImage={moveImage}
                    removeImage={removeImage}
                  />
                ))}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors"
            >
              Create Post
            </Button>
          </form>
        </div>
      </div>
    </DndProvider>
  );
}
