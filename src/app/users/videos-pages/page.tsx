'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface Video {
  _id: string;
  video_tittle: string;
  video_description: string;
  video_cat: string;
  video_status: string;
  video_url: string;
  video_thumb: string;
  video_key: string;
  video_date: string;
  video_views: string;
  video_likes: string;
  video_comments: string;
  createdat: string;
}

interface VideoResponse {
  message: string;
  videos: Video[];
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/video/getallvideos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data: VideoResponse = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/video/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete video');
      
      // Refresh videos list after deletion
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 p-6">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Video Gallery
            </CardTitle>
            <Link href="/users/videos-pages/add-video">
              <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl group">
                <FiPlus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Add New Video
              </Button>
            </Link>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card 
                  key={video._id} 
                  className="group flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardContent className="p-4 flex flex-col h-full space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${video.video_thumb}`} 
                        alt={video.video_tittle}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-grow space-y-3">
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">
                        {video.video_tittle}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.video_description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {video.video_cat}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary">
                          {video.video_views} views
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/users/videos-pages/${video._id}/edit`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(video._id)}
                          className="h-9 w-9 rounded-full hover:bg-destructive/90 transition-colors duration-300"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
