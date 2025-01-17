import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Calendar, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrder } from '@/contexts/OrderContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const orderStatuses = {
  'PENDING': {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle
  },
  'PROCESSING': {
    label: 'En préparation',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock
  },
  'SHIPPING': {
    label: 'En livraison',
    color: 'bg-purple-100 text-purple-800',
    icon: Package
  },
  'COMPLETED': {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2
  }
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toString().includes(searchTerm) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      if (dateFilter === 'all') return matchesSearch && matchesStatus;

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return matchesSearch && matchesStatus && 
            orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return matchesSearch && matchesStatus && orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return matchesSearch && matchesStatus && orderDate >= monthAgo;
        default:
          return matchesSearch && matchesStatus;
      }
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Suivi des Commandes</h1>
          <p className="text-gray-600">Retrouvez et suivez toutes vos commandes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par N° de commande ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {Object.entries(orderStatuses).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les périodes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les périodes</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">7 derniers jours</SelectItem>
                      <SelectItem value="month">30 derniers jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            <motion.div
              key="orders-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredOrders.map((order) => {
                const StatusIcon = orderStatuses[order.status].icon;
                const orderNumber = String(order.id).padStart(4, '0');
                
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className={`p-2 rounded-full ${orderStatuses[order.status].color} hidden sm:block`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">Commande #{orderNumber}</h3>
                              <Badge className={orderStatuses[order.status].color}>
                                {orderStatuses[order.status].label}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(order.createdAt), 'PPp', { locale: fr })}
                              </div>
                              <div className="hidden sm:block text-gray-300">•</div>
                              <div>{order.items.length} article{order.items.length > 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">{order.total.toLocaleString()} FCFA</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => navigate(`/order-tracking/${orderNumber}`)}
                          >
                            Suivre
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Articles commandés</h4>
                            <div className="space-y-2">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-sm">Adresse de livraison</h4>
                            <div className="text-sm text-gray-600">
                              <p>{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.phone}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.zone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? "Aucune commande ne correspond à vos critères de recherche"
                  : "Vous n'avez pas encore passé de commande"}
              </p>
              <Button onClick={() => navigate('/parfums')}>
                Découvrir nos parfums
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}