'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiBell, FiSettings, FiSend } from 'react-icons/fi';

export default function PushNotifications() {
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    screen: 'newsDetails',
    news_id: '',
    thumbnail_url: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotification(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const sendNotification = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!notification.title || !notification.body || !notification.news_id) {
      setError('Title, body, and news ID are required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/push-notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setSuccess('Push notification sent successfully to all users');
      setNotification({
        title: '',
        body: '',
        screen: 'newsDetails',
        news_id: '',
        thumbnail_url: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error sending push notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Push Notifications</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiBell className="h-6 w-6" />
            Send Push Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              name="title"
              value={notification.title}
              onChange={handleNotificationChange}
              placeholder="Enter notification title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Notification Body</Label>
            <Input
              id="body"
              name="body"
              value={notification.body}
              onChange={handleNotificationChange}
              placeholder="Enter notification body text"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news_id">News ID</Label>
            <Input
              id="news_id"
              name="news_id"
              value={notification.news_id}
              onChange={handleNotificationChange}
              placeholder="Enter news ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              value={notification.thumbnail_url}
              onChange={handleNotificationChange}
              placeholder="Enter thumbnail image URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screen">Target Screen</Label>
            <Select 
              value={notification.screen}
              onValueChange={(value) => setNotification(prev => ({ ...prev, screen: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsDetails">News Details</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="home">Home</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={sendNotification}
            disabled={loading || !notification.title || !notification.body || !notification.news_id}
            className="w-full gap-2 py-6 text-lg"
          >
            <FiSend className="h-5 w-5" />
            Send Push Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
