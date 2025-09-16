import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { categories } from '@/data/news';

const MiniWysiwyg = ({ onAction }) => {
    const actions = [
      { icon: Bold, action: 'bold' },
      { icon: Italic, action: 'italic' },
      { icon: List, action: 'list' },
      { icon: LinkIcon, action: 'link' },
      { icon: ImageIcon, action: 'image' },
    ];
  
    return (
      <div className="flex items-center gap-1 rounded-t-md border border-b-0 p-2 bg-gray-50">
        {actions.map(({ icon: Icon, action }) => (
          <Button key={action} type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onAction(action)}>
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    );
};

const AdminNewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const [imagePreview, setImagePreview] = useState(null);

  const handleWysiwygAction = (action) => {
    toast({
        title: `Editor WYSIWYG`,
        description: `Acción "${action}" no implementada.`,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      toast({ title: "Imagen previsualizada." });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Noticia guardada con éxito",
      description: "La noticia ha sido creada/actualizada correctamente.",
      className: "bg-green-100 text-green-800 border-green-200",
    });
    navigate('/admin/noticias');
  };

  return (
    <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/admin/noticias')} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a Noticias
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Noticia' : 'Crear Nueva Noticia'}</CardTitle>
          <CardDescription>Completa los campos para {isEditing ? 'actualizar' : 'crear'} una noticia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" defaultValue={isEditing ? 'El gobierno anuncia nuevas medidas' : ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de Publicación</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="copete">Copete (bajada breve)</Label>
                <Input id="copete" defaultValue={isEditing ? 'Un resumen conciso de la noticia.' : ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Cuerpo</Label>
              <MiniWysiwyg onAction={handleWysiwygAction} />
              <textarea id="body" rows="10" className="w-full rounded-b-md border p-2 text-sm" placeholder="Escribe el cuerpo de la noticia aquí..." required></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <select id="category" className="w-full h-10 rounded-md border px-3 text-sm">
                        {categories.filter(c => c.id !== 'todas').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="active" defaultChecked />
                    <Label htmlFor="active" className="text-sm font-normal">Noticia activa</Label>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen Destacada</Label>
              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Vista previa:</p>
                  <img src={imagePreview} alt="Vista previa" className="w-full max-w-xs rounded-md border" />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                {isEditing ? 'Actualizar Noticia' : 'Guardar Noticia'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsForm;