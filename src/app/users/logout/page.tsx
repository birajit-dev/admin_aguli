'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication-related data from localStorage
    localStorage.removeItem('saasUser');
    localStorage.removeItem('saasEmail'); 
    localStorage.removeItem('token');
    localStorage.removeItem('saasAPI');
    localStorage.removeItem('saasKEY');
    localStorage.removeItem('isAuthenticated');

    // Redirect to login page
    router.push('/login');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Logging out...</h2>
        <p className="text-gray-500">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
