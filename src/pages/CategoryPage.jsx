import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock, Newspaper, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { localNews, politicalNews, provincialNews, nationalNews } from '@/data/news';
import FeaturedNews from '@/components/features/NewsSlider';
import { Button } from '@/components/ui/button';

const allNewsData = {
  local: localNews,
  provincial: provincialNews,
  nacional: nationalNews,
  politica: politicalNews,
};

const NewsCard = ({ article, index, size = 'normal' }) => {
  const handleNewsClick = () => {
    toast({
      title: "🚧 Funcionalidad no implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const cardClass = size === 'medium' ? 'md:col-span-1' : 'sm:col-span-1';
  const titleClass = size === 'medium' ? 'text-xl h-24' : 'text-lg h-20';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * (index % 4) }}
      className={`group news-card-body flex flex-col ${cardClass}`}
      onClick={handleNewsClick}
    >
      <div className="p-4">
        <h2 className={`${titleClass} font-serif font-bold mb-2 line-clamp-3 text-gray-800 group-hover:text-blue-600 transition-colors`}>
          {article.title}
        </h2>
      </div>
      <div className="aspect-video mt-auto">
        <img  
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={article.title}
          src={article.image} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <User className="w-3 h-3" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(article.date)}</span>
        </div>
      </div>
    </motion.article>
  );
};

const SponsorPlaceholder = ({ delay = 0.3 }) => {
  const handleSponsorClick = () => {
    toast({
      title: "🚧 Espacio para auspiciantes",
      description: "Este es un espacio reservado para publicidad. ¡Puedes solicitar la integración de auspiciantes!",
      duration: 3000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="h-full w-full bg-white border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors min-h-[140px] xl:min-h-[70%] flex items-center justify-center p-4 rounded-lg"
      onClick={handleSponsorClick}
    >
      <div className="text-center text-gray-500 p-4">
        <h3 className="font-bold text-lg">Auspiciantes</h3>
        <p className="text-sm">Espacio publicitario</p>
      </div>
    </motion.div>
  );
};

const CategoryPage = ({ categoryId, categoryName }) => {
  const newsForCategory = allNewsData[categoryId] || [];
  const largeNews = newsForCategory.slice(0, 3);
  const mediumNews = newsForCategory.slice(3, 6);
  const restNews = newsForCategory.slice(6);

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
        <title>{categoryName} - Diario Del Interior</title>
        <meta name="description" content={`Últimas noticias de la categoría ${categoryName}. Mantente informado con Diario Del Interior.`} />
      </Helmet>
      <div className="w-full space-y-12 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8">{categoryName}</h1>
          {largeNews.length > 0 && <FeaturedNews news={largeNews} />}
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12">
            <main className="lg:col-span-9 space-y-12">
              {mediumNews.length > 0 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mediumNews.map((article, index) => (
                      <NewsCard key={article.id} article={article} index={index} size="medium" />
                    ))}
                  </div>
                </section>
              )}

              {restNews.length > 0 && (
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <Newspaper className="w-7 h-7 text-blue-600" />
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Más Noticias de {categoryName}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {restNews.map((article, index) => (
                      <NewsCard key={article.id} article={article} index={index} />
                    ))}
                  </div>
                </section>
              )}
            </main>

            <aside className="lg:col-span-3 space-y-8 lg:sticky top-28 self-start">
              <SponsorPlaceholder delay={0.4} />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white"
              >
                <h3 className="text-xl font-serif font-bold mb-3">
                  Suscríbete a nuestro boletín
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Recibe las noticias más importantes directamente en tu correo
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm"
                    onClick={handleFeatureClick}
                  />
                  <Button 
                    className="w-full bg-white text-blue-600 hover:bg-gray-100"
                    onClick={handleFeatureClick}
                  >
                    Suscribirse
                  </Button>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;