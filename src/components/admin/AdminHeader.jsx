import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Newspaper,
  Star,
  Clapperboard,
  Radio,
  Settings,
  Menu, 
  X,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin/dashboard", text: "Inicio", icon: LayoutDashboard },
    { to: "/admin/noticias", text: "Noticias", icon: Newspaper },
    { to: "/admin/noticias-en-tapa", text: "Noticias en Tapa", icon: Star },
    { to: "/admin/destacadas", text: "Destacadas", icon: Star },
    { to: "/admin/recortes", text: "Recortes", icon: Clapperboard },
    { to: "/admin/vivo", text: "Vivo", icon: Radio },
    { to: "/admin/analiticas", text: "Analíticas", icon: BarChart3 },
    { to: "/admin/configuracion", text: "Configuración", icon: Settings },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
          
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.text}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;