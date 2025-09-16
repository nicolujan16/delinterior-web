import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const AdminLive = () => {
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(false);

  const handleLiveToggle = (checked) => {
    setIsLive(checked);
    toast({
      title: `Transmisión ${checked ? "activada" : "desactivada"}`,
      description: `El estado visual de "En Vivo" ha sido actualizado.`,
    });
  };

  const handleUpdateLink = (e) => {
    e.preventDefault();
    toast({
      title: "Enlace actualizado (simulado)",
      description: "El enlace de la transmisión ha sido guardado.",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gestión de Transmisión en Vivo</CardTitle>
        <CardDescription>Controla el estado y el enlace de la transmisión en vivo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="text-lg font-semibold">Previsualización</Label>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 aspect-video bg-black rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden"
          >
            <Radio className="w-16 h-16 text-gray-700" />
            <p className="mt-4 text-lg font-semibold text-gray-500">Mañanas de Mierda</p>
            <p className="text-sm text-gray-600">La previsualización del streaming aparecerá aquí.</p>
            {isLive && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                <Radio className="w-4 h-4" />
                <span>EN VIVO</span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="live-toggle" className="text-lg font-semibold">
            Activar Transmisión "En Vivo"
          </Label>
          <Switch id="live-toggle" checked={isLive} onCheckedChange={handleLiveToggle} />
        </div>

        <form onSubmit={handleUpdateLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stream-link" className="text-lg font-semibold">
              Enlace del Streaming
            </Label>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-gray-500" />
              <Input id="stream-link" type="url" placeholder="https://youtube.com/live/..." />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Actualizar Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLive;