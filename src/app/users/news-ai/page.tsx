'use client';
import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiCalendar, FiUser, FiTag, FiSearch } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface NewsItem {
  _id: string;
  post_name: string;
  post_category: string;
  author_name: string;
  update_date: string;
  post_status: number;
  post_image: string;
  post_summary: string;
  post_description: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  prevPage: number;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'politics': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm',
    'sports': 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm',
    'entertainment': 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 shadow-sm',
    'technology': 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 shadow-sm',
    'business': 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm',
    'health': 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm'
  };
  return colors[category.toLowerCase()] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm';
};

export default function NewsAI() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');

    if (!isAuthenticated || !token) {
      router.push('/login?returnUrl=/users/news-ai');
      return;
    }

    fetchNews();
  }, [currentPage, searchQuery, router]);

  const fetchNews = async () => {
    try {
      const saasAPI = localStorage.getItem('saasAPI');
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/newslists?page=${currentPage}${searchParam}&key=${saasAPI}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      if (data.success) {
        setNews(data.data.news);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const saasAPI = localStorage.getItem('saasAPI');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/news/delete/${id}?key=${saasAPI}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setNews(news.filter(item => item._id !== id));
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
          <div className="flex items-center justify-between">
            <CardTitle>News List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 w-64"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button onClick={() => router.push('/users/news-ai/add-news')}>Add New</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((item) => (
              <div 
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              >
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.post_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.post_image}` : `https://img.freepik.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg`}
                    alt={item.post_name}
                    fill
                    className="object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">{item.post_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.post_description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(item.post_category)}`}>
                      <FiTag className="h-3 w-3" />
                      {item.post_category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <FiUser className="h-3 w-3" />
                      {item.author_name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <FiCalendar className="h-3 w-3" />
                      {new Date(item.update_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.post_status === 1
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                    }`}>
                      {item.post_status === 1 ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/news-ai/${item._id}`, '_blank')}
                    className="hover:scale-105 transition-transform"
                  >
                    <FiEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `news-ai/${item._id}/edit`}
                    className="hover:scale-105 transition-transform"
                  >
                    <FiEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                    className="hover:scale-105 transition-transform"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Prev
              </Button>

              {(() => {
                const maxVisible = 4;
                const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                const endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);
                
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </Button>
                  );
                }
                return pages;
              })()}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
