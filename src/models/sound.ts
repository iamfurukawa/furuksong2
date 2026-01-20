export interface SoundModel {
  id: string | null;
  name: string;
  url: string;
  playCount: number;
  createdAt: number | null;
  categories: CategoryModel[];
}

export interface CategoryModel {
  id: string | null;
  label: string;
}
