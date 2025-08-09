'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Trash2, Heart, Calendar, Edit } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExplorePost {
  _id: string;
  explore_title: string;
  explore_descriptions: string;
  explore_thumb: string[];
  explore_slug: string;
  explore_status: string;
  explore_likes: string;
  createdat: string;
}

export default function ExplorePage() {
  const [explorePosts, setExplorePosts] = useState<ExplorePost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 12;

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/explore/getall`);
      if (!response.ok) {
        throw new Error('Failed to fetch explore posts');
      }
      const result = await response.json();
      if (result.success) {
        setExplorePosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/explore/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete explore post');
      }

      const result = await response.json();
      if (result.success) {
        fetchExplorePosts();
      }
    } catch (error) {
      console.error('Error deleting explore post:', error);
    }
  };

  const filteredPosts = explorePosts
    .filter(post => post.explore_title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(post => statusFilter === 'all' ? true : post.explore_status === statusFilter);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Explore Posts
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 h-12 w-full rounded-lg border border-slate-200 dark:border-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Filter size={20} />
                    {statusFilter === 'all' ? 'All Status' : statusFilter === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/users/explore/add-explore">
              <Button className="h-12 w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                <Plus size={20} className="mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {currentPosts.map((post) => (
                <motion.div
                  key={post._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 w-full">
                    {post.explore_thumb.length > 0 && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${post.explore_thumb[0]}`}
                        alt={post.explore_title}
                        fill
                        className="object-cover rounded-t-xl"
                      />
                    )}
                    <Badge 
                      variant={post.explore_status === 'active' ? 'default' : 'secondary'}
                      className="absolute top-4 right-4 capitalize"
                    >
                      {post.explore_status}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-1 text-slate-800 dark:text-slate-100">
                      {post.explore_title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">
                      {post.explore_descriptions}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-rose-500" />
                        <span>{post.explore_likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(post.createdat).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {/* Add edit handler */}}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="h-10 px-4"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 ${currentPage === page ? 'bg-emerald-600' : ''}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline" 
              className="h-10 px-4"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
