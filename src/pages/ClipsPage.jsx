import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { highlightClips } from '@/data/clips';
import { TikTokEmbed } from 'react-social-media-embed';

import { useEffect } from "react";


const ClipsPage = () => {
  const handleFeatureClick = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "",
      duration: 3000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <Helmet>
        <title>Recortes Destacados - Diario Del Interior</title>
        <meta name="description" content="Explora los mejores momentos y clips destacados de nuestras transmisiones en vivo. Revive las entrevistas, debates y noticias más impactantes." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900">Recortes Destacados</h1>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Los momentos más impactantes, divertidos e informativos de nuestras transmisiones. Revívelos cuando quieras.
          </p>
        </motion.div>

        <div className="mb-8 flex justify-end">
          <Button variant="outline" onClick={handleFeatureClick}>
            <Filter className="w-4 h-4 mr-2" />
            Filtrar por fecha
          </Button>
        </div>


        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554057284674981131" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554056914980621624" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554057284674981131" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554056914980621624" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554057284674981131" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554056914980621624" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554057284674981131" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554056914980621624" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554057284674981131" width={325} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed url="https://www.tiktok.com/@mananasdemierda/video/7554056914980621624" width={325} />
          </div>
        
        
        

          {/* {highlightClips.map((clip) => (
            <motion.div
              key={clip.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden news-card-hover cursor-pointer group"
              onClick={handleFeatureClick}
              variants={itemVariants}
            >
              <div className="aspect-video relative">
                <img 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={clip.title}
                 src="https://images.unsplash.com/photo-1558223708-7bea47cdff1c" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white/70 group-hover:text-white transition-all transform group-hover:scale-110" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {clip.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                  {clip.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{clip.views} visualizaciones</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{clip.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))} */}
        </motion.div>
      </div>
    </>
  );
};

export default ClipsPage;