import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { sliderNews, localNews, politicalNews, provincialNews, nationalNews } from '@/data/news';

const mockFeatured = [
  { id: 1, title: 'Subite a la "Ruta del Vino"', order: 1 },
  { id: 2, title: 'Quintela planteó la necesidad de un debate nacional...', order: 2 },
  { id: 3, title: 'Qué dicen los chats que complican a Alberto Fernández', order: 3 },
];

const allMockNews = [...sliderNews, ...localNews, ...politicalNews, ...provincialNews, ...nationalNews].sort((a, b) => new Date(b.date) - new Date(a.date));

const AdminFeatured = () => {
    const { toast } = useToast();
    const [modalState, setModalState] = useState({ open: false, item: null });

    const handleActionClick = (action, title = '') => {
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

  return (
    <div className="space-y-8">
      <ConfirmationModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente la noticia: "${modalState.item?.title}"`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Noticias Destacadas Actuales</CardTitle>
          <CardDescription>Arrastra y suelta para ordenar las noticias destacadas en la portada.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockFeatured.sort((a, b) => a.order - b.order).map((news) => (
              <li key={news.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{news.title}</span>
                </div>
                <input type="number" defaultValue={news.order} className="w-16 text-center border rounded-md" onClick={() => handleActionClick("Ordenar por número")} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Noticias</CardTitle>
          <CardDescription>Busca y gestiona todas las noticias para agregarlas a destacadas.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Título</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allMockNews.slice(0, 5).map((news) => (
                  <tr key={news.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{news.title}</td>
                    <td className="px-6 py-4">{news.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleActionClick('Agregar a destacadas', news.title)}>
                          <PlusCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleActionClick('Ver', news.title)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link to={`/admin/noticias/editar/${news.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(news)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => handleActionClick('Paginación')}>Página Anterior</Button>
            <span className="self-center mx-4 text-sm">Página 1 de {Math.ceil(allMockNews.length / 5)}</span>
            <Button variant="outline" onClick={() => handleActionClick('Paginación')}>Página Siguiente</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatured;