import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUserNews } from '../../context/UserNewsContext';
import { YouTubeEmbed } from 'react-social-media-embed';

const LiveStreamPlayer = () => {

  const {getStreamingLinkAndState} = useUserNews()
  const [streamingLink, setStreamingLink] = useState('')
  const [streamingIsLive, setStreamingIsLive] = useState(false)

  // Fetch streamingLinkAndState
  useEffect(() => {
    const fetchStreamingLink = async () => {
      try{
        let [vivoURL, isLive] = await getStreamingLinkAndState()
        setStreamingLink(vivoURL)
        setStreamingIsLive(isLive)
      }catch(err){
        console.error(err)
      }
    }
    fetchStreamingLink()
  },[])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="relative aspect-video bg-black group cursor-pointer">
              { 
                streamingIsLive ?
                <div className='absolute inset-0 w-full h-full'>
                  <YouTubeEmbed 
                    url={streamingLink}
                    width="100%"
                    height="100%"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border: "none",
                    }}
                  />
                </div>
                :
                <>
                  <div className='bg-[url("https://ugc.production.linktr.ee/79141616-ea4f-44db-9f4c-f4559ef88e9a_Portada-Youtube.png")] bg-s absolute inset-0 flex items-center justify-center bg-[length:100%_100%]'>
                    <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-md animate-pulse">
                      <Radio className="w-4 h-4" />
                      <span>EN VIVO</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-bold text-lg">Nuestra transmisión en directo</h3>
                  </div>
                </>
              }
            </div>
          </div>
        
        <div className="md:col-span-2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">¡Estamos en vivo!</h2>
          <p className="text-gray-600 mb-4">
            Súmate a nuestro stream para el análisis de las noticias más importantes del día, entrevistas exclusivas y mucho más.
          </p>
          <Link to="/en-vivo">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Unirse a la transmisión
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveStreamPlayer;