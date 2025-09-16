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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { localNews, politicalNews, provincialNews, nationalNews } from '@/data/news';

const allNews = [...localNews, ...politicalNews, ...provincialNews, ...nationalNews];

const AddNewsModal = ({ open, onOpenChange, category }) => {
  const { toast } = useToast();
  const [selectedNews, setSelectedNews] = useState([]);

  const handleSelect = (id) => {
    setSelectedNews(prev => 
      prev.includes(id) ? prev.filter(newsId => newsId !== id) : [...prev, id]
    );
  };

  const handleAddNews = () => {
    toast({
      title: "Noticias agregadas (simulado)",
      description: `${selectedNews.length} noticias han sido añadidas a la sección.`,
    });
    setSelectedNews([]);
    onOpenChange(false);
  };

  const newsForCategory = allNews.filter(news => news.category === category || category === 'principales');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Agregar Noticia a la Tapa</DialogTitle>
          <DialogDescription>
            Selecciona una o varias noticias para agregar a esta sección.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {newsForCategory.map(news => (
              <div key={news.id} className="flex items-center gap-4 p-2 rounded-lg border">
                <Checkbox
                  id={`news-${news.id}`}
                  checked={selectedNews.includes(news.id)}
                  onCheckedChange={() => handleSelect(news.id)}
                />
                <label htmlFor={`news-${news.id}`} className="flex items-center gap-4 cursor-pointer flex-1">
                  <img src={news.image} alt={news.title} className="w-20 h-14 object-cover rounded-md bg-gray-200" />
                  <span className="text-sm font-medium">{news.title}</span>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAddNews} disabled={selectedNews.length === 0}>
            Agregar {selectedNews.length > 0 ? `(${selectedNews.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;