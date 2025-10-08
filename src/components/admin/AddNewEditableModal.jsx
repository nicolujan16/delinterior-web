import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useAdminNews } from "../../context/AdminNewsContext";
import Swal from "sweetalert2";

const AddNewEditableModal = ({ open, onOpenChange, editable, handleEditableAdded }) => {
  const [categoryName, setCategoryName] = useState('')
  const [sponsorForm, setSponsorForm] = useState({
    marca: '',
    imgURL: '',
    linkTo: ''
  })
  const [imgPreview, setImgPreview] = useState(null);      // URL temporal para mostrar preview
  const [imgFileTemp, setImgFileTemp] = useState(null); 
  const { uploadFileAndGetURL } = useAdminNews()

  // imgPreview
  useEffect(() => {
    if (!open) {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
        setImgPreview(null);
      }
      setImgFileTemp(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  
  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

    // revocamos preview anterior
    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview(null);
    }
    if (!file) {
      setImgFileTemp(null);
      return;
    }
    // validaciones opcionales (descomenta si querés)
    const allowed = ['image/png','image/jpeg','image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { alert('Formato no permitido - solo .jpg, .png, .webp'); e.target.value = ''; return; }

    const previewURL = URL.createObjectURL(file);
    setImgPreview(previewURL);
    setImgFileTemp(file);

  };

  const handleInputChange = (e) => {
    if(editable == 'Categoria'){
      setCategoryName(e.target.value)
      return
    }

    setSponsorForm({
      ...sponsorForm,
      [e.target.id]: e.target.value
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(editable == 'Categoria'){
      handleEditableAdded(categoryName)
      return
    }
    if(editable == 'Auspiciantes'){
      try{
        onOpenChange(false)
        Swal.fire({
          title: 'Subiendo sponsor...',
          text: 'Por favor esperá unos segundos',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        let imgURL = await uploadFileAndGetURL(imgFileTemp)
        handleEditableAdded({
          ...sponsorForm,
          imgURL: imgURL
        })
        Swal.close()
        Swal.fire({
          icon: "success",
          title: "Auspiciante agregado",
          text: `${sponsorForm.marca} agregado correctamente`
        }).then(() => {
          window.location.reload() 
        })
                
        return
      }catch(err){
        Swal.close()
        Swal.fire({
          icon: "error",
          title: "Error subiendo archivo",
          text: err
        })
      }
    }
  } 
  
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[605px]">
        <DialogHeader>
          <DialogTitle>Agregar elemento - {editable}</DialogTitle>
          <DialogDescription>Sera subido a la base de datos instantaneamente</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-fit pr-4">
          {
            editable == 'Categoria' ? 
              <form onSubmit={handleSubmit} id="categoryForm" className="flex flex-col gap-2 justify-center items-center p-1">
                <label htmlFor="nombreEditable">Nombre de la categoria</label>
                <Input required placeholder={editable} id='nombreEditable' value={categoryName} onChange={handleInputChange}></Input>
              </form>
            :
              <form onSubmit={handleSubmit} id="auspicianteForm" className="flex flex-col gap-2 justify-center items-center p-1">
                <label htmlFor="marca">Nombre del auspiciante</label>
                <Input required={true} placeholder='Ajalar' id='marca' value={sponsorForm.marca} onChange={handleInputChange}></Input>
                <label htmlFor="imgURL">Imagen del auspiciante</label>
                <Input 
                  required
                  type="file"
                  id="imgURL"
                  accept="image/*"
                  onChange={handleFileSelect}  
                ></Input>
                {imgPreview && (
                  <div className="mt-2">
                    <img
                      src={imgPreview}
                      alt="preview"
                      style={{ maxWidth: 200, maxHeight: 120, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </div>
                )}

                <label htmlFor="linkTo">Link del auspiciante - Opcional</label>
                <Input placeholder='www.ajalar.com.ar' id='linkTo' value={sponsorForm.linkTo} onChange={handleInputChange}></Input>
              </form>
            
          }
        </ScrollArea>
        <DialogFooter>
          <div className='w-full flex flex-col justify-center items-center gap-2'>
            <div className='flex gap-2'>
              {
                editable == 'Categoria' ?
                <Button type='submit' form='categoryForm'>Agregar categoria</Button>
                :
                <Button type='submit' form='auspicianteForm'>Agregar auspiciante</Button>
              }
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEditableModal;