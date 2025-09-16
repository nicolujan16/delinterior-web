import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from '@/components/ui/toaster';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100/50">
      <Toaster />
      <AdminHeader />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;