import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from 'sweetalert2';

const AddClipModal = ({ open, onOpenChange, addTikTok }) => {
  const [tiktokInput, setTiktokInput] = useState()

  const handleUpload = async (e) => {
    e.preventDefault();
    try{
      await addTikTok(tiktokInput)
      Swal.fire({
        icon: "success",
        title: "Recorte subido exitosamente"
      }).then(() => {
        window.location.reload()
      })
      onOpenChange(false);
    }catch(err){
      Swal.fire({
        icon:"error",
        title: "Error subiendo el recorte",
        text: err
      })
    }

    
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Recorte</DialogTitle>
          <DialogDescription>
            Pega el enlace de un video de TikTok para subirlo como recorte.
          </DialogDescription>
        </DialogHeader>
        <form id="add-clip-form" onSubmit={handleUpload} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tiktok-link" className="text-right">
              Enlace
            </Label>
            <Input
              id="tiktok-link"
              placeholder="https://www.tiktok.com/@mañanasdemierda/video/..."
              className="col-span-3"
              value={tiktokInput}
              onChange={(e) => {setTiktokInput(e.target.value)}}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="add-clip-form">Subir Recorte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClipModal;