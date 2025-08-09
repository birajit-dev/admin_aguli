'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBarChart2, FiFolder, FiCalendar, FiMail, FiCheckCircle, FiSettings, FiLogOut, FiFeather, FiChevronLeft, FiChevronRight, FiImage, FiCpu, FiFile, FiUser, FiBell, FiUsers, FiVideo, FiBookOpen, FiTag, FiCompass, FiTv, FiMessageSquare, FiUserCheck } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  href: string;
  badge?: number;
  category?: string;
}

const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    icon: <FiBarChart2 />, 
    href: '/users/dashboard',
    category: 'Overview'
  },
  {
    name: 'Explore',
    icon: <FiCompass />,
    href: '/users/explore',
    category: 'Overview'
  },
  { 
    name: 'Add News', 
    icon: <FiFeather />, 
    href: '/users/news-ai/add-news',
    category: 'Content'
  },
  { 
    name: 'All News', 
    icon: <FiCpu />, 
    href: '/users/news-ai',
    category: 'Content'
  },
  { 
    name: 'Verify Content', 
    icon: <FiCheckCircle />, 
    href: '/users/verify-content',
    category: 'Content'
  },
  {
    name: 'Videos',
    icon: <FiVideo />,
    href: '/users/videos-pages',
    category: 'Media'
  },
  { 
    name: 'Photo Gallery', 
    icon: <FiImage />, 
    href: '/users/photo-gallery',
    category: 'Media'
  },
  { 
    name: 'File Management', 
    icon: <FiFile />, 
    href: '/users/file-management',
    category: 'Media'
  },
  {
    name: 'Categories',
    icon: <FiTag />,
    href: '/users/add-category',
    category: 'Content'
  },
  {
    name: 'Live TV',
    icon: <FiTv />,
    href: '/users/liveTv',
    category: 'Media'
  },
  {
    name: 'Ads',
    icon: <FiMessageSquare />,
    href: '/users/ads',
    category: 'Marketing'
  },
  {
    name: 'Citizen News',
    icon: <FiUserCheck />,
    href: '/users/citizen',
    category: 'Content'
  },
  { 
    name: 'Calendar', 
    icon: <FiCalendar />, 
    href: '/users/calendar',
    category: 'Management'
  },
  {
    name: 'Push Notifications',
    icon: <FiBell />,
    href: '/users/push-notifications',
    category: 'Communication'
  },
  {
    name: 'Subscribers',
    icon: <FiUsers />,
    href: '/users/subscriber',
    category: 'Management'
  },
  { 
    name: 'Settings', 
    icon: <FiSettings />, 
    href: '/users/setting',
    category: 'System'
  },
  { 
    name: 'Author', 
    icon: <FiUser />, 
    href: '/users/author',
    category: 'System'
  },
];

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
}

const SidebarItem = ({ item, isActive, isExpanded }: SidebarItemProps) => (
  <li>
    <Link href={item.href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start hover:bg-slate-100 transition-colors ${!isExpanded && 'justify-center'}`}
      >
        <span className="text-xl mr-2">{item.icon}</span>
        {isExpanded && (
          <span className="text-sm font-medium flex-1 text-left">
            {item.name}
          </span>
        )}
        {item.badge && isExpanded && (
          <Badge variant="destructive" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Button>
    </Link>
  </li>
);

interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('saasUser');
    setUsername(storedUsername);
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="flex h-screen bg-background">
      <motion.aside
        initial={{ width: sidebarOpen ? 240 : 72 }}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3 }}
        className="border-r bg-slate-50/95 shadow-sm"
      >
        <ScrollArea className="h-full">
          <div className="space-y-4 py-4">
            <div className="px-3 flex justify-between items-center">
              {sidebarOpen && (
                <div className="flex items-center justify-center w-full">
                  <img src={`/images/logo.png`} alt="Aguli Tv" className="h-16 w-full object-contain" />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-slate-200 transition-colors"
              >
                {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
              </Button>
            </div>
            <div className="px-3">
              {sidebarOpen && (
                <div className="flex items-center space-x-2">
                  <FiUser className="text-xl text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{username}</span>
                </div>
              )}
            </div>
            <nav className="space-y-1 px-2">
              {Object.entries(groupedMenuItems).map(([category, items]) => (
                <div key={category} className="mb-4">
                  {sidebarOpen && (
                    <h3 className="mb-2 px-4 text-sm font-semibold text-slate-500">
                      {category}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <SidebarItem
                        key={item.name}
                        item={item}
                        isActive={pathname === item.href}
                        isExpanded={sidebarOpen}
                      />
                    ))}
                  </ul>
                  {sidebarOpen && <Separator className="mt-4 mx-2" />}
                </div>
              ))}
            </nav>
            <div className="px-2">
              <Link href="/users/logout">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${!sidebarOpen && 'justify-center'} hover:bg-red-100 hover:text-red-600 transition-colors`}
                >
                  <FiLogOut className="text-xl mr-2" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">Logout</span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </motion.aside>

      <main className="flex-1 overflow-y-auto p-5">
        <ScrollArea className="h-full rounded-lg bg-white shadow-sm">
          <div className="container py-6">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}