import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AddNewsModal from '@/components/admin/AddNewsModal';
import { sliderNews, localNews, politicalNews, provincialNews, nationalNews } from '@/data/news';

const allMockNews = [...sliderNews, ...localNews, ...politicalNews, ...provincialNews, ...nationalNews];

const NewsListItem = ({ news, onAction, onDelete }) => (
  <li className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
    <img src={news.image} alt={news.title} className="w-16 h-10 object-cover rounded-md bg-gray-200" />
    <div className="flex-1">
      <p className="text-sm font-medium line-clamp-2">{news.title}</p>
    </div>
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={() => onAction('Ver', news.title)}><Eye className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => onAction('Editar', news.title)}><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDelete(news)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </li>
);

const NewsListSection = ({ title, news, onAction, onDelete, onAdd }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {onAdd && (
        <Button variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      )}
    </div>
    <ul className="space-y-2">
      {news.map(item => <NewsListItem key={item.id} news={item} onAction={onAction} onDelete={onDelete} />)}
    </ul>
    <div className="flex justify-center">
      <Button variant="outline" size="sm" onClick={() => onAction('Paginación')}>Ver más</Button>
    </div>
  </div>
);

const CoverNewsTabContent = ({ onAction, onDelete, category }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const largeNews = allMockNews.slice(0, 2);
  const mediumNews = allMockNews.slice(2, 5);
  const smallNews = allMockNews.slice(5, 10);

  return (
    <>
      <AddNewsModal open={isModalOpen} onOpenChange={setIsModalOpen} category={category} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <NewsListSection title="Noticias Grandes" news={largeNews} onAction={onAction} onDelete={onDelete} onAdd={() => setIsModalOpen(true)} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <NewsListSection title="Noticias Medianas" news={mediumNews} onAction={onAction} onDelete={onDelete} onAdd={() => setIsModalOpen(true)} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <NewsListSection title="Resto de Noticias" news={smallNews} onAction={onAction} onDelete={onDelete} />
        </div>
      </div>
    </>
  );
};

const AdminCoverNews = () => {
  const { toast } = useToast();
  const [modalState, setModalState] = useState({ open: false, item: null });

  const handleAction = (action, title = '') => {
    toast({
      title: `🚧 Funcionalidad no implementada`,
      description: `La acción de "${action}" ${title ? `en '${title}'` : ''} no está disponible.`,
    });
  };

  const openDeleteModal = (item) => {
    setModalState({ open: true, item: item });
  };

  const confirmDelete = () => {
    if (modalState.item) {
      toast({
        title: "Noticia eliminada (simulado)",
        description: `La noticia "${modalState.item.title}" ha sido eliminada.`,
        action: <Button variant="secondary" size="sm" onClick={() => toast({ title: "Acción Deshacer (simulado)" })}>Deshacer</Button>,
      });
    }
    setModalState({ open: false, item: null });
  };

  const tabs = [
    { value: 'principales', label: 'Principales', category: 'principales' },
    { value: 'locales', label: 'Locales', category: 'local' },
    { value: 'nacionales', label: 'Nacionales', category: 'nacional' },
    { value: 'interior', label: 'Interior', category: 'provincial' },
    { value: 'politica', label: 'Política', category: 'politica' },
  ];

  return (
    <>
      <ConfirmationModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente la noticia: "${modalState.item?.title}"`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Noticias en Tapa</CardTitle>
          <CardDescription>Gestiona las noticias que aparecen en las diferentes secciones de la portada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="principales" className="w-full">
            <TabsList className="grid w-full h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card>
                  <CardContent className="p-6">
                    <CoverNewsTabContent onAction={handleAction} onDelete={openDeleteModal} category={tab.category} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminCoverNews;