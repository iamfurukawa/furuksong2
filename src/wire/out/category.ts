export interface CategoryResponse {
  id: string;
  label: string;
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
}
