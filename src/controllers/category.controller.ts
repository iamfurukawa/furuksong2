import { createCategory, getCategories, deleteCategory } from '../diplomat/db-postgres.js';
import type { CategoryModel } from '../models/category.js';
import CategoryLogic from '../logic/category.js';

export default class CategoryController {
  static async createCategory(category: CategoryModel): Promise<CategoryModel> {
    CategoryLogic.isValid(category);
    return await createCategory(category);
  }

  static async getCategories(): Promise<CategoryModel[]> {
    return await getCategories();
  }

  static async deleteCategory(id: string): Promise<boolean> {
    CategoryLogic.isValidId(id);
    return await deleteCategory(id);
  }
}
