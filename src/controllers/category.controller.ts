import { createCategory, getCategories, deleteCategory } from '../diplomat/db.js';
import type { CategoryModel } from '../models/category.js';
import CategoryLogic from '../logic/category.js';

export default class CategoryController {
  static async createCategory(category: CategoryModel) {
    CategoryLogic.isValid(category);
    return await createCategory(category);
  }

  static async getCategories() {
    return await getCategories();
  }

  static async deleteCategory(id: string) {
    CategoryLogic.isValidId(id);
    await deleteCategory(id);
  }
}
