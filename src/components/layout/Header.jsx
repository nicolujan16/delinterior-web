import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, transform } from 'framer-motion';
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
import LogoDI from '@/assets/logo4di.png'
import { useUserNews } from '../../context/UserNewsContext'
import Swal from 'sweetalert2';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const headerRef = useRef(null);
  const { getCategories } = useUserNews()
  const [categorias, setCategorias] = useState([])

  // CATEGORIAS
  useEffect(() => {
    const fetchCats = async () => {
      try{
        let cats = await getCategories()
        let newCats = [
          { to: "/", text: "Inicio" }
        ]
        cats.forEach((cat) => {
          if(cat.value !== 'Principales'){
            newCats.push({
              to: `/${cat.value}`,
              text: cat.label
            })
          }
        })

        setCategorias([
          ...newCats,
          { to: "/recortes-destacados", text: "Recortes" },
          { to: "/en-vivo", text: "En Vivo" }
        ])
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error obteniendo categorias",
          text: err
        })
      }
    }
    fetchCats()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        if (window.scrollY > (headerBottom + 80)) {
          setIsNavbarSticky(true);
        } else {
          setIsNavbarSticky(false);
        }
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
    { to: "/recortes-destacados", text: "Recortes" },
    { to: "/en-vivo", text: "En Vivo" },
  ];

  return (
    <>
      <header ref={headerRef} className="bg-white z-40">
        <div className="bg-white hidden sm:flex">
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
                <a href="https://www.facebook.com/mananasdemierd" target='_blank'>
                  <Facebook className="w-4 h-4 text-blue-600 social-icon cursor-pointer"/>
                </a>
                <a href="https://www.instagram.com/mananasdemierda" target='_blank'>
                  <Instagram className="w-4 h-4 text-pink-600 social-icon cursor-pointer"/>
                </a>
                <a href="https://www.tiktok.com/@mananasdemierda" target='_blank'>
                  <svg fill="black" className='w-4 h-4 social-icon cursor-pointer' viewBox="0 0 24 24">
                    <path d="M15.9453 8.68918V15.6727C15.9453 19.1598 13.1048 22.0004 9.6177 22.0004C8.27369 22.0004 7.01685 21.5717 5.99251 20.8525C4.35796 19.7047 3.29004 17.8085 3.29004 15.6727C3.29004 12.1783 6.12333 9.34505 9.6104 9.34505C9.90101 9.34505 10.1843 9.36685 10.4676 9.40318V12.9121H10.4386C10.3151 12.8758 10.1843 12.8394 10.0536 12.8177H9.9954C9.86466 12.8032 9.74114 12.7813 9.60309 12.7813C8.00491 12.7813 6.70448 14.0817 6.70448 15.6799C6.70448 17.2782 8.00491 18.5786 9.60309 18.5786C11.2014 18.5786 12.5018 17.2782 12.5018 15.6799V2.00037H15.938C15.938 2.29822 15.9671 2.58881 16.0179 2.87213C16.2649 4.1798 17.035 5.30584 18.1175 6.01053C18.873 6.50452 19.7593 6.78785 20.7182 6.78785V10.2241C18.9416 10.2241 17.288 9.65222 15.9453 8.68918Z">
                    </path>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@sevenmediabox" target='_blank'>
                  <Youtube className="w-4 h-4 text-red-600 social-icon cursor-pointer"/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className={`relative flex items-center justify-center py-4`}>
            <div className="absolute left-0 md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
            
            <Link to="/">
              <div className="text-3xl font-serif font-bold text-blue-600 flex gap-2 items-center justify-center sm:gap-4">
                <div className='overflow-hidden h-[40px]'>
                  <img src={LogoDI} alt='DI' className='h-[50px]' />
                </div>
                <p className='hidden text-[2rem] [@media(min-width:420px)]:flex sm:text-[2.5rem]'>
                  delinterior.com.ar
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>
      
      <div className={`bg-white z-50 shadow-lg ${isNavbarSticky ? 'fixed top-0 left-0 right-0' : 'relative'}`}>
        <div className="container mx-auto px-4">
          <nav className="hidden md:block border-t border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-8">
                <AnimatePresence>
                  {isNavbarSticky && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: -20, width: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <Link to="/" className="text-lg font-serif font-bold text-blue-600 mr-8 whitespace-nowrap flex justify-center items-center w-full">
                        <div className='overflow-hidden h-[40px] w-full flex justify-center items-center '>
                          <img src={LogoDI} alt='DI' className='h-[50px] mt-1' />
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {
                categorias.length > 0 &&
                categorias.map(link => (
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
                ))
}
              </div>
              {/* <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-transparent outline-none text-sm w-24 focus:w-32 transition-all"
                  onClick={handleFeatureClick}
                />
              </div> */}
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
      </div>
    </>
  );
};

export default Header;