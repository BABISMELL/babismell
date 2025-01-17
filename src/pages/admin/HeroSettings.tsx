import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MediaUpload } from '@/components/MediaUpload';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Plus, Trash2, Play, Pause } from 'lucide-react';
import { HeroSlide } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const DEFAULT_SLIDE: Omit<HeroSlide, 'id'> = {
  title: '',
  description: '',
  mediaType: 'image',
  mediaUrl: '',
  thumbnailUrl: '',
  buttonText: 'Découvrir',
  buttonLink: '/parfums',
  order: 0,
  active: true
};

export default function HeroSettings() {
  const { heroSlides, updateHeroSlides } = useAdmin();
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides);
  const [autoplay, setAutoplay] = useState(true);
  const { toast } = useToast();

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      ...DEFAULT_SLIDE,
      id: Date.now().toString(),
      order: slides.length
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const handleUpdateSlide = (id: string, field: keyof HeroSlide, value: any) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const handleMediaChange = (id: string, url: string, type: 'image' | 'video', thumbnailUrl?: string) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { 
        ...slide, 
        mediaType: type, 
        mediaUrl: url,
        thumbnailUrl: thumbnailUrl || slide.thumbnailUrl 
      } : slide
    ));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedSlides = items.map((slide, index) => ({
      ...slide,
      order: index
    }));

    setSlides(reorderedSlides);
  };

  const handleSave = async () => {
    try {
      await updateHeroSlides(slides);
      toast({
        title: "Succès",
        description: "Les slides ont été mises à jour avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les slides"
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Section Hero</h1>
          <p className="text-muted-foreground">
            Gérez les slides de la section hero de la page d'accueil
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleAddSlide}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une slide
          </Button>
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
              <Label>Lecture automatique</Label>
            </div>
            {autoplay ? (
              <Play className="h-4 w-4 text-green-600" />
            ) : (
              <Pause className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-6"
                    >
                      <Card className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div {...provided.dragHandleProps}>
                            <Grip className="h-5 w-5 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Slide {index + 1}</h3>
                          <div className="ml-auto flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={slide.active}
                                onCheckedChange={(checked) => 
                                  handleUpdateSlide(slide.id, 'active', checked)
                                }
                              />
                              <Label>Active</Label>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveSlide(slide.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <Label className="block mb-2">Média</Label>
                            <MediaUpload
                              value={slide.mediaUrl}
                              mediaType={slide.mediaType}
                              thumbnailUrl={slide.thumbnailUrl}
                              onChange={(url, type, thumbnailUrl) => 
                                handleMediaChange(slide.id, url, type, thumbnailUrl)
                              }
                              onTypeChange={(type) =>
                                handleUpdateSlide(slide.id, 'mediaType', type)
                              }
                            />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label>Titre</Label>
                              <Input
                                value={slide.title}
                                onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                                placeholder="Titre de la slide"
                              />
                            </div>

                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={slide.description}
                                onChange={(e) => handleUpdateSlide(slide.id, 'description', e.target.value)}
                                placeholder="Description de la slide"
                              />
                            </div>

                            <div>
                              <Label>Texte du bouton</Label>
                              <Input
                                value={slide.buttonText}
                                onChange={(e) => handleUpdateSlide(slide.id, 'buttonText', e.target.value)}
                                placeholder="Texte du bouton"
                              />
                            </div>

                            <div>
                              <Label>Lien du bouton</Label>
                              <Input
                                value={slide.buttonLink}
                                onChange={(e) => handleUpdateSlide(slide.id, 'buttonLink', e.target.value)}
                                placeholder="Lien du bouton"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}