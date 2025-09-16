import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { categories } from '@/data/news';

const Footer = () => {
  const handleFeatureClick = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-serif font-bold text-blue-500 mb-4">
              Diario Del Interior
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Tu fuente confiable de noticias locales y regionales. Comprometidos con la verdad y la transparencia informativa desde hace más de una década.
            </p>
            <div className="flex items-center space-x-4">
              <Facebook className="w-5 h-5 social-icon cursor-pointer" onClick={handleFeatureClick} />
              <Twitter className="w-5 h-5 social-icon cursor-pointer" onClick={handleFeatureClick} />
              <Instagram className="w-5 h-5 social-icon cursor-pointer" onClick={handleFeatureClick} />
              <Youtube className="w-5 h-5 social-icon cursor-pointer" onClick={handleFeatureClick} />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Secciones</h4>
            <div className="space-y-2">
              {categories.slice(1).map((category) => (
                <Link
                  key={category.id}
                  to={`/?category=${category.id}`}
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {category.name}
                </Link>
              ))}
              <Link to="/en-vivo" className="block text-gray-300 hover:text-white transition-colors text-sm">En Vivo</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@diariodelinterior.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Av. Principal 123, Ciudad</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; 2025 Diario Del Interior. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button onClick={handleFeatureClick} className="hover:text-white transition-colors">Política de Privacidad</button>
            <button onClick={handleFeatureClick} className="hover:text-white transition-colors">Términos de Uso</button>
            <button onClick={handleFeatureClick} className="hover:text-white transition-colors">Contacto</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;