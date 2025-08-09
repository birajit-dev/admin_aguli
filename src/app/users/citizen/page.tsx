'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Citizen {
  _id: string;
  post_name: string;
  post_url: string;
  post_content: string;
  post_image: string;
  profile_name: string;
  post_status: string;
  created_at: string;
  phone_number: string;
  citizen_id: number;
}

export default function CitizenPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedNews, setSelectedNews] = useState<Citizen | null>(null);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/citizen/getall`);
        if (!response.ok) throw new Error('Failed to fetch citizens');
        const data = await response.json();
        setCitizens(data.data);
      } catch (error) {
        console.error('Error fetching citizens:', error);
        toast.error('Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchCitizens();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/citizen/delete/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setCitizens((prev) => prev.filter((item) => item._id !== deleteId));
      toast.success('News deleted successfully');
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting news');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">📰 Citizen News</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            </div>
          ) : citizens.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No news available</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {citizens.map((citizen) => (
                <div
                  key={citizen._id}
                  className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${citizen.post_image}`}
                      alt={citizen.post_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{citizen.post_name}</h2>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{citizen.post_content}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                      <span>By {citizen.profile_name} | {citizen.phone_number}</span>
                      <span>
                        {new Date(citizen.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNews(citizen)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Read More
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(citizen._id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete News</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this news item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              {deleting && <Loader2 className="animate-spin w-4 h-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Read More News Modal */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedNews.post_name}</DialogTitle>
                <p className="text-xs text-gray-500">
                  By {selectedNews.profile_name} •{' '}
                  {new Date(selectedNews.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </DialogHeader>
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedNews.post_image}`}
                  alt={selectedNews.post_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                {selectedNews.post_content}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedNews(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
