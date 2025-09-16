
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	User,
	Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { localNews, politicalNews, provincialNews, nationalNews, sliderNews } from '@/data/news';
import FeaturedNews from '@/components/features/NewsSlider';
import LiveStreamPlayer from '@/components/features/LiveStreamPlayer';

const NewsCard = ({ article, index }) => {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	return (
		<motion.article
			key={article.id}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, delay: 0.1 * (index % 3) }}
			className="group news-card-body flex flex-col border-b-2 border-blue-300"
		>
			<Link to={`/noticia/${article.id}`} className="flex flex-col h-full">
				<div className="p-4">
					<h2 className="text-2xl font-serif font-bold mb-2 line-clamp-3 text-gray-800 group-hover:text-blue-600 transition-colors h-24">
						{article.title}
					</h2>
				</div>
				<div className="aspect-video mt-auto">
					{article.image ? (
						<img
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							alt={article.title}
							src={article.image} />
					) : (
						<div className="w-full h-full bg-gray-200"></div>
					)}
				</div>
				<div className="flex items-center justify-between text-xs text-gray-500 p-4 border-t border-gray-200 mt-auto">
					<div className="flex items-center space-x-2">
						<User className="w-3 h-3" />
						<span>{article.author}</span>
					</div>
					<div className="flex items-center space-x-1">
						<Clock className="w-3 h-3" />
						<span>{formatDate(article.date)}</span>
					</div>
				</div>
			</Link>
		</motion.article>
	);
};

const AllNewsSection = ({ news }) => (
	<div className="space-y-6 ">
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{news.map((article, index) => (
				<NewsCard key={article.id} article={article} index={index} />
			))}
		</div>
	</div>
);

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

const HomePage = () => {
	const allNews = [...localNews, ...politicalNews, ...provincialNews, ...nationalNews];

	const handleFeatureClick = () => {
		toast({
			title: "🚧 Esta funcionalidad aún no está implementada",
			description: "",
			duration: 3000,
		});
	};

	return (
		<>
			<Helmet>
				<title>Diario Del Interior - Noticias de La Rioja y Argentina</title>
				<meta name="description" content="Tu fuente confiable de noticias locales, provinciales y nacionales. Mantente informado con las últimas noticias de La Rioja, Argentina." />
			</Helmet>
			<div className="w-full space-y-12 py-8 bg-white">
				<div className="container mx-auto px-4">
					<FeaturedNews news={sliderNews} />
				</div>

				<div className="container mx-auto px-4 border-b-2 border-t-2 border-blue-500 py-4">
					<LiveStreamPlayer />
				</div>

				<div className="container mx-auto px-4">
					<div className="grid grid-cols-5 lg:grid-cols-5 gap-x-8 gap-y-12">
						<main className="lg:col-span-4 col-span-5">
							<AllNewsSection news={allNews} />
						</main>

						<aside className="lg:col-span-1 col-span-5 space-y-8 lg:sticky top-8 self-start">
							<SponsorPlaceholder delay={0.4} />

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.3 }}
								className="bg-white rounded-lg shadow p-6 border"
							>
								<h3 className="text-xl font-serif font-bold mb-4">
									Síguenos
								</h3>
								<div className="grid grid-cols-1  gap-3">
									<Button variant="outline" className="flex items-center justify-center space-x-2" onClick={handleFeatureClick}>
										<Facebook className="w-4 h-4 text-blue-600" />
										<span className="text-sm">Facebook</span>
									</Button>
									<Button variant="outline" className="flex items-center justify-center space-x-2" onClick={handleFeatureClick}>
										<Twitter className="w-4 h-4 text-blue-400" />
										<span className="text-sm">Twitter</span>
									</Button>
									<Button variant="outline" className="flex items-center justify-center space-x-2" onClick={handleFeatureClick}>
										<Instagram className="w-4 h-4 text-pink-600" />
										<span className="text-sm">Instagram</span>
									</Button>
									<Button variant="outline" className="flex items-center justify-center space-x-2" onClick={handleFeatureClick}>
										<Youtube className="w-4 h-4 text-red-600" />
										<span className="text-sm">YouTube</span>
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

export default HomePage;
