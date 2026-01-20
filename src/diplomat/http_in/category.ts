import type { Request, Response } from 'express';
import CategoryController from '../../controllers/category.controller.js';
import CategoryAdapter from '../../adapters/category.adapter.js';

export default class Category {
  static async createCategory(req: Request, res: Response) {
    const categoryModel = CategoryAdapter.toModel(req.body);
    const category = await CategoryController.createCategory(categoryModel);
    const categoryResponse = CategoryAdapter.toWireOut(category);
    res.status(201).json(categoryResponse);
  }

  static async getCategories(_: Request, res: Response) {
    const categories = await CategoryController.getCategories();
    const categoriesResponse = CategoryAdapter.toWireOutList(categories);
    res.status(200).json(categoriesResponse);
  }

  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    await CategoryController.deleteCategory(id);
    res.status(204).send();
  }
}
