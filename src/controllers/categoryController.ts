import { Request, Response } from 'express';
import prisma from '../config/db';
import { slugify } from '../utils/slugify';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response):Promise<void> => {
  try {
    const { name } = req.body;
    
  
    const slug = slugify(name);

    const existingCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
       res.status(400).json({ 
        error: `Category '${name}' already exists` 
      });
      return;
    }
    
    
    const category = await prisma.category.create({
      data: { 
        name,
        slug 
      } 
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);
    
    // Convert string to number
    const categoryId = Number(id);
   
    
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "Invalid category ID format" });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Delete if exists
    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' +error});
  }
};