import { useEffect } from 'react';
import { socketManager } from '@/lib/socket/manager';
import { useToast } from '@/components/ui/use-toast';

export function useSocketInit() {
  const { toast } = useToast();

  useEffect(() => {
    // Connexion initiale
    socketManager.connect();

    // Gestion des événements de connexion
    const cleanup = socketManager.on('connect', () => {
      console.log('Socket connected');
      toast({
        title: "Connecté",
        description: "Connexion au serveur établie"
      });
    });

    // Nettoyage lors du démontage
    return () => {
      cleanup();
      socketManager.disconnect();
    };
  }, []);

  return socketManager;
}
