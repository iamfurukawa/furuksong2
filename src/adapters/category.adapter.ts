import type { CategoryModel } from "../models/category.js";
import type { Category } from "../models/db/sound.interface.js";
import type { CategoryRequest } from "../wire/in/category.js";
import type { CategoryResponse, CategoryListResponse } from "../wire/out/category.js";

class CategoryAdapter {
  static toModel(category: CategoryRequest | Category): CategoryModel {
    if ('id' in category) {
      return { id: category.id, label: category.label };
    } else {
      return { id: null, label: category.label };
    }
  }

  static toWireOut(category: CategoryModel): CategoryResponse {
    return { id: category.id || '', label: category.label };
  }

  static toWireOutList(categories: CategoryModel[]): CategoryListResponse {
    return { categories: categories.map(category => this.toWireOut(category)) };
  }
}

export default CategoryAdapter;
