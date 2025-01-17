import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { perfumes } from '@/data/perfumes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Promotion {
  id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'ended';
  productsCount: number;
  products: string[];
}

const initialPromotions = [
  {
    id: '1',
    name: 'Soldes d\'été',
    discount: 20,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'scheduled',
    productsCount: 15,
    products: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Black Friday',
    discount: 30,
    startDate: '2024-11-29',
    endDate: '2024-11-30',
    status: 'scheduled',
    productsCount: 25,
    products: ['4', '5', '6']
  },
  {
    id: '3',
    name: 'Promotion de printemps',
    discount: 15,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
    productsCount: 10,
    products: ['7', '8']
  }
] as Promotion[];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  ended: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  active: 'En cours',
  scheduled: 'Programmée',
  ended: 'Terminée'
};

export default function AdminPromotions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    name: '',
    discount: 0,
    startDate: '',
    endDate: '',
    products: []
  });

  const filteredPromotions = promotions.filter(promotion =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.discount && newPromotion.startDate && newPromotion.endDate) {
      const promotion = {
        id: (promotions.length + 1).toString(),
        status: 'scheduled' as const,
        productsCount: newPromotion.products?.length || 0,
        ...newPromotion
      } as Promotion;
      setPromotions([...promotions, promotion]);
      setNewPromotion({
        name: '',
        discount: 0,
        startDate: '',
        endDate: '',
        products: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditPromotion = () => {
    if (editingPromotion) {
      setPromotions(promotions.map(promo => 
        promo.id === editingPromotion.id ? {
          ...editingPromotion,
          productsCount: editingPromotion.products.length
        } : promo
      ));
      setEditingPromotion(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">
              Gérez vos offres promotionnelles
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer une promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une promotion</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Réduction (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="products">Produits</Label>
                  <Select
                    value={newPromotion.products?.join(',')}
                    onValueChange={(value) => setNewPromotion({
                      ...newPromotion,
                      products: value.split(',').filter(Boolean)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les produits" />
                    </SelectTrigger>
                    <SelectContent>
                      {perfumes.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleAddPromotion}
                disabled={!newPromotion.name || !newPromotion.discount || !newPromotion.startDate || !newPromotion.endDate}
              >
                Créer
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une promotion..."
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
                <TableHead>Nom</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="font-medium">{promotion.name}</TableCell>
                  <TableCell>{promotion.discount}%</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Début: {new Date(promotion.startDate).toLocaleDateString()}</div>
                      <div>Fin: {new Date(promotion.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{promotion.productsCount} produits</TableCell>
                  <TableCell>
                    <Badge 
                      className={statusColors[promotion.status]}
                      variant="secondary"
                    >
                      {statusLabels[promotion.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingPromotion(promotion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {editingPromotion && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Modifier la promotion</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Nom</Label>
                              <Input
                                id="edit-name"
                                value={editingPromotion.name}
                                onChange={(e) => setEditingPromotion({
                                  ...editingPromotion,
                                  name: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-discount">Réduction (%)</Label>
                              <Input
                                id="edit-discount"
                                type="number"
                                value={editingPromotion.discount}
                                onChange={(e) => setEditingPromotion({
                                  ...editingPromotion,
                                  discount: Number(e.target.value)
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-startDate">Date de début</Label>
                              <Input
                                id="edit-startDate"
                                type="date"
                                value={editingPromotion.startDate}
                                onChange={(e) => setEditingPromotion({
                                  ...editingPromotion,
                                  startDate: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-endDate">Date de fin</Label>
                              <Input
                                id="edit-endDate"
                                type="date"
                                value={editingPromotion.endDate}
                                onChange={(e) => setEditingPromotion({
                                  ...editingPromotion,
                                  endDate: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="edit-products">Produits</Label>
                              <Select
                                value={editingPromotion.products.join(',')}
                                onValueChange={(value) => setEditingPromotion({
                                  ...editingPromotion,
                                  products: value.split(',').filter(Boolean)
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner les produits" />
                                </SelectTrigger>
                                <SelectContent>
                                  {perfumes.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name} - {product.brand}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            onClick={handleEditPromotion}
                            disabled={!editingPromotion.name || !editingPromotion.discount || !editingPromotion.startDate || !editingPromotion.endDate}
                          >
                             Enregistrer
                          </Button>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600"
                      onClick={() => handleDeletePromotion(promotion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}