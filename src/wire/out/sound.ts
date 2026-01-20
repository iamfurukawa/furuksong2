export interface SoundResponse {
  id: string;
  name: string;
  url: string;
  playCount: number;
  createdAt: number;
  categories: CategoryResponse[];
}

export interface CategoryResponse {
  id: string;
  label: string;
}

export interface SoundListResponse {
  sounds: SoundResponse[];
}
