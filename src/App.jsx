
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import LivePage from '@/pages/LivePage';
import ClipsPage from '@/pages/ClipsPage';
import CategoryPage from '@/pages/CategoryPage';
import NewsArticlePage from '@/pages/NewsArticlePage';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminNews from '@/pages/admin/AdminNews';
import AdminNewsForm from '@/pages/admin/AdminNewsForm';
import AdminFeatured from '@/pages/admin/AdminFeatured';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminCoverNews from '@/pages/admin/AdminCoverNews';
import AdminClips from '@/pages/admin/AdminClips';
import AdminLive from '@/pages/admin/AdminLive';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="locales" element={<CategoryPage categoryId="local" categoryName="Locales" />} />
        <Route path="interior" element={<CategoryPage categoryId="provincial" categoryName="Interior" />} />
        <Route path="nacionales" element={<CategoryPage categoryId="nacional" categoryName="Nacionales" />} />
        <Route path="politica" element={<CategoryPage categoryId="politica" categoryName="Política" />} />
        <Route path="en-vivo" element={<LivePage />} />
        <Route path="recortes-destacados" element={<ClipsPage />} />
        <Route path="noticia/:id" element={<NewsArticlePage />} />
      </Route>
      
      <Route path="/admin" element={<AdminLogin />} />
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="noticias" element={<AdminNews />} />
        <Route path="noticias/nueva" element={<AdminNewsForm />} />
        <Route path="noticias/editar/:id" element={<AdminNewsForm />} />
        <Route path="noticias-en-tapa" element={<AdminCoverNews />} />
        <Route path="destacadas" element={<AdminFeatured />} />
        <Route path="recortes" element={<AdminClips />} />
        <Route path="vivo" element={<AdminLive />} />
        <Route path="analiticas" element={<AdminAnalytics />} />
        <Route path="configuracion" element={<AdminSettings />} />
        <Route path="tapa" element={<Navigate to="/admin/noticias-en-tapa" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;
