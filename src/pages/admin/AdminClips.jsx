import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AddClipModal from '@/components/admin/AddClipModal';

const mockClips = [
  { id: 1, title: "Entrevista exclusiva con el gobernador", duration: "02:35", thumbnail: "https://images.unsplash.com/photo-1505238680356-667803448bb6?w=500" },
  { id: 2, title: "Resumen del partido del fin de semana", duration: "01:15", thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500" },
  { id: 3, title: "Adelanto del festival de música", duration: "00:45", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500" },
  { id: 4, title: "Nuevas obras en la ciudad", duration: "01:50", thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500" },
  { id: 5, title: "Debate político en la legislatura", duration: "05:10", thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500" },
  { id: 6, title: "Recetas de cocina regional", duration: "03:00", thumbnail: "https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=500" },
];

const ClipCard = ({ clip, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="relative group overflow-hidden rounded-xl shadow-lg"
  >
    <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover aspect-[9/16] transition-transform duration-300 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => onEdit(clip)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => onDelete(clip)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <PlayCircle className="w-8 h-8 mb-2" />
        <p className="font-bold text-sm line-clamp-2">{clip.title}</p>
        <p className="text-xs text-gray-300">{clip.duration}</p>
      </div>
    </div>
  </motion.div>
);

const AdminClips = () => {
  const { toast } = useToast();
  const [deleteModalState, setDeleteModalState] = useState({ open: false, item: null });
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleEdit = (clip) => {
    toast({
      title: "🚧 Editar Título (no implementado)",
      description: `Se intentó editar el clip: "${clip.title}"`,
    });
  };

  const openDeleteModal = (clip) => {
    setDeleteModalState({ open: true, item: clip });
  };

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

  return (
    <>
      <ConfirmationModal
        open={deleteModalState.open}
        onOpenChange={(open) => setDeleteModalState({ ...deleteModalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente el recorte: "${deleteModalState.item?.title}"`}
      />
      <AddClipModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recortes</CardTitle>
              <CardDescription>Gestiona los recortes de video para redes sociales.</CardDescription>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Recorte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mockClips.map(clip => (
              <ClipCard key={clip.id} clip={clip} onEdit={handleEdit} onDelete={openDeleteModal} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminClips;