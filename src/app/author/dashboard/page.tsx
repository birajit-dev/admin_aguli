'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { FiEdit, FiPlusCircle, FiBarChart2, FiCpu, FiGrid, FiList, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';

interface NewsArticle {
  _id: string;
  post_name: string;
  post_description: string;
  created_at: string;
  views: number;
  post_image?: string;
  update_date: string;
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

export default function AuthorDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchArticles = async () => {
    try {
      const domainKey = localStorage.getItem('authorDomainKey');
      const authorKey = localStorage.getItem('authorCode');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/author/articles?page=${currentPage}&key=${domainKey}&authorKey=${authorKey}`);
      
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data.news);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'Failed to load articles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if author is authenticated
    const authorToken = localStorage.getItem('authorToken');
    if (!authorToken) {
      router.push('/author-login');
      return;
    }

    fetchArticles();
  }, [currentPage, fetchArticles, router]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/news/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setArticles(articles.filter(item => item._id !== id));
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FiBarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Assisted Articles</CardTitle>
            <FiCpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
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
        </div>
        <div className="space-x-4">
          <Button onClick={() => router.push('/author/news-ai/create')} className="gap-2">
            <FiCpu className="h-4 w-4" />
            Create with AI
          </Button>
          
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={viewMode === 'grid' ? 
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
        "space-y-4"
      }>
        {articles.map((article) => (
          <Card 
            key={article._id} 
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
                <Image
                  src={article.post_image ? `${process.env.NEXT_PUBLIC_API_URL}${article.post_image}` : 'https://via.placeholder.com/400x300'}
                  alt={article.post_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`font-semibold ${viewMode === 'list' ? 'text-base' : 'text-lg'} line-clamp-2`}>
                    {article.post_name}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/author/articles/edit/${article._id}`)}
                      className="hover:bg-slate-100"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(article._id)}
                      className="hover:bg-slate-100 text-red-500"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className={`text-sm text-gray-600 line-clamp-3 ${viewMode === 'list' ? 'mb-2' : 'mb-4'}`}>
                  {article.post_description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {new Date(article.update_date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded">
                    {article.views || 0} views
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.prevPage)}
            disabled={!pagination.hasPrevPage}
            className="hover:bg-slate-100"
          >
            Previous
          </Button>
          <span className="py-2 px-4 bg-slate-100 rounded">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.nextPage)}
            disabled={!pagination.hasNextPage}
            className="hover:bg-slate-100"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
