import type { CategoryModel } from "../models/category.js";
import type { Category } from "../models/db/sound.interface.js";
import type { CategoryRequest } from "../wire/in/category.js";
import type { CategoryResponse, CategoryListResponse } from "../wire/out/category.js";

class CategoryAdapter {
  static toWireOut(category: Category): CategoryResponse {
    return { id: category.id, label: category.label };
  }

  static toWireOutList(categories: Category[]): CategoryListResponse {
    return { categories: categories.map(category => this.toWireOut(category)) };
  }

  static toModel(category: CategoryRequest): CategoryModel {
    return { label: category.label };
  }
}

export default CategoryAdapter;
