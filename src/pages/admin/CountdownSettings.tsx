import { useState, useEffect } from 'react';
import { useCountdown } from '@/contexts/CountdownContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { formatDate, formatDateForInput, validateDate } from '@/lib/utils/date';

export default function CountdownSettings() {
  const { settings, updateSettings, isLoading } = useCountdown();
  
  const [formData, setFormData] = useState({
    isEnabled: settings.isEnabled,
    endDate: formatDateForInput(settings.endDate),
    title: settings.title,
    description: settings.description
  });

  useEffect(() => {
    setFormData({
      isEnabled: settings.isEnabled,
      endDate: formatDateForInput(settings.endDate),
      title: settings.title,
      description: settings.description
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateDate(formData.endDate)) {
        throw new Error('La date de fin doit être supérieure à la date actuelle');
      }

      await updateSettings({
        ...formData,
        endDate: new Date(formData.endDate).toISOString()
      });
    } catch (error) {
      console.error('Error updating countdown:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Compte à rebours</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres du compte à rebours
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="isEnabled">Activer le compte à rebours</Label>
              <Switch
                id="isEnabled"
                checked={formData.isEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEnabled: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex: Vente Flash"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="ex: Profitez de nos offres exceptionnelles"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Aperçu</h2>
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className="h-5 w-5" />
              <h3 className="text-xl font-bold">{formData.title}</h3>
            </div>
            <p className="text-sm text-center mb-4">{formData.description}</p>
            {formData.isEnabled && (
              <CountdownTimer 
                endDate={new Date(formData.endDate).toISOString()}
                isActive={formData.isEnabled} 
              />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Le compte à rebours se terminera le {formatDate(formData.endDate)}
          </p>
        </Card>
      </div>
    </div>
  );
}