import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAdminNews } from '../../context/AdminNewsContext';
import { useEffect, useState } from 'react';

const mockNews = [
  { id: 1, date: '2025-09-02', category: 'Política', title: 'El gobierno anuncia nuevas medidas económicas', status: 'activo', author: 'Admin' },
  { id: 2, date: '2025-09-01', category: 'Deportes', title: 'El equipo local gana el campeonato', status: 'activo', author: 'Editor' },
  { id: 3, date: '2025-08-30', category: 'Cultura', title: 'Nuevo festival de cine en la ciudad', status: 'inactivo', author: 'Admin' },
  { id: 4, date: '2025-08-29', category: 'Local', title: 'Inauguran nuevo parque en el barrio sur', status: 'activo', author: 'Editor' },
];

const AdminNews = () => {
  const { toast } = useToast();
  const { news } = useAdminNews();
  
  console.log(news)

  const handleActionClick = (action) => {
      toast({
          title: `🚧 Funcionalidad no implementada`,
          description: `La acción de "${action}" aún no está disponible.`,
      });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Noticias</CardTitle>
            <CardDescription>Gestiona todas las noticias de tu portal.</CardDescription>
          </div>
          <Link to="/admin/noticias/nueva">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Noticia
            </Button>
          </Link>
        </div>
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
                <th scope="col" className="px-6 py-3">Fecha</th>
                <th scope="col" className="px-6 py-3">Categoría</th>
                <th scope="col" className="px-6 py-3">Título</th>
                <th scope="col" className="px-6 py-3">Estado</th>
                <th scope="col" className="px-6 py-3">Autor</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {news.map((noticia) => (
              <tr key={noticia.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{noticia.fechaDeSubida}</td>
                <td className="px-6 py-4">{noticia.categoria}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{noticia.titulo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${noticia.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {noticia.estado}
                  </span>
                </td>
                <td className="px-6 py-4">{noticia.author.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleActionClick('Ver')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link to={`/admin/noticias/editar/${noticia.id}`}>
                      <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleActionClick('Asignar foto')}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleActionClick('Borrar')}>
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
            <span className="self-center mx-4 text-sm">Página 1 de 10</span>
            <Button variant="outline" onClick={() => handleActionClick('Paginación')}>Página Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNews;