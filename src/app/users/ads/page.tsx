'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Trash2, Link as LinkIcon, Monitor } from "lucide-react";
import { toast } from 'react-hot-toast';

interface Ad {
  _id: string;
  ads_name: string;
  ads_type: string;
  ads_screen: string;
  ads_link: string;
  ads_status: string;
  ads_image: string;
  ads_sequence: number;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ads_name: '',
    ads_type: '',
    ads_screen: '',
    ads_link: '',
    ads_status: 'active',
    ads_image: null as File | null,
    ads_sequence: 0
  });

  const fetchAds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/ads/getall`);
      if (!response.ok) throw new Error('Failed to fetch ads');
      const data = await response.json();
      const sortedAds = data.data.sort((a: Ad, b: Ad) => a.ads_sequence - b.ads_sequence);
      setAds(sortedAds);
    } catch (error) {
      toast.error('Failed to fetch ads');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      if (editMode && currentAd) {
        // Append old values if unchanged
        formDataToSend.append('ads_name', formData.ads_name.trim() || currentAd.ads_name);
        formDataToSend.append('ads_type', formData.ads_type || currentAd.ads_type);
        formDataToSend.append('ads_screen', formData.ads_screen || currentAd.ads_screen);
        formDataToSend.append('ads_link', formData.ads_link.trim() || currentAd.ads_link);
        formDataToSend.append('ads_status', formData.ads_status || currentAd.ads_status);
        formDataToSend.append('ads_sequence', (formData.ads_sequence || currentAd.ads_sequence).toString());

        if (formData.ads_image) {
          formDataToSend.append('ads_image', formData.ads_image);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/ads/update/${currentAd._id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
        if (!response.ok) throw new Error('Failed to update ad');
        toast.success('Ad updated successfully');
      } else {
        // New Ad
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            formDataToSend.append(key, typeof value === 'number' ? value.toString() : value);
          }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/ads/add`, {
          method: 'POST',
          body: formDataToSend,
        });
        if (!response.ok) throw new Error('Failed to add ad');
        toast.success('Ad added successfully');
      }

      resetForm();
      setDialogOpen(false);
      fetchAds();
    } catch (error) {
      toast.error(editMode ? 'Failed to update ad' : 'Failed to add ad');
      console.error(error);
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditMode(true);
    setCurrentAd(ad);
    setFormData({
      ads_name: '',
      ads_type: '',
      ads_screen: '',
      ads_link: '',
      ads_status: ad.ads_status,
      ads_image: null,
      ads_sequence: 0
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/ads/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete ad');
      toast.success('Ad deleted successfully');
      fetchAds();
    } catch (error) {
      toast.error('Failed to delete ad');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      ads_name: '',
      ads_type: '',
      ads_screen: '',
      ads_link: '',
      ads_status: 'active',
      ads_image: null,
      ads_sequence: 0
    });
    setEditMode(false);
    setCurrentAd(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Advertisements</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>{editMode ? 'Edit Ad' : 'Add New Ad'}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Advertisement' : 'Add New Advertisement'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Ad Name" defaultValue={currentAd?.ads_name || ''} onChange={(e) => setFormData({ ...formData, ads_name: e.target.value })} />
                <Select defaultValue={currentAd?.ads_type || ''} onValueChange={(value) => setFormData({ ...formData, ads_type: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Ad Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={currentAd?.ads_screen || ''} onValueChange={(value) => setFormData({ ...formData, ads_screen: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Screen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="explore">Explore</SelectItem>
                    <SelectItem value="news-details">News Details</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="videos-details">Videos Details</SelectItem>
                    <SelectItem value="livetv">Live Tv</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Ad Link" defaultValue={currentAd?.ads_link || ''} onChange={(e) => setFormData({ ...formData, ads_link: e.target.value })} />
                {editMode && currentAd?.ads_image && !formData.ads_image && (
                  <div className="w-full h-40 rounded-md overflow-hidden">
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/${currentAd.ads_image}`} className="object-contain w-full h-full" />
                  </div>
                )}
                <Input type="file" accept="image/*,video/*" onChange={(e) => setFormData({ ...formData, ads_image: e.target.files?.[0] || null })} />
                <Input type="number" placeholder="Sequence" defaultValue={currentAd?.ads_sequence || 0} onChange={(e) => setFormData({ ...formData, ads_sequence: parseInt(e.target.value) })} />
                <Select defaultValue={currentAd?.ads_status || 'active'} onValueChange={(value) => setFormData({ ...formData, ads_status: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">{editMode ? 'Update Ad' : 'Add Ad'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div key={ad._id} className="bg-white border rounded-lg shadow-sm p-4">
                  {ad.ads_image && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${ad.ads_image}`}
                          alt={ad.ads_name}
                          className="w-full h-40 object-cover rounded-md cursor-pointer"
                          onClick={() => setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/${ad.ads_image}`)}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{ad.ads_name}</DialogTitle>
                        </DialogHeader>
                        <img src={imagePreview || ''} alt={ad.ads_name} className="w-full h-auto rounded-lg" />
                      </DialogContent>
                    </Dialog>
                  )}
                  <h3 className="text-lg font-semibold mt-2">{ad.ads_name}</h3>
                  <div className="text-sm text-gray-500">Sequence: {ad.ads_sequence}</div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Monitor className="h-4 w-4" /> {ad.ads_screen}
                  </div>
                  <a href={ad.ads_link} target="_blank" className="flex items-center gap-2 text-blue-500 text-sm truncate mt-1">
                    <LinkIcon className="h-4 w-4" /> {ad.ads_link}
                  </a>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(ad)}><Edit2 className="h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(ad._id)}><Trash2 className="h-4 w-4" /> Delete</Button>
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
