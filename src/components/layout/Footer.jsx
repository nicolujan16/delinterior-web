import React from "react";
import { Link } from "react-router-dom";
import {
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { categories } from "@/data/news";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white mt-16">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="md:col-span-2">
						<div className="text-2xl font-serif font-bold text-blue-500 mb-4">
							Diario Del Interior
						</div>
						<p className="text-gray-300 mb-6 max-w-md">
							Tu fuente confiable de noticias locales y regionales.
							Comprometidos con la verdad y la transparencia informativa desde
							hace más de una década.
						</p>
						<div className="flex items-center space-x-4">
							<a href="https://www.facebook.com/mananasdemierd" target="_blank">
								<Facebook className="w-5 h-5  social-icon cursor-pointer" />
							</a>
							<a
								href="https://www.instagram.com/mananasdemierda"
								target="_blank"
							>
								<Instagram className="w-5 h-5  social-icon cursor-pointer" />
							</a>
							<a href="https://www.tiktok.com/@mananasdemierda" target="_blank">
								<svg
									fill="white"
									className="w-5 h-5 social-icon cursor-pointer"
									viewBox="0 0 24 24"
								>
									<path d="M15.9453 8.68918V15.6727C15.9453 19.1598 13.1048 22.0004 9.6177 22.0004C8.27369 22.0004 7.01685 21.5717 5.99251 20.8525C4.35796 19.7047 3.29004 17.8085 3.29004 15.6727C3.29004 12.1783 6.12333 9.34505 9.6104 9.34505C9.90101 9.34505 10.1843 9.36685 10.4676 9.40318V12.9121H10.4386C10.3151 12.8758 10.1843 12.8394 10.0536 12.8177H9.9954C9.86466 12.8032 9.74114 12.7813 9.60309 12.7813C8.00491 12.7813 6.70448 14.0817 6.70448 15.6799C6.70448 17.2782 8.00491 18.5786 9.60309 18.5786C11.2014 18.5786 12.5018 17.2782 12.5018 15.6799V2.00037H15.938C15.938 2.29822 15.9671 2.58881 16.0179 2.87213C16.2649 4.1798 17.035 5.30584 18.1175 6.01053C18.873 6.50452 19.7593 6.78785 20.7182 6.78785V10.2241C18.9416 10.2241 17.288 9.65222 15.9453 8.68918Z"></path>
								</svg>
							</a>
							<a href="https://www.youtube.com/@sevenmediabox" target="_blank">
								<Youtube className="w-5 h-5 social-icon cursor-pointer" />
							</a>
							{/* 
              <Facebook className="w-5 h-5 social-icon cursor-pointer" />
              <Twitter className="w-5 h-5 social-icon cursor-pointer" />
              <Instagram className="w-5 h-5 social-icon cursor-pointer" />
              <Youtube className="w-5 h-5 social-icon cursor-pointer" /> */}
						</div>
					</div>

					{/* <div>
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
          </div> */}

					{/* <div>
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
          </div> */}
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
					<p>&copy; 2025 Diario Del Interior. Todos los derechos reservados.</p>
					<div className="flex items-center space-x-4 mt-4 md:mt-0">
						<button className="hover:text-white transition-colors">
							Política de Privacidad
						</button>
						<button className="hover:text-white transition-colors">
							Términos de Uso
						</button>
						<button className="hover:text-white transition-colors">
							Contacto
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
