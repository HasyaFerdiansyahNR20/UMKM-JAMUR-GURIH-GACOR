"use server";

import { productService } from "@/services/productService";
import { AvailabilityStatus, Product } from "@/types";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/serverAuth";
import { productSchema } from "@/lib/validations";

export async function fetchProductsAction() {
  return await productService.getProducts();
}

export async function fetchCategoriesAction() {
  return await productService.getCategories();
}

export async function toggleStockAction(id: string, newStatus: AvailabilityStatus) {
  await requireAdminSession();
  
  const allowedStatuses: AvailabilityStatus[] = ["available", "unavailable", "sold_out"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Status produk '${newStatus}' tidak valid.`);
  }

  const result = await productService.toggleStock(id, newStatus);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function createProductAction(productData: Partial<Product>) {
  await requireAdminSession();

  // Validate with Zod
  const validation = productSchema.safeParse(productData);
  if (!validation.success) {
    throw new Error(
      "Data produk tidak valid: " +
        validation.error.issues.map((i) => i.message).join(", ")
    );
  }

  const result = await productService.createProduct(validation.data as any);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function updateProductAction(id: string, productData: Partial<Product>) {
  await requireAdminSession();

  if (!id || typeof id !== "string") {
    throw new Error("ID produk wajib diisi.");
  }

  // Validate partial fields with Zod
  const validation = productSchema.partial().safeParse(productData);
  if (!validation.success) {
    throw new Error(
      "Data pembaruan produk tidak valid: " +
        validation.error.issues.map((i) => i.message).join(", ")
    );
  }

  const result = await productService.updateProduct(id, validation.data as any);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function deleteProductAction(id: string) {
  await requireAdminSession();

  if (!id || typeof id !== "string") {
    throw new Error("ID produk wajib diisi.");
  }

  const result = await productService.deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}
