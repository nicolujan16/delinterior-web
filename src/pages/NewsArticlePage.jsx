import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { localNews, politicalNews, provincialNews, nationalNews, sliderNews } from '@/data/news';
import { toast } from '@/components/ui/use-toast';

const allNewsData = [...sliderNews, ...localNews, ...politicalNews, ...provincialNews, ...nationalNews];

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
			className="w-full bg-gray-50 border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center p-4 rounded-md"
			style={{ minHeight: '200px' }}
			onClick={handleSponsorClick}
		>
			<div className="text-center text-gray-500">
				<h3 className="font-bold text-lg">Auspiciantes</h3>
				<p className="text-sm">Espacio publicitario</p>
			</div>
		</motion.div>
	);
};

const NewsArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundArticle = allNewsData.find(n => n.id.toString() === id);
    setArticle(foundArticle);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="container mx-auto text-center py-20">Cargando...</div>;
  }

  if (!article) {
    return <Navigate to="/404" />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCategoryPath = (category) => {
    const cat = category.toLowerCase();
    if (cat === 'local' || cat === 'locales') return '/locales';
    if (cat === 'provincial' || cat === 'interior') return '/interior';
    if (cat === 'nacional' || cat === 'nacionales') return '/nacionales';
    if (cat === 'politica' || cat === 'política') return '/politica';
    return '/';
  }

  const paragraphs = article.summary ? article.summary.split('\n\n') : [];
  const firstParagraph = paragraphs.length > 0 ? paragraphs[0] : '';
  const restOfParagraphs = paragraphs.length > 1 ? paragraphs.slice(1) : [];
  
  const images = Array.isArray(article.image) ? article.image : [article.image];

  return (
    <>
      <Helmet>
        <title>{article.title} - Diario Del Interior</title>
        <meta name="description" content={firstParagraph} />
      </Helmet>
      <div className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 lg:grid-cols-5 gap-x-8">
            <main className="lg:col-span-4 col-span-5">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-4 text-sm">
                  <Link to={getCategoryPath(article.category)} className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Tag className="w-4 h-4" />
                    <span className="font-semibold uppercase">{article.category}</span>
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                  {article.title}
                </h1>

                {firstParagraph && (
                  <p className="text-xl text-gray-800 mb-8 leading-relaxed">
                    {firstParagraph}
                  </p>
                )}

                <div className="mb-8">
                  {images.length > 1 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={30}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 5000 }}
                      className="rounded-lg overflow-hidden"
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img src={img} alt={`${article.title} - imagen ${index + 1}`} className="w-full h-auto object-cover aspect-video" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    images[0] && <img src={images[0]} alt={article.title} className="w-full h-auto object-cover aspect-video rounded-lg" />
                  )}
                </div>

                <div className="prose prose-lg max-w-none text-gray-800 leading-loose">
                  {restOfParagraphs.map((p, index) => (
                    <p key={index} className="mb-6">{p}</p>
                  ))}
                </div>
              </motion.article>
            </main>

            <aside className="lg:col-span-1 col-span-5 space-y-8 lg:sticky top-28 self-start mt-12 lg:mt-0">
              <SponsorPlaceholder />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsArticlePage;