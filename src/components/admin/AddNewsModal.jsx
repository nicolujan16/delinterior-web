import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminNews } from '../../context/AdminNewsContext';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';

const AddNewsModal = ({ open, onOpenChange, category }) => {
  const [news, setNews] = useState([])
  const [page, setPage] = useState(0)
  const [paginasTotales, setPaginasTotales] = useState(0)
  const { getNewsPerPage, loadingNews, getNoticiasEnTapa: getNoticiasEnTapaID, setTapaPorCategoria } = useAdminNews();

  
  const [selectedNews, setSelectedNews] = useState([]);
  
  // Limpiar selectedNews si se cambia category y obtener noticias en tapa
  useEffect(() => {
    setSelectedNews([])
    fetchNews()
  },[category])

  const fetchNews = async()=>{
    let [noticiasPorPagina, totalPaginas] = await getNewsPerPage({page:page, pageSize: 10, category: category})
    let categoriaLowerCased = category.toLowerCase()
    let coverNews = await getNoticiasEnTapaID(categoriaLowerCased)
    setNews(noticiasPorPagina)
    setSelectedNews(coverNews)
    setPaginasTotales(totalPaginas)
  }

  // FetchNews
  useEffect(() => {
    fetchNews()
  }, [page])

  const handleSelect = (id) => {
    setSelectedNews(prev => 
      prev.includes(id) ? prev.filter(newsId => newsId !== id) : [...prev, id]
    );
  };

  function arraysSonIguales(arr1, arr2) {
    if (arr1?.length !== arr2?.length) return false;

    // Ordenamos y comparamos cada elemento
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();

    return sorted1.every((val, index) => val === sorted2[index]);
  }

  const handleAddNews = () => {
    onOpenChange(false)
    if(selectedNews?.length > 3){
      Swal.fire({
        icon: "warning",
        title: "Seleccione 3 noticias",
        text: "Superó el maximo de noticias seleccionadas"
      })
      return
    }

    const postNoticiasEnTapa = async () =>{
      let noticiasEnTapaActual = await getNoticiasEnTapaID(category.toLowerCase())
      if(arraysSonIguales(noticiasEnTapaActual, selectedNews)){
        Swal.fire({
          icon: "warning",
          title: "Seleccione noticias nuevas!",
          text: "Las noticias seleccionadas ya son las destacadas"
        })
        return
      }
      Swal.fire({
        title: "Configurando nuevas noticias en tapa",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      try{
        await setTapaPorCategoria(category.toLowerCase(), selectedNews)
        Swal.close()
        Swal.fire({
          icon: "success",
          title: "Noticias en tapa actualizadas con exito",
          text: `Noticias ${category.toLowerCase()} actualizadas`
        }).then(() => {
          window.location.reload()
        })
      }catch(error){
        Swal.fire({
          icon: "error",
          title: "Error actualizando noticias en tapa",
          text: error
        })
      }
    }
    
    postNoticiasEnTapa()
  };

  const handleBuscarNoticia = (e) => {
    e.preventDefault()

  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[605px]">
        <DialogHeader>
          <DialogTitle>Cambiar noticias de tapa - {category}</DialogTitle>
          <DialogDescription>
            Selecciona 3 noticias principales
          </DialogDescription>
          <form onSubmit={handleBuscarNoticia} className="relative mt-4 flex gap-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input required placeholder="Buscar por título..." className="pl-8" />
            <Button className='h-full w-[300px]' >Buscar Noticia</Button>
          </form>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {
            loadingNews ? 
            <p className='mt-2'>Cargando noticias...</p>
            :
            news?.length > 0 ?
              news.map(noticia => (
                <div key={noticia.id} className="flex items-center gap-4 p-2 rounded-lg border">
                  <Checkbox
                    id={`news-${noticia.id}`}
                    checked={selectedNews.includes(noticia.id)}
                    onCheckedChange={() => handleSelect(noticia.id)}
                  />
                  <label htmlFor={`news-${noticia.id}`} className="flex items-center gap-4 cursor-pointer flex-1">
                    <img src={noticia.imgURL} alt={noticia.titulo} className="w-20 h-14 object-cover rounded-md bg-gray-200" />
                    <span className="text-sm font-medium">{noticia.titulo}</span>
                  </label>
                </div>
              ))
              :
              <p>No se encontraron noticias para esta categoria</p>
            }
          </div>
          
        </ScrollArea>
        <DialogFooter>
          <div className='w-full flex flex-col justify-center items-center gap-2'>
            <div className={`flex justify-center w-full border-b-2  p-2 ${paginasTotales < 2 ? 'hidden' : ''}`}>
              <Button 
                variant="outline"
                onClick={() => {setPage(page - 1)}}
                disabled={page == 0}
                >Página Anterior</Button>
              <span className="self-center mx-4 text-sm">Página {page + 1} de {paginasTotales}</span>
              <Button 
                variant="outline"
                onClick={() => {setPage(page + 1)}}
                disabled={page == paginasTotales}
                >Página Siguiente</Button>
            </div>
            <div className='flex gap-2'>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={() => setSelectedNews([])} disabled={selectedNews?.length == 0}>Limpiar Selección</Button>
              <Button onClick={handleAddNews} disabled={selectedNews?.length === 0}>
                Agregar {selectedNews?.length > 0 ? `(${selectedNews?.length})` : ''}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;