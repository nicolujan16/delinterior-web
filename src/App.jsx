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
import { AuthProvider } from './context/AuthProvider';
import AdminRoute from './context/AdminRoute';
import { AdminNewsProvider } from './context/AdminNewsContext';
import { useUserNews } from './context/UserNewsContext'
import { useEffect, useState } from 'react';

function App() {

  const { getCategories } = useUserNews()
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const fetchCats = async () => {
      let cats = await getCategories()
      setCategorias(cats)
    }
    fetchCats()
  },[])


  return (
    <Routes>
      {/* Rutas Publicas */}
      <Route path="/" element={
        <Layout />  
      }>
        <Route index element={<HomePage />} />
        {
          categorias.map(cat => (
            <Route key={cat.value} path={`${cat.value}`} element={<CategoryPage categoryId={`${cat.value}`} categoryName={`${cat.label}`} />} />
          ))
        }
        {/* <Route path="locales" element={<CategoryPage categoryId="local" categoryName="Locales" />} />
        <Route path="interior" element={<CategoryPage categoryId="provincial" categoryName="Interior" />} />
        <Route path="nacionales" element={<CategoryPage categoryId="nacional" categoryName="Nacionales" />} />
        <Route path="politica" element={<CategoryPage categoryId="politica" categoryName="Política" />} /> */}
        <Route path="en-vivo" element={<LivePage />} />
        <Route path="recortes-destacados" element={<ClipsPage />} />
        <Route path="noticia/:id" element={<NewsArticlePage />} />
      </Route>
      
      {/* Admin LogIn */}
      <Route path="/admin" element={
        <AuthProvider>
          <AdminLogin />  
        </AuthProvider>
      } />
      
      {/* Rutas Admin */}
      <Route path="/admin" element={
        <AuthProvider>
          <AdminNewsProvider>
            <AdminLayout />
          </AdminNewsProvider>
        </AuthProvider>  
      }>
        <Route path="dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>  
        } />
        <Route path="noticias" element={
          <AdminRoute>
            <AdminNews />  
          </AdminRoute>
        } />
        <Route path="noticias/nueva" element={
          <AdminRoute>
            <AdminNewsForm />  
          </AdminRoute>
        } />
        <Route path="noticias/editar/:id" element={
          <AdminRoute>
            <AdminNewsForm />  
          </AdminRoute>
        } />
        <Route path="noticias-en-tapa" element={
          <AdminRoute>
            <AdminCoverNews />  
          </AdminRoute>
        } />
        <Route path="editables" element={
          <AdminRoute>
            <AdminFeatured />  
          </AdminRoute>
        } />
        <Route path="recortes" element={
          <AdminRoute>
            <AdminClips />  
          </AdminRoute>
        } />
        <Route path="vivo" element={
          <AdminRoute>
            <AdminLive />  
          </AdminRoute>
        } />
        <Route path="analiticas" element={
          <AdminRoute>
            <AdminAnalytics />  
          </AdminRoute>
        } />
        <Route path="configuracion" element={
          <AdminRoute>
            <AdminSettings />  
          </AdminRoute>
        } />
        <Route path="tapa" element={
          <AdminRoute>
            <Navigate to="/admin/noticias-en-tapa" />  
          </AdminRoute>
        }/>
        <Route path="*" element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" />
          </AdminRoute> 
        }/>
      </Route>
    </Routes>
  );
}

export default App;
