export interface SoundWithCategories {
  id: string; // UUID
  name: string;
  url: string;
  playCount: number;
  createdAt: number; // timestamp Unix
  categories: Category[];
}

export interface Category {
  id: string; // UUID
  label: string;
}

export interface CategoryInsert {
  label: string;
}

export interface SoundInsert {
  name: string;
  url: string;
  categoryIds: string[]; // IDs das categorias
}
