import { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useGlobalStore } from '@/stores/globalStore';

interface CountdownState {
  isEnabled: boolean;
  endDate: string;
  title: string;
  description: string;
}

interface CountdownContextType {
  settings: CountdownState;
  updateSettings: (settings: CountdownState) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export function CountdownProvider({ children }: { children: React.ReactNode }) {
  const countdown = useGlobalStore(state => state.countdown);
  const updateCountdown = useGlobalStore(state => state.updateCountdown);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateSettings = async (newSettings: CountdownState): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const endDate = new Date(newSettings.endDate);
      if (isNaN(endDate.getTime())) {
        throw new Error('Date de fin invalide');
      }

      updateCountdown(newSettings);

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres du compte à rebours ont été mis à jour"
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour des paramètres"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CountdownContext.Provider value={{ 
      settings: countdown,
      updateSettings,
      isLoading,
      error
    }}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
}