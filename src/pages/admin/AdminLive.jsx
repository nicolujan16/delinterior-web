import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAdminNews } from '../../context/AdminNewsContext';
import Swal from 'sweetalert2';

const AdminLive = () => {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streamingLink, setStreamingLink] = useState('')
  const [streamingInput, setStreamingInput] = useState('')
  const { getLiveState, toggleLiveState, getStreamingLink, updateStreamingLink } = useAdminNews()

  // setIsLive
  useEffect(()=> {
    const fetchLiveState = async () => {
      try{
        let liveState = await getLiveState()
        setIsLive(liveState)
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error obteniendo estado del vivo",
          text: err
        })
      }
    }
    // FetchStreamingLink
    const fetchStreamingLink = async () => {
      try{
        let streamingURL = await getStreamingLink();
        setStreamingLink(streamingURL)
      }catch(err){
        Swal.fire({
          icon:"error",
          title: "Error obteniendo link de streaming"
        })
      }
    }
    fetchStreamingLink()
    fetchLiveState()
  },[])

  const handleLiveToggle = (checked) => {
    Swal.fire({
      icon:"question",
      title: "Cambiar estado del vivo?",
      text: `El vivo pasara a estar ${isLive ? 'apagado' : 'encendido'}`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then(async (e) => {
      if(e.isConfirmed){
        try{
          await toggleLiveState()
          setIsLive(checked);
        }catch(err){
          Swal.close()
          Swal.fire({
            icon: "error",
            title: "Error cambiando estado del vivo."
          })
        }
      }
    })
  };

  const handleUpdateLink = (e) => {
    e.preventDefault();
    console.log(streamingInput)
    if(streamingInput.trim() == '') return
    Swal.fire({
      icon: "question",
      title: "Cambiar link del directo?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then(async (e) => {
      if(e.isConfirmed){
        try{
          const idExtraida = new URL(streamingInput).searchParams.get("v");
          let URLFINAL = `https://www.youtube.com/embed/${idExtraida}`
          await updateStreamingLink(URLFINAL)
          setStreamingLink(URLFINAL)
          Swal.fire({
            icon: "success",
            title: "Link del streaming actualizado!"
          }).then(() => {
            window.location.reload()
          })
        }catch(err){
          Swal.close()
          Swal.fire({
            icon: "error",
            title: "Error cambiando link del vivo",
            text: err
          })
        }
      }
    })
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
          {
            streamingLink !== '' ?
            <div className='w-full aspect-video'>
              <iframe width={"100%"} height={"100%"} src={streamingLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            :
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
            }
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
              <Input 
                id="stream-link" 
                type="url" 
                placeholder="https://youtube.com/live/..." 
                value={streamingInput} 
                onChange={(e) => setStreamingInput(e.target.value)}
              />
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