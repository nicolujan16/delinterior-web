import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Clock } from 'lucide-react';
import { sponsorsMain } from '../../data/sponsors';
import { useEffect, useState } from 'react';
import { useUserNews } from '../../context/UserNewsContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

const FeaturedNewsCard = ({ article, isMain = false, isLoading = false }) => {

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if(isLoading){
    return(
      <motion.div
      variants={cardVariants}
      className="group news-card-body flex flex-col h-full"
      >
        <di className="flex flex-col h-full">
          <div className="px-2 py-4 flex-grow flex flex-col gap-[1rem]">
            <h2 className={`font-serif font-bold group-hover:text-blue-600 transition-colors`}>
              Cargando noticia...
            </h2>
          </div>
          <div className="aspect-video mt-auto">
            <img
              src={article.imgURL}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </di>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      className="group news-card-body flex flex-col h-full"
    >
      <Link to={`/noticia/${article.id}`} className="flex flex-col h-full">
        <div className="px-2 py-4 flex-grow flex flex-col gap-[1rem]">
          <h2 className={`font-serif font-bold group-hover:text-blue-600 transition-colors ${isMain ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {article.titulo}
          </h2>
          {isMain && (
            <p className="mt-2 text-s text-gray-800 line-clamp-3">
              {article.copete}
            </p>
          )}
        </div>
        <div className="aspect-video mt-auto">
          <img
            src={article.imgURL}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeaturedNews = ({ categoria = 'Principales' }) => {
  const { getCoverNewsByCategory } = useUserNews()
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchNoticias = async () => {
      try{
        let category = categoria.toLowerCase()
        let news = await getCoverNewsByCategory({category: category})
        setNoticias(news)
        setLoading(false)
      }catch(err){
        setError(err)
      }
    }

    fetchNoticias()
  },[categoria])


  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {
              noticias.length > 0 ?
              <>
                <div className="md:col-span-2 h-full">
                  <FeaturedNewsCard article={noticias[0]} isMain={true} isLoading={loading}/>
                </div>
                <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  <FeaturedNewsCard article={noticias[1]} isLoading={loading}/>
                  <FeaturedNewsCard article={noticias[2]} isLoading={loading}/>
                </div>
              </>
              :
              loading ? 
                <p>Cargando noticias...</p>
              :
                <p>No hay noticias destacadas en esta categoria</p>
            }
          </div>
        </div>

        {/* Espacio Auspiciantes */}
        <div className="lg:col-span-1 flex flex-col">
          <div
            className="w-full flex-grow flex justify-around rounded-md gap-1 lg:gap-12 pt-12 lg:flex-col"
            style={{ minHeight: '150px' }}
          >
            {
              sponsorsMain.map(sp => (
                <a href={sp.linkTo} key={sp.marca} target='_blank' className='w-[33%] h-full flex justify-center items-center lg:w-full'> 
                <img 
                  src={sp.imgURL}
                  alt={sp.marca}
                  className='w-full h-auto' />
                </a>
              ))
            }
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedNews;