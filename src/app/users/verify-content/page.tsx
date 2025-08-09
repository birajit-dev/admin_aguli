'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FiEye, FiEdit, FiTrash2, FiCheck, FiX, FiGrid, FiList } from "react-icons/fi";

interface NewsItem {
  _id: string;
  post_name: string;
  post_description: string;
  post_content: string;
  post_status: string;
  update_date: string;
  author_name: string;
  post_image?: string;
  post_category: string;
  post_keyword: string;
  meta_tags: string;
  domain_name: string;
  domain_owner: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function VerifyContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchNews(pagination.page);
  }, [pagination.page]);

  const fetchNews = async (page: number) => {
    try {
      const domainKey = localStorage.getItem('saasAPI');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/pending/content?key=${domainKey}&page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      setNews(data.news);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/${id}/approve`, {
        method: 'PUT'
      });
      fetchNews(pagination.page);
    } catch (error) {
      console.error('Error approving news:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}/reject`, {
        method: 'PUT'
      });
      fetchNews(pagination.page);
    } catch (error) {
      console.error('Error rejecting news:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, {
          method: 'DELETE'
        });
        fetchNews(pagination.page);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Verification</CardTitle>
          <div className="flex gap-2 border rounded-lg p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <FiGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FiList className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }>
            {news.map((item) => (
              <Card 
                key={item._id} 
                className={`border hover:border-primary transition-all duration-200 hover:shadow-lg ${
                  viewMode === 'list' ? 'overflow-hidden' : ''
                }`}
              >
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                  <div className={`relative ${
                    viewMode === 'list' 
                      ? 'w-24 h-24 flex-shrink-0' 
                      : 'w-full h-48 mb-4'
                  } rounded-lg overflow-hidden`}>
                    <img 
                      src={item.post_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.post_image}` : '/placeholder-image.jpg'} 
                      alt={item.post_name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      variant={item.post_status === 'Published' ? "default" : "secondary"}
                      className="absolute top-2 right-2"
                    >
                      {item.post_status}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${viewMode === 'list' ? 'text-base' : 'text-lg'} mb-2 line-clamp-2`}>
                      {item.post_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">By {item.author_name}</p>
                    <p className="text-sm text-gray-500 mb-2">Category: {item.post_category}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(item.update_date).toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedNews(item)}>
                            <FiEye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{selectedNews?.post_name}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p>{selectedNews?.post_description}</p>
                            <div className="mt-4" dangerouslySetInnerHTML={{ __html: selectedNews?.post_content || '' }} />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <FiEdit className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApprove(item._id)}
                      >
                        <FiCheck className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(item._id)}
                      >
                        <FiX className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <span className="py-2 px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
