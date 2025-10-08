import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Edit  } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AddNewsModal from '@/components/admin/AddNewsModal';
import FeaturedNews from '../../components/features/NewsSlider';
import OrdenarListaModal from '../../components/admin/OrdenarListaModal';
import { useAdminNews } from '../../context/AdminNewsContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminCoverNews = () => {
  const { toast } = useToast();
  const [modalState, setModalState] = useState({ open: false, item: null });
  const { getCategorias } = useAdminNews()
  const navigate = useNavigate()

  // Estados para guardar categorias
  const [categorias, setCategorias] = useState([])
  const [currentCategory, setCurrentCategory] = useState('Principales')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [ordenarListaModal, setOrdenarListaModal] = useState(false)


  // ObtenerCategorias
  useEffect(() => {
    const fetchCategories = async () => {
      try{
        let gettedCategories = await getCategorias()
        setCategorias(gettedCategories)
      }catch (error){
        Swal.fire({
          icon: "error",
          title: "Error obteniendo categorias",
          text: error
        })
        navigate('/admin')
      } 
    }
    fetchCategories()
  },[])

  const handleAction = (action, title = '') => {
    toast({
      title: `🚧 Funcionalidad no implementada`,
      description: `La acción de "${action}" ${title ? `en '${title}'` : ''} no está disponible.`,
    });
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
    <>
      <ConfirmationModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente la noticia: "${modalState.item?.title}"`}
      />

      {/* Modal global para "Cambiar noticias en portada" */}
      <AddNewsModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} category={currentCategory} />
      {
       <OrdenarListaModal open={ordenarListaModal} onOpenChange={setOrdenarListaModal} category={currentCategory}/>
      }

      <Card>
        <CardHeader>
          <CardTitle>Noticias en Tapa</CardTitle>
          <CardDescription>Gestiona las noticias que aparecen en las diferentes secciones de la portada.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* controlamos la pestaña activa con value y onValueChange */}
          <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="w-full flex flex-col justify-center items-center">
            <TabsList className="grid w-full h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {categorias.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
            </TabsList>

            <div className='w-[100%] p-4 h-fit flex flex-col gap-2'>
              <div className='w-full flex gap-6 flex-col md:flex-row'>
                {/* al click setea el estado para abrir el modal */}
                <Button className="flex justify-center items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                  <Edit />
                  Cambiar noticias en portada
                </Button>
                <Button className="flex justify-center items-center gap-2" onClick={() => setOrdenarListaModal(true)}>
                  <Edit />
                  Cambiar orden de noticias
                </Button>
              </div>
              <p className='underline'>Vista Previa:</p>
              <div className='border-2 border-dashed p-8'>
                <FeaturedNews categoria={currentCategory} isEditable={true}></FeaturedNews>
              </div>

            </div>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminCoverNews;
