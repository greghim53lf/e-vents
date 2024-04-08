"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { dbConnection } from "../database";
import Category from "../database/models/category.model";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await dbConnection();

    const existingCategory = await Category.findOne({ name: categoryName });

    if (existingCategory) {
      throw new Error("Category name already exists");
    }

    const newCategory = await Category.create({ name: categoryName });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    await dbConnection();

    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
