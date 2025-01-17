import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/stores/globalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { useOrder } from '@/contexts/OrderContext';
import { Loader2 } from 'lucide-react';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const statusLabels = {
  PENDING: 'En attente',
  PROCESSING: 'En préparation',
  SHIPPING: 'En livraison',
  COMPLETED: 'Livrée',
  CANCELLED: 'Annulée'
};

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { orders, isLoading, error } = useGlobalStore(state => ({
    orders: state.orders,
    isLoading: state.isLoading,
    error: state.error
  }));
  const { updateOrderStatus } = useOrder();
  const { toast } = useToast();

  useEffect(() => {
    // Initialiser le socket lors du montage du composant
    useGlobalStore.getState().initializeSocket();
  }, []);

  const filteredOrders = orders?.filter(order =>
    order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(order.id).includes(searchTerm)
  ) || [];

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      toast({
        title: "Mise à jour en cours",
        description: "Veuillez patienter..."
      });
      
      await updateOrderStatus(orderId, newStatus);
      
      toast({
        title: "Succès",
        description: "Le statut de la commande a été mis à jour avec succès",
        variant: "default"
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande. Veuillez réessayer."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des commandes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur de chargement
              </h3>
              <p className="text-sm text-red-700 mt-2">
                {error}
              </p>
              <Button
                className="mt-3"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez les commandes de vos clients
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune commande trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <p className="text-muted-foreground">
          Gérez les commandes de vos clients
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{String(order.id).padStart(4, '0')}</TableCell>
                <TableCell>{order.shippingAddress.fullName}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'Pp', { locale: fr })}
                </TableCell>
                <TableCell>{order.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails de la commande #{String(selectedOrder.id).padStart(4, '0')}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Informations client</h3>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zone}</p>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Informations livraison</h3>
                  <p>{selectedOrder.shipping.method}</p>
                  <p>Délai estimé: {selectedOrder.shipping.estimatedDelivery}</p>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Articles commandés</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.price.toFixed(2)} €</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-semibold">
                        Frais de livraison
                      </TableCell>
                      <TableCell className="text-right">
                        {selectedOrder.deliveryFee.toFixed(2)} €
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-semibold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {selectedOrder.total.toFixed(2)} €
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Statut de la commande</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="PROCESSING">En préparation</SelectItem>
                    <SelectItem value="SHIPPING">En livraison</SelectItem>
                    <SelectItem value="COMPLETED">Livrée</SelectItem>
                    <SelectItem value="CANCELLED">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}