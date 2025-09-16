import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FeaturedNewsCard = ({ article, isMain = false }) => {

  if (!article) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group news-card-body flex flex-col h-full"
    >
      <Link to={`/noticia/${article.id}`} className="flex flex-col h-full">
        <div className="px-2 py-4 flex-grow flex flex-col gap-[1rem]">
          <h2 className={`font-serif font-bold group-hover:text-blue-600 transition-colors ${isMain ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {article.title}
          </h2>
          {isMain && (
            <p className="mt-2 text-s text-gray-800">
              {article.summary?.split('\n\n')[0]}
            </p>
          )}
        </div>
        <div className="aspect-video mt-auto">
          <img
            src={Array.isArray(article.image) ? article.image[0] : article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>{article.author}</span>
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

const FeaturedNews = ({ news }) => {
  const [mainArticle, sideArticle1, sideArticle2] = news;

  const handleSponsorClick = () => {
    toast({
      title: "🚧 Espacio para auspiciantes",
      description: "Este es un espacio reservado para publicidad. ¡Puedes solicitar la integración de auspiciantes!",
      duration: 3000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="md:col-span-2 h-full">
              <FeaturedNewsCard article={mainArticle} isMain={true} />
            </div>
            <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              <FeaturedNewsCard article={sideArticle1} />
              <FeaturedNewsCard article={sideArticle2} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <div
            className="w-full bg-gray-50 border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex-grow flex items-center justify-center p-4 rounded-md"
            style={{ minHeight: '150px' }}
            onClick={handleSponsorClick}
          >
            <div className="text-center text-gray-500">
              <h3 className="font-bold text-lg">Auspiciantes</h3>
              <p className="text-sm">Espacio publicitario</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedNews;