'use client';
import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiActivity, FiHash } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl mt-2">{value}</CardTitle>
          {trend && <p className="text-sm text-green-500 mt-1">{trend}</p>}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default function NewsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');

    if (!isAuthenticated || !token) {
      router.push('/login?returnUrl=/users/dashboard');
      return;
    }

    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-[300px] mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  const newsMetricsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Article Views',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const keywordAnalysisData = {
    labels: ['AI', 'Technology', 'Business', 'Politics', 'Health'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const sentimentAnalysisData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: 'Sentiment Distribution',
      data: [65, 25, 10],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8">
        <CardTitle className="text-3xl mb-8">News Analytics Dashboard</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Articles" 
            value="1,234"
            icon={<FiBarChart2 size={24} />}
            trend="+12% from last month"
          />
          <StatCard 
            title="AI-Generated Insights" 
            value="856"
            icon={<FiActivity size={24} />}
            trend="+8% from last month"
          />
          <StatCard 
            title="Trending Keywords" 
            value="142"
            icon={<FiHash size={24} />}
            trend="+15% from last month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Article Performance</CardTitle>
              <CardDescription>Monthly view trends across all articles</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={newsMetricsData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Distribution</CardTitle>
              <CardDescription>Most frequent topics in your content</CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut data={keywordAnalysisData} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Sentiment Analysis</CardTitle>
              <CardDescription>Content sentiment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={sentimentAnalysisData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Smart insights for content strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Trending Topic</AlertTitle>
                  <AlertDescription>
                    Consider creating content about &ldquo;Artificial Intelligence in Healthcare&rdquo;
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTitle>SEO Opportunity</AlertTitle>
                  <AlertDescription>
                    &ldquo;Sustainable Technology&rdquo; has low competition with high search volume
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTitle>Content Gap</AlertTitle>
                  <AlertDescription>
                    Your readers are showing interest in &ldquo;Cybersecurity&rdquo; related topics
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
