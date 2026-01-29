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

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await CategoryController.deleteCategory(id as string);
    res.status(204).send();
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { label } = req.body;
    
    if (!label || typeof label !== 'string') {
      res.status(400).json({ error: 'Label is required' });
      return;
    }
    
    try {
      const updatedCategory = await CategoryController.updateCategory(id as string, { id: null, label });
      const response = CategoryAdapter.toWireOut(updatedCategory);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Category not found') {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(500).json({ error: 'Failed to update category' });
      }
    }
  }
}
