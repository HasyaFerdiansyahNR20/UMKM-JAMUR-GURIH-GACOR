import { CartItem } from "@/types";
import { formatRupiahShort } from "./utils";

interface WhatsAppOrderData {
  customerName: string;
  customerPhone: string;
  orderType: "takeaway" | "dine_in" | "delivery";
  deliveryAddress?: string;
  tableNumber?: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  orderNumber?: string;
}

function cleanSizeText(str?: string): string {
  if (!str) return "";
  return str.replace(/Large\s*\/\s*Reguler/gi, "Large");
}

export function formatWhatsAppMessage(data: WhatsAppOrderData): string {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "UMKM Gurih Gacor";
  const tagline = process.env.NEXT_PUBLIC_STORE_TAGLINE || "KRIUK-KRIUK NYA BIKIN NGILER!";
  const orderNum = data.orderNumber || `GCR-${Date.now().toString().slice(-6)}`;

  let text = `🍄 *PESANAN BARU - ${storeName.toUpperCase()}* 🍄\n`;
  text += `_${tagline}_\n`;
  text += `═══════════════════════\n`;
  text += `📋 *No. Pesanan:* #${orderNum}\n`;
  text += `👤 *Nama Pelanggan:* ${data.customerName}\n`;
  text += `📱 *No. WhatsApp:* ${data.customerPhone}\n`;
  
  if (data.orderType === "delivery") {
    text += `🛵 *Jenis:* Delivery (Pesan Antar)\n`;
    if (data.deliveryAddress) {
      text += `📍 *Alamat:* ${data.deliveryAddress}\n`;
    }
  } else if (data.orderType === "dine_in") {
    text += `🍽️ *Jenis:* Makan di Tempat (Dine In)\n`;
    if (data.tableNumber) {
      text += `🪑 *Nomor Meja:* ${data.tableNumber}\n`;
    }
  } else {
    text += `🥡 *Jenis:* Bawa Pulang (Takeaway / Pick-up)\n`;
  }

  text += `═══════════════════════\n`;
  text += `🛒 *RINCIAN MENU DIPESAN:*\n\n`;

  data.items.forEach((item, index) => {
    const itemSubtotal = item.itemTotal * item.quantity;
    text += `${index + 1}. *${item.product.name}* (x${item.quantity})\n`;
    text += `   💰 @${formatRupiahShort(item.itemTotal)} = *${formatRupiahShort(itemSubtotal)}*\n`;
    
    if (item.selectedSambal) {
      text += `   🌶️ Sambal: ${item.selectedSambal}\n`;
    }
    
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const addonNames = item.selectedAddons.map(a => `${a.name} (+${formatRupiahShort(a.price)})`).join(", ");
      text += `   ➕ Topping: ${addonNames}\n`;
    }

    if (item.notes) {
      text += `   📝 Catatan: _${cleanSizeText(item.notes)}_\n`;
    }
    text += `\n`;
  });

  text += `═══════════════════════\n`;
  text += `💵 *TOTAL TAGIHAN: ${formatRupiahShort(data.totalAmount)}*\n`;
  
  if (data.notes) {
    text += `\n📌 *Catatan Tambahan:*\n_${cleanSizeText(data.notes)}_\n`;
  }

  text += `═══════════════════════\n`;
  text += `Mohon konfirmasi ketersediaan stok & estimasi waktu penyajian ya Kak. Terima kasih! 🙏`;

  return text;
}

export function generateWhatsAppUrl(data: WhatsAppOrderData): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628981613310";
  // Clean phone number: remove +, -, spaces
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = formatWhatsAppMessage(data);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateDirectProductWhatsAppUrl(params: {
  productName: string;
  price: number;
  quantity: number;
  sizeWeight?: string;
  flavor?: string;
  sambal?: string;
  addons?: string[];
  notes?: string;
}): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628981613310";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "UMKM Gurih Gacor";

  let text = `Halo Admin *${storeName}*, saya mau pesan:\n\n`;
  text += `🍄 *${params.productName}*\n`;
  text += `• Jumlah: *${params.quantity} Porsi*\n`;
  if (params.sizeWeight) text += `• Ukuran/Berat: *${cleanSizeText(params.sizeWeight)}*\n`;
  if (params.flavor) text += `• Varian Rasa: *${params.flavor}*\n`;
  if (params.sambal) text += `• Sambal/Bumbu: *${params.sambal}*\n`;
  if (params.addons && params.addons.length > 0) text += `• Topping: *${params.addons.join(", ")}*\n`;
  if (params.notes) text += `• Catatan: _${cleanSizeText(params.notes)}_\n`;
  text += `\n💰 *Estimasi Total: ${formatRupiahShort(params.price * params.quantity)}*\n\n`;
  text += `Apakah menu ini tersedia untuk dipesan sekarang? Terima kasih! 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

