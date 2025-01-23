import { BACKEND_URL } from "../../config/server";
import axios from "axios";

export const getAllCategories = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/product-category/get_all_categories`
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const getAllSubcategories = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/product-sub-category/get_all_sub_categories`
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const createSubcategory = async (
  name: string,
  description: string,
  category_id: string
) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/product-sub-category/create_product_sub_category`,
      {
        name: name,
        description: description,
        product_category: category_id,
      }
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const updateSubcategory = async (
  name: string,
  description: string,
  subcategory_id: string,
  category_id: string
) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/product-sub-category/update_product_sub_category?id=${subcategory_id}`,
      {
        name: name,
        description: description,
        product_category: category_id,
      }
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const deleteSubcategory = async (subcategory_id: string) => {
  try {
    const res = await axios.delete(
      `${BACKEND_URL}/product-sub-category/delete_sub_catogory?id=${subcategory_id}`
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const createProductItem = async (
  name: string,
  description: string,
  subcategory_id: string
) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/product_item/create_product_item`,
      {
        name: name,
        description: description,
        product_sub_category: subcategory_id,
      }
    );

    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const updateProductItem = async (
  name: string,
  description: string,
  subcategory_id: string,
  product_id: string
) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/product_item/update_product_item?id=${product_id}`,
      {
        name: name,
        description: description,
        product_sub_category: subcategory_id,
      }
    );

    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const getAllProductItem = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/product_item/get_all_product_item`
    );

    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
