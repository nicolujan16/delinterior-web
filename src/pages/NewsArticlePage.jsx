import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useUserNews } from '../context/UserNewsContext'
import { toast } from '@/components/ui/use-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";


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
  const { getNewByID } = useUserNews()
  const navigate = useNavigate()

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cleanHTML, setCleanHTML] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNew = async () => {
      try{
        let noticia = await getNewByID(id)
        setArticle(noticia)
        let purified = DOMPurify.sanitize(noticia.body);
        setCleanHTML(purified)
        setLoading(false)
      }catch(err){
        Swal.fire({
          icon:"error",
          title: "Error obteniendo noticia",
          text: err
        }).then(()=>{
          navigate('/')
        })
      }
    }    
    fetchNew()
  }, [id]);

  if (loading) {
    return(
      <div className='w-full flex flex-col justify-center items-center my-10'>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>;
        <p>Cargando noticia...</p>
      </div>
    ) 
  }

  // if (!article) {
  //   return <Navigate to="/404" />;
  // }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // const getCategoryPath = (category) => {
  //   const cat = category.toLowerCase();
  //   if (cat === 'local' || cat === 'locales') return '/locales';
  //   if (cat === 'provincial' || cat === 'interior') return '/interior';
  //   if (cat === 'nacional' || cat === 'nacionales') return '/nacionales';
  //   if (cat === 'politica' || cat === 'política') return '/politica';
  //   return '/';
  // }

  // const paragraphs = article.summary ? article.summary.split('\n\n') : [];
  // const firstParagraph = paragraphs.length > 0 ? paragraphs[0] : '';
  // const restOfParagraphs = paragraphs.length > 1 ? paragraphs.slice(1) : [];
  
  // const images = Array.isArray(article.image) ? article.image : [article.image];

  return (
    <>
      <Helmet>
        <title>{article.titulo} - Diario Del Interior</title>
        <meta name="description" content={article.copete} />
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
                  <Link to={`/${article.categoria}`} className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Tag className="w-4 h-4" />
                    <span className="font-semibold uppercase">{article.categoria}</span>
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.fechaDeSubida)}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                  {article.titulo}
                </h1>

                <p className="text-xl text-gray-800 mb-8 leading-relaxed">
                  {article.copete}
                </p>

                <div className="mb-8">
                  {/* {images.length > 1 ? (
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
                  )} */}
                  <img src={article.imgURL} alt={article.titulo} className="w-full h-auto object-cover aspect-video rounded-lg" />
                </div>

                <div 
                  className="prose prose-lg max-w-none text-lg leading-loose"
                  dangerouslySetInnerHTML={{ __html: cleanHTML }}
                >
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