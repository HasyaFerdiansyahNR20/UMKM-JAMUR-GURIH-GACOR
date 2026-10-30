"use client";

import { useEffect, useState, useMemo } from "react";
import { Product, Category } from "@/types";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/db";

export function useCatalog(initialProducts?: Product[], initialCategories?: Category[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts || FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(initialCategories || FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // If not provided server-side, fetch from API
    if (!initialProducts || initialProducts.length === 0) {
      setLoading(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.products && data.products.length > 0) {
            setProducts(data.products);
          }
          if (data && data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        })
        .catch((err) => {
          console.warn("Client catalog fallback to resilience layer:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [initialProducts]);

  // Filtered products computed instantly
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === "all" ||
        item.category_id === selectedCategory ||
        item.category?.slug === selectedCategory;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return {
    products,
    setProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    loading,
  };
}
