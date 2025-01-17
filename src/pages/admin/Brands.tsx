import { useState } from 'react';
import { useGlobalStore } from '@/stores/globalStore';
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
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

export default function Brands() {
  const { brands, addBrand, updateBrand, deleteBrand } = useGlobalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    active: true
  });
  const { toast } = useToast();

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrand = () => {
    try {
      addBrand(newBrand);
      setIsAddDialogOpen(false);
      setNewBrand({
        name: '',
        description: '',
        active: true
      });
      toast({
        title: "Marque ajoutée",
        description: "La marque a été ajoutée avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la marque"
      });
    }
  };

  const handleEditBrand = () => {
    if (editingBrand) {
      try {
        updateBrand(editingBrand.id, editingBrand);
        setIsEditDialogOpen(false);
        setEditingBrand(null);
        toast({
          title: "Marque mise à jour",
          description: "La marque a été mise à jour avec succès"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la marque"
        });
      }
    }
  };

  const handleDeleteBrand = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
      try {
        deleteBrand(id);
        toast({
          title: "Marque supprimée",
          description: "La marque a été supprimée avec succès"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer la marque"
        });
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Marques</h1>
          <p className="text-muted-foreground">
            Gérez les marques de parfums
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une marque
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une marque..."
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
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>{brand.description || '-'}</TableCell>
                <TableCell>
                  <Badge variant={brand.active ? 'default' : 'secondary'}>
                    {brand.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingBrand(brand);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Brand Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une marque</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBrand.description}
                onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newBrand.active}
                onCheckedChange={(checked) => setNewBrand({ ...newBrand, active: checked })}
              />
              <Label>Marque active</Label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBrand}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingBrand && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la marque</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand({
                    ...editingBrand,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBrand.description}
                  onChange={(e) => setEditingBrand({
                    ...editingBrand,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingBrand.active}
                  onCheckedChange={(checked) => setEditingBrand({
                    ...editingBrand,
                    active: checked
                  })}
                />
                <Label>Marque active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditBrand}>Enregistrer</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}