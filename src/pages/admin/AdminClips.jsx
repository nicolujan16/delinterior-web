import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AddClipModal from '@/components/admin/AddClipModal';
import { TikTokEmbed } from 'react-social-media-embed';
import { useAdminNews } from '../../context/AdminNewsContext';
import Swal from 'sweetalert2';

const AdminClips = () => {
  const { toast } = useToast();
  const [deleteModalState, setDeleteModalState] = useState({ open: false, item: null });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { getTikToksLinks, addTikTok, deleteTikTok } = useAdminNews()
  const [tiktoks, setTiktoks] = useState([])

  // obtener link de tiktoks
  useEffect(() => {
    const fetchTikToks = async () => {
      try{
        let tiktoks = await getTikToksLinks()
        setTiktoks(tiktoks)
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error obteniendo tiktoks",
          text: err
        })
      }
    }
    fetchTikToks()
  },[])

  const confirmDelete = () => {
    if (deleteModalState.item) {
      toast({
        title: "Recorte eliminado (simulado)",
        description: `El recorte "${deleteModalState.item.title}" ha sido eliminado.`,
        action: <Button variant="secondary" size="sm" onClick={() => toast({ title: "Acción Deshacer (simulado)" })}>Deshacer</Button>,
      });
    }
    setDeleteModalState({ open: false, item: null });
  };

  const handleDelete = (tiktok) => {
    Swal.fire({
      icon: "question",
      title: "Eliminar Clip?",
      text: "Esta acción es irreversible",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (e) => {
      if(e.isConfirmed){
        try{
          await deleteTikTok(tiktok)
          Swal.fire({
            icon: "success",
            title: "Recorte eliminado!"
          }).then(() => {
            window.location.reload()
          }) 
        }catch(err){
          Swal.fire({
            icon: "error",
            title: "Error eliminando recorte",
            text: err
          })
        }
      }
    })

  } 

  return (
    <>
      <ConfirmationModal
        open={deleteModalState.open}
        onOpenChange={(open) => setDeleteModalState({ ...deleteModalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente el recorte: "${deleteModalState.item?.title}"`}
      />
      <AddClipModal open={addModalOpen} onOpenChange={setAddModalOpen} addTikTok={addTikTok} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recortes</CardTitle>
              <CardDescription>
                {
                  tiktoks.length > 0 ?
                    'Gestiona los recortes de video para redes sociales.'
                  :
                    'No hay recortes actualmente, añadelos!'
                }
                  
              </CardDescription>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Recorte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tiktoks?.map((ttk, i) => (
              <div className='p-2 border-2 border-dashed rounded relative'>
                <div className='cursor-pointer absolute -top-3 -right-3 bg-white' onClick={() => handleDelete(ttk)} >
                  <Trash2></Trash2>                
                </div>
                <TikTokEmbed key={i} url={ttk}/>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminClips;