import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Newspaper,
  FilePlus,
  Star,
  Clapperboard,
  Radio,
  LogOut,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../context/AuthProvider"
import Swal from 'sweetalert2'

const DashboardCard = ({ to, icon: Icon, title, delay, onClick }) => {
  const content = (
    <Card className="text-center hover:shadow-lg transition-shadow h-full flex flex-col justify-center cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-800">{title}</p>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="h-full"
    >
      {to ? <Link to={to}>{content}</Link> : content}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const { logout } = useAuth()

  const handleLiveToggle = (checked) => {
      setIsLive(checked);
      toast({
          title: `Transmisión ${checked ? "activada" : "desactivada"}`,
          description: `El estado "En Vivo" ha sido actualizado.`,
      });
  };

  const dashboardItems = [
      { to: '/admin/noticias/nueva', icon: FilePlus, title: 'Alta de Noticia' },
      { to: '/admin/noticias-en-tapa', icon: Newspaper, title: 'Noticias en Tapa' },
      { to: '/admin/destacadas', icon: Star, title: 'Noticias Destacadas' },
      { to: '/admin/recortes', icon: Clapperboard, title: 'Añadir Clip' }
  ];

  const handleLogOutSwal = () => {
   Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Vas a salir del panel de administración",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // acá llamás a tu función de Firebase
        Swal.fire("Sesión cerrada", "Has salido correctamente", "success");
      }
    });
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Dashboard</h1>
        <p className="text-gray-600 mt-1">Gestiona el contenido de tu portal de noticias desde aquí.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dashboardItems.map((item, index) => (
          <DashboardCard key={item.to} {...item} delay={index * 0.1} />
        ))}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-full"
        >
          <Card 
            className="text-center h-full flex flex-col justify-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/vivo')}
          >
              <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                         {isLive ? <Radio className="w-8 h-8 text-red-600 animate-pulse" /> : <Radio className="w-8 h-8 text-red-600/50" />}
                      </div>
                  </div>
                  <div 
                    className="flex items-center justify-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Label htmlFor="live-toggle" className="text-lg font-semibold text-gray-800 cursor-pointer">En Vivo</Label>
                    <Switch id="live-toggle" checked={isLive} onCheckedChange={handleLiveToggle} />
                  </div>
              </CardContent>
          </Card>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-full"
            onClick={ handleLogOutSwal }
        >
          <Card className="text-center hover:shadow-lg transition-shadow h-full flex flex-col justify-center cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800">Cerrar Sesión</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;