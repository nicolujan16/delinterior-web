import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminNews } from '../../context/AdminNewsContext';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';


const AdminNews = () => {
  const { getNewsPerPage, updateNews, deleteNews, loadingNews } = useAdminNews();
  const [page, setPage] = useState(0)
  const [news, setNews] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  // paginacion y traer noticias
  useEffect(() => {
    const fetchNews = async () => {
      let [noticiasPorPaginacion, paginasTotales] = await getNewsPerPage({page: page})
      setNews(noticiasPorPaginacion)
      setTotalPages(paginasTotales)
    };

    fetchNews()
  }, [page])

  // Acciones controladas: cambiar visibilidad y delete
  const handleActionClick = async (action, noticia) => {
    if (action === "changeVisibility") {
      const nuevoEstado = noticia.estado === "activo" ? "inactivo" : "activo";

      const { isConfirmed } = await Swal.fire({
        icon: "question",
        title: "¿Desea cambiar el estado de la noticia?",
        text: `La noticia pasará a estar ${nuevoEstado === "activo" ? "activa" : "inactiva"}.`,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      });

      if (!isConfirmed) return;

      // loader
      Swal.fire({
        title: "Actualizando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await updateNews(noticia.id, { estado: nuevoEstado });
        Swal.fire({ icon: "success", title: "Estado actualizado" });
      } catch (err) {
        console.error("Error actualizando estado:", err);
        Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo actualizar" });
      }
    }

    if (action === "delete") {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "¿Desea eliminar la noticia?",
        text: "Esta acción es irreversible.",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!isConfirmed) return;

      // loader
      Swal.fire({
        title: "Eliminando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteNews(noticia.id);
        Swal.fire({ icon: "success", title: "Noticia eliminada" });
      } catch (err) {
        console.error("Error borrando noticia:", err);
        Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo eliminar" });
      }
    } 

    if(action == 'nextPage'){
      setPage(page + 1)
    }

    if(action == 'previousPage'){
      setPage(page - 1)
    }
  };

  const handleBuscarNoticia = (e) =>{
    e.preventDefault()

  }

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
        <form onSubmit={handleBuscarNoticia} className="relative mt-4 flex gap-2 flex-col">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input required placeholder="Buscar por título..." className="pl-8" />
          <Button className='h-full w-[300px]' >Buscar Noticia</Button>
        </form>
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
              {
              loadingNews ?
              <p className='m-2'>Cargando noticias...</p>
              :
              news.map((noticia) => (
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
                      <Button variant="ghost" size="icon" onClick={() => handleActionClick('changeVisibility', noticia)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link to={`/admin/noticias/editar/${noticia.id}`}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleActionClick('delete', noticia)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`flex justify-center mt-8 ${totalPages < 2 ? 'hidden' : ''}`}>
            <Button 
              variant="outline"
              onClick={() => handleActionClick('previousPage')}
              disabled={page == 0}
            >Página Anterior</Button>
            <span className="self-center mx-4 text-sm">Página {page+1} de {totalPages}</span>
            <Button 
              variant="outline"
              onClick={() => handleActionClick('nextPage')}
              disabled={page == totalPages}
            >Página Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNews;