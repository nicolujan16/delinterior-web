import React from 'react';
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
import { useToast } from "@/components/ui/use-toast";

const AddClipModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();

  const handleUpload = (e) => {
    e.preventDefault();
    toast({
      title: "Recorte subido (simulado)",
      description: "El recorte desde el enlace de TikTok se está procesando.",
    });
    onOpenChange(false);
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
              placeholder="https://www.tiktok.com/@user/video/..."
              className="col-span-3"
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