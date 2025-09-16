import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Clock, 
  Calendar,
  Sun,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Radio,
  Clapperboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
      
      if (scrollPosition > 1) {
        setIsTopBarVisible(false);
      } else {
        setIsTopBarVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFeatureClick = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "",
      duration: 3000,
    });
  };

  const navLinks = [
    { to: "/", text: "Inicio" },
    { to: "/locales", text: "Locales" },
    { to: "/interior", text: "Interior" },
    { to: "/nacionales", text: "Nacionales" },
    { to: "/politica", text: "Política" },
    { to: "/recortes-destacados", text: "Recortes" },
    { to: "/en-vivo", text: "En Vivo" },
  ];

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
        {/* fecha y tiempo */}
        {/* <AnimatePresence>
          {isTopBarVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentTime.toLocaleTimeString('es-ES')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="weather-widget px-3 py-1 rounded-full text-white text-xs flex items-center space-x-1">
                      <Sun className="w-3 h-3" />
                      <span>24°C</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-4 h-4 text-blue-600 social-icon cursor-pointer" onClick={handleFeatureClick} />
                    <Twitter className="w-4 h-4 text-blue-400 social-icon cursor-pointer" onClick={handleFeatureClick} />
                    <Instagram className="w-4 h-4 text-pink-600 social-icon cursor-pointer" onClick={handleFeatureClick} />
                    <Youtube className="w-4 h-4 text-red-600 social-icon cursor-pointer" onClick={handleFeatureClick} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}

        <div className="container mx-auto px-4">
          <div className={`relative flex items-center justify-center py-4 ${isScrolled ? "md:hidden" : ""}`}>
            <div className="absolute left-0 md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
            
            <div>
              <div 
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/">
                  <div className="text-3xl font-serif font-bold text-blue-600">
                    delinterior.com.ar
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <nav className="hidden md:block border-t border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-8">
                <AnimatePresence>
                  {isScrolled && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: -20, width: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <Link to="/" className="text-lg font-serif font-bold text-blue-600 mr-8 whitespace-nowrap">
                        delinterior.com.ar
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    {link.to === '/en-vivo' ? (
                      <span className="flex items-center space-x-2">
                        <div className="live-indicator">
                          <span className="live-indicator-ping"></span>
                          <span className="live-indicator-dot"></span>
                        </div>
                        <span>{link.text}</span>
                      </span>
                    ) : link.to === '/recortes-destacados' ? (
                      <span className="flex items-center space-x-2">
                        <Clapperboard className="w-4 h-4" />
                        <span>{link.text}</span>
                      </span>
                    ) : (
                      link.text
                    )}
                  </NavLink>
                ))}
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-transparent outline-none text-sm w-24 focus:w-32 transition-all"
                  onClick={handleFeatureClick}
                />
              </div>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Buscar noticias..." 
                      className="bg-transparent outline-none text-sm w-full"
                      onClick={handleFeatureClick}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => `flex items-center justify-center space-x-2 text-sm font-medium p-2 rounded transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {link.to === '/en-vivo' ? <Radio className="w-4 h-4" /> : null}
                        {link.to === '/recortes-destacados' ? <Clapperboard className="w-4 h-4" /> : null}
                        <span>{link.text}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;