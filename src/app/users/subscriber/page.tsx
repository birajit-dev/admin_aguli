'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX, FiTrendingUp, FiActivity, FiClock, FiMap } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  newSubscribers: number;
  churnedSubscribers: number;
  retentionRate: number;
  averageEngagement: number;
  lifetimeValue: number;
  conversionRate: number;
}

interface EngagementData {
  date: string;
  subscribers: number;
  engagement: number;
  retention: number;
}

export default function SubscriberPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 1250,
    activeSubscribers: 980,
    newSubscribers: 145,
    churnedSubscribers: 25,
    retentionRate: 92,
    averageEngagement: 76,
    lifetimeValue: 850,
    conversionRate: 3.2
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo engagement data
  const engagementData: EngagementData[] = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    subscribers: Math.floor(Math.random() * 100) + 950,
    engagement: Math.floor(Math.random() * 30) + 60,
    retention: Math.floor(Math.random() * 20) + 75
  }));

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In real app, fetch data based on timeRange
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Advanced Subscriber Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <FiUsers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-sm text-green-600">+{stats.newSubscribers} new</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <FiActivity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.retentionRate}%</div>
            <p className="text-sm text-slate-500">Last {timeRange}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lifetime Value</CardTitle>
            <FiTrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.lifetimeValue}</div>
            <p className="text-sm text-slate-500">Per subscriber</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <FiUserPlus className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-sm text-slate-500">Visitors to subscribers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="retention">Retention Analysis</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-4">
            <CardTitle className="mb-4">Subscriber Engagement Trends</CardTitle>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement Rate %" />
                  <Line type="monotone" dataKey="retention" stroke="#82ca9d" name="Retention Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card className="p-4">
            <CardTitle className="mb-4">Cohort Analysis</CardTitle>
            {/* Add cohort analysis visualization */}
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card className="p-4">
            <CardTitle className="mb-4">Geographic Distribution</CardTitle>
            {/* Add geographic distribution visualization */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
