'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBarChart2, FiFeather, FiChevronLeft, FiChevronRight, FiUser, FiSettings, FiLogOut, FiImage, FiFolder } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  href: string;
  category?: string;
}

const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    icon: <FiBarChart2 />, 
    href: '/author/dashboard',
    category: 'Overview'
  },
  { 
    name: 'Create Post', 
    icon: <FiFeather />, 
    href: '/author/news-ai/create',
    category: 'Content'
  },
  {
    name: 'Photo Manager',
    icon: <FiImage />,
    href: '/author/photo-management',
    category: 'Content'
  },
  {
    name: 'File Manager',
    icon: <FiFolder />,
    href: '/author/file-management', 
    category: 'Content'
  },
  { 
    name: 'Profile', 
    icon: <FiUser />, 
    href: '/author/profile',
    category: 'Account'
  },
  { 
    name: 'Settings', 
    icon: <FiSettings />, 
    href: '/author/settings',
    category: 'Account'
  }
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
      </Button>
    </Link>
  </li>
);

interface AuthorLayoutProps {
  children: React.ReactNode;
}

export default function AuthorLayout({ children }: AuthorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedAuthorName = localStorage.getItem('authorName');
    setAuthorName(storedAuthorName);
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleLogout = () => {
    // Clear author related items from localStorage
    localStorage.removeItem('authorToken');
    localStorage.removeItem('authorName');
    localStorage.removeItem('authorId');
    window.location.href = '/author-login';
  };

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
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-blue-600">Author Portal</span>
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
                  <span className="text-sm font-medium text-blue-600">{authorName}</span>
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
                </div>
              ))}
              <div className="px-2 mt-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100 text-red-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-xl mr-2" />
                  {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
                </Button>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </motion.aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
