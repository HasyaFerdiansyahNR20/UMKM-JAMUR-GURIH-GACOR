"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductAddon } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product,
    quantity?: number,
    selectedSambal?: string,
    selectedAddons?: ProductAddon[],
    notes?: string
  ) => void;
  removeItem: (productId: string, selectedSambal?: string, notes?: string, itemTotal?: number) => void;
  updateQuantity: (productId: string, quantity: number, selectedSambal?: string, notes?: string, itemTotal?: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

const isSameCartVariant = (
  item: CartItem,
  productId: string,
  selectedSambal = "",
  notes?: string,
  itemTotal?: number
) => {
  const sameId = item.product.id === productId;
  const sameSambal = (item.selectedSambal || "") === selectedSambal;
  const sameNotes = notes === undefined ? true : (item.notes || "") === notes;
  const samePrice = itemTotal === undefined ? true : item.itemTotal === itemTotal;
  return sameId && sameSambal && sameNotes && samePrice;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedSambal = "", selectedAddons = [], notes = "") => {
        set((state) => {
          // Calculate item base price + addons
          const addonsCost = selectedAddons.reduce((acc, curr) => acc + (curr.price || 0), 0);
          const itemTotal = Number(product.price) + addonsCost;

          // Check if item with same product ID, same size/price, and same options already in cart
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.itemTotal === itemTotal &&
              (item.selectedSambal || "") === selectedSambal &&
              (item.notes || "") === notes &&
              JSON.stringify(item.selectedAddons || []) === JSON.stringify(selectedAddons)
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            product,
            quantity,
            selectedSambal,
            selectedAddons,
            notes,
            itemTotal,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (productId, selectedSambal = "", notes, itemTotal) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameCartVariant(item, productId, selectedSambal, notes, itemTotal)
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedSambal = "", notes, itemTotal) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSambal, notes, itemTotal);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (isSameCartVariant(item, productId, selectedSambal, notes, itemTotal)) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.itemTotal * item.quantity, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "umkm-gurih-gacor-cart-v2",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
