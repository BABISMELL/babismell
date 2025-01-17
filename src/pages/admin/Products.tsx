import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from '@/components/ImageUpload';

const CATEGORIES = ['Pour Elle', 'Pour Lui', 'Unisexe'];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const brands = useGlobalStore(state => state.brands);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    isNew: false,
    isOnSale: false,
    discount: 0,
    stock: 0,
    isFeatured: false
  });

  const activeBrands = brands.filter(brand => brand.active).map(brand => ({
    id: brand.id,
    name: brand.name
  }));

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        brand: '',
        price: 0,
        category: '',
        description: '',
        image: '',
        isNew: false,
        isOnSale: false,
        discount: 0,
        stock: 0,
        isFeatured: false
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        await updateProduct(editingProduct.id, editingProduct);
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
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
              <TableHead>Marque</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString()} FCFA</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {product.isNew && <Badge>Nouveau</Badge>}
                    {product.isOnSale && <Badge variant="destructive">-{product.discount}%</Badge>}
                    {product.isFeatured && <Badge variant="secondary">En avant</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="brand">Marque</Label>
                <Select
                  value={newProduct.brand}
                  onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="image">Image du produit</Label>
              <ImageUpload
                value={newProduct.image}
                onChange={(url) => setNewProduct({ ...newProduct, image: url })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="discount">Réduction (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                  disabled={!newProduct.isOnSale}
                />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newProduct.isNew}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isNew: checked })}
                />
                <Label>Nouveau produit</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newProduct.isOnSale}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isOnSale: checked })}
                />
                <Label>En promotion</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newProduct.isFeatured}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isFeatured: checked })}
                />
                <Label>Mettre en avant</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddProduct}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingProduct && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nom</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brand">Marque</Label>
                  <Select
                    value={editingProduct?.brand || ''}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, brand: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Prix</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      price: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({
                      ...editingProduct,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image du produit</Label>
                <ImageUpload
                  value={editingProduct.image}
                  onChange={(url) => setEditingProduct({
                    ...editingProduct,
                    image: url
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      stock: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-discount">Réduction (%)</Label>
                  <Input
                    id="edit-discount"
                    type="number"
                    value={editingProduct.discount}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      discount: Number(e.target.value)
                    })}
                    disabled={!editingProduct.isOnSale}
                  />
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.isNew}
                    onCheckedChange={(checked) => setEditingProduct({
                      ...editingProduct,
                      isNew: checked
                    })}
                  />
                  <Label>Nouveau produit</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.isOnSale}
                    onCheckedChange={(checked) => setEditingProduct({
                      ...editingProduct,
                      isOnSale: checked
                    })}
                  />
                  <Label>En promotion</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.isFeatured}
                    onCheckedChange={(checked) => setEditingProduct({
                      ...editingProduct,
                      isFeatured: checked
                    })}
                  />
                  <Label>Mettre en avant</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditProduct}>Enregistrer</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}