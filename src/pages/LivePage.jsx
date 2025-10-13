import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Play, 
  Volume2, 
  Maximize, 
  Heart, 
  Share2, 
  Eye, 
  Send,
  User,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { localNews, categories } from '@/data/news';
import { useUserNews } from '../context/UserNewsContext';
import Swal from 'sweetalert2';
import { YouTubeEmbed } from 'react-social-media-embed';

const LivePage = () => {
  const { getStreamingLinkAndState } = useUserNews()
  const [streamingLink, setStreamingLink] = useState('')
  const [streamingIsLive, setStreamingIsLive] = useState(false)

  useEffect(() => {
    const fetchStreamingData = async () => {
      try{
        let [streamingURL, isLive] = await getStreamingLinkAndState()
        setStreamingIsLive(isLive)
        setStreamingLink(streamingURL)
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "No se pudó obtener la informacion del directo",
          text: err
        })
      }
    }
    fetchStreamingData()
  },[])

  const handleFeatureClick = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  return (
    <>
      <Helmet>
        <title>En Vivo - Diario Del Interior</title>
        <meta name="description" content="Sigue nuestra transmisión en vivo. Noticias de último momento, entrevistas y análisis con nuestros periodistas." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-4">
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                  {
                    streamingIsLive ? 
                      <div className='absolute inset-0 w-full h-full'>
                        <iframe width={"100%"} height={"100%"} src={streamingLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      </div>
                    :
                    <>
                      <img 
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                        alt="Studio background for live broadcast"
                        src="https://ugc.production.linktr.ee/79141616-ea4f-44db-9f4c-f4559ef88e9a_Portada-Youtube.png" />
                      <div className="absolute inset-0 bg-black/50"></div>
                      <div className="relative z-10 text-center text-white">
                        <div className="mb-4">
                          <div className="inline-flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                            <div className="live-indicator">
                              <span className="live-indicator-ping"></span>
                              <span className="live-indicator-dot"></span>
                            </div>
                            <span>EN VIVO</span>
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold font-serif mb-2">Mañanas de Mierda</h1>
                        <p className="text-gray-300">Conduce: Carlos Scagnolari</p>
                        <Button size="lg" className="mt-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30" onClick={handleFeatureClick}>
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleFeatureClick}><Play className="w-5 h-5" /></Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleFeatureClick}><Volume2 className="w-5 h-5" /></Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleFeatureClick}><Maximize className="w-5 h-5" /></Button>
                        </div>
                      </div>
                    </>                  
                  }
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Análisis de la Jornada: Edición Especial</h1>
                    <p className="text-gray-600 mt-1">Publicado el 8 de agosto de 2025</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="flex items-center space-x-1 text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-full">
                      <Eye className="w-4 h-4" />
                      <span>3,456 espectadores</span>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleFeatureClick}><Heart className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={handleFeatureClick}><Share2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">
                  Únete a nuestro panel de expertos mientras analizan los eventos más importantes del día, con entrevistas exclusivas y reportajes desde el lugar de los hechos. Hoy cubrimos el impacto de las nuevas medidas económicas y los últimos resultados deportivos.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-2xl flex flex-col w-full h-fit">
              </div>
              {/* <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-serif font-bold mb-4">Más Noticias</h3>
                <div className="space-y-4">
                  {localNews.slice(0, 2).map((article) => (
                    <div key={article.id} className="flex space-x-3 cursor-pointer group" onClick={handleFeatureClick}>
                      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={article.title}
                          src={article.image} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className={`font-semibold text-red-600`}>
                            {categories.find(cat => cat.id === article.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LivePage;