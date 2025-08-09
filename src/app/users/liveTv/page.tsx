'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
// AlertDialog removed - using window.confirm instead

interface Channel {
  _id: string;
  live_tv_name: string;
  live_tv_link: string;
}

// Mock toast function since react-hot-toast isn't available
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message)
};

export default function LiveTVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState({
    live_tv_name: '',
    live_tv_link: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/aguli_tv/livetv/getall`);
      const data = await response.json();
      // Extract only liveTVChannels from the response, skip recentNews
      setChannels(data.data.liveTVChannels || []);
    } catch (error) {
      toast.error('Failed to fetch channels');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editMode && currentChannel) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/aguli_tv/livetv/update/${currentChannel._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update channel');
        toast.success('Channel updated successfully');
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/aguli_tv/livetv/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to add channel');
        toast.success('Channel added successfully');
      }
      setFormData({ live_tv_name: '', live_tv_link: '' });
      setEditMode(false);
      setCurrentChannel(null);
      setDialogOpen(false);
      fetchChannels();
    } catch (error) {
      toast.error(editMode ? 'Failed to update channel' : 'Failed to add channel');
      console.error(error);
    }
  };

  const handleEdit = (channel: Channel) => {
    setEditMode(true);
    setCurrentChannel(channel);
    setFormData({
      live_tv_name: channel.live_tv_name,
      live_tv_link: channel.live_tv_link
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this channel? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/aguli_tv/livetv/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete channel');
      toast.success('Channel deleted successfully');
      fetchChannels();
    } catch (error) {
      toast.error('Failed to delete channel');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ live_tv_name: '', live_tv_link: '' });
    setEditMode(false);
    setCurrentChannel(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live TV Channels</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>Add New Channel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Channel' : 'Add New Channel'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Channel Name"
                  value={formData.live_tv_name}
                  onChange={(e) => setFormData({ ...formData, live_tv_name: e.target.value })}
                />
                <Input
                  placeholder="Channel Link"
                  value={formData.live_tv_link}
                  onChange={(e) => setFormData({ ...formData, live_tv_link: e.target.value })}
                />
                <DialogFooter>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    if (formData.live_tv_name && formData.live_tv_link) {
                      handleSubmit(e as any);
                    }
                  }}>
                    {editMode ? 'Update Channel' : 'Add Channel'}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading channels...</div>
          ) : (
            <div className="grid gap-4">
              {channels.map((channel) => (
                <div key={channel._id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="font-medium">{channel.live_tv_name}</h3>
                    <p className="text-sm text-gray-500">{channel.live_tv_link}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(channel)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(channel._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}