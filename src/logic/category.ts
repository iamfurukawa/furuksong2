import type { CategoryModel } from "../models/category.js";
import { ValidationError } from "../errors/app.error.js";

class CategoryLogic {
  static isValid(category: CategoryModel) {
    if (!category.label) {
      throw new ValidationError("Category label is required", "The label field is mandatory for category creation");
    }
  }

  static isValidId(id: string) {
    if (!id) {
      throw new ValidationError("Category ID is required", "The ID field is mandatory for category creation");
    }
  }
}

export default CategoryLogic;