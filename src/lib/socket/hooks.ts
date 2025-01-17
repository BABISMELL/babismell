import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { socketManager } from './manager';

export function useSocket() {
  const { toast } = useToast();

  useEffect(() => {
    const handleConnect = () => {
      toast({
        title: "Connecté",
        description: "Connexion au serveur établie"
      });
    };

    const handleError = (error: Error) => {
      console.error('Socket error:', error);
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
    };

    const cleanupConnect = socketManager.on('connect', handleConnect);
    const cleanupError = socketManager.on('connect_error', handleError);
    const cleanupDisconnect = socketManager.on('disconnect', handleDisconnect);

    return () => {
      cleanupConnect();
      cleanupError();
      cleanupDisconnect();
    };
  }, [toast]);

  return {
    isConnected: socketManager.isConnected(),
    connect: () => socketManager.connect(),
    disconnect: () => socketManager.disconnect()
  };
}