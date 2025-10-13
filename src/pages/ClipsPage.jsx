import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { TikTokEmbed } from 'react-social-media-embed';

import { useEffect } from "react";
import { useUserNews } from '../context/UserNewsContext';
import Swal from 'sweetalert2';


const ClipsPage = () => {

  const [tiktoks, setTiktoks] = useState([])
  const { getClips } = useUserNews()

  // Get TIKTOKS
  useEffect(() => {
    const fetchTikToks = async() => {
      try{
        let tiktoksLinks = await getClips()
        setTiktoks(tiktoksLinks)
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error obteniendo clips",
          text: err
        })
      }
    }
    fetchTikToks()
  }, [])

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
          {
            tiktoks.map(tt => (
              <div className='flex justify-center'>
                <TikTokEmbed url={tt} width={325} />
              </div>
            ))
          }
        </motion.div>
      </div>
    </>
  );
};

export default ClipsPage;