export interface Brand {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminState {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminContextType extends AdminState {
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
}