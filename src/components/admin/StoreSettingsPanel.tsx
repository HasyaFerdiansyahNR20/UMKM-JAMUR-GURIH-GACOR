"use client";

import React, { useState } from "react";
import { StoreSettings, updateStoreSettingsAction } from "@/actions/settings";
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  CheckCircle2,
  Save,
  Send,
  Globe,
} from "lucide-react";

interface StoreSettingsPanelProps {
  initialSettings: StoreSettings;
}

export const StoreSettingsPanel: React.FC<StoreSettingsPanelProps> = ({
  initialSettings,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSettings.whatsappNumber || "62895634949189"
  );
  const [telegramBotUsername, setTelegramBotUsername] = useState(
    initialSettings.telegramBotUsername || "GurihGacorBot"
  );
  const [address, setAddress] = useState(
    initialSettings.address ||
      "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Pd. Petir, Kec. Bojongsari, Kota Tangerang Selatan, Banten 16517"
  );
  const [addressShort, setAddressShort] = useState(
    initialSettings.addressShort ||
      "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Tangerang Selatan"
  );
  const [mapsUrl, setMapsUrl] = useState(
    initialSettings.mapsUrl || "https://maps.app.goo.gl/3vqf68ptrZtxmxbo7"
  );
  const [instagramUsername, setInstagramUsername] = useState(
    initialSettings.instagramUsername || "@gurih.gacor"
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialSettings.instagramUrl || "https://www.instagram.com/gurih.gacor/"
  );
  const [tiktokUsername, setTiktokUsername] = useState(
    initialSettings.tiktokUsername || "@gurih.gacor"
  );
  const [tiktokUrl, setTiktokUrl] = useState(
    initialSettings.tiktokUrl || "https://www.tiktok.com/@gurih.gacor"
  );
  const [operatingDays, setOperatingDays] = useState(
    initialSettings.operatingDays || "Senin – Minggu"
  );
  const [operatingHours, setOperatingHours] = useState(
    initialSettings.operatingHours || "09.00 – 21.00 WIB"
  );
  const [operatingNote, setOperatingNote] = useState(
    initialSettings.operatingNote ||
      "*Menerima pesanan online & takeaway setiap hari."
  );
  const [tagline, setTagline] = useState(
    initialSettings.tagline || "KRIUK-KRIUK NYA BIKIN NGILER!"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMsg("");

    try {
      const res = await updateStoreSettingsAction({
        whatsappNumber,
        telegramBotUsername,
        address,
        addressShort,
        mapsUrl,
        instagramUsername,
        instagramUrl,
        tiktokUsername,
        tiktokUrl,
        operatingDays,
        operatingHours,
        operatingNote,
        tagline,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal menyimpan pengaturan toko.");
      } else {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-black text-stone-900">
          Pengaturan Info Kontak, Alamat, Sosmed &amp; Jam Operasional
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Perubahan yang disimpan di sini akan langsung memperbarui bagian Kontak &amp; Footer di halaman utama website.
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan info kontak, alamat, sosmed, dan jam operasional berhasil diperbarui!</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. INFO KONTAK PEMESANAN */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>1. Info Kontak Pemesanan</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Nomor WhatsApp Toko (Gunakan kode 62 di depan)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Contoh: 62895634949189"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Username Bot Telegram (Tanpa @)
              </label>
              <div className="relative">
                <Send className="w-3.5 h-3.5 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={telegramBotUsername}
                  onChange={(e) => setTelegramBotUsername(e.target.value)}
                  placeholder="GurihGacorBot"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Motto / Slogan Toko
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="KRIUK-KRIUK NYA BIKIN NGILER!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 2. JAM OPERASIONAL */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>2. Jam Operasional Toko</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Hari Operasional
              </label>
              <input
                type="text"
                required
                value={operatingDays}
                onChange={(e) => setOperatingDays(e.target.value)}
                placeholder="Contoh: Senin – Minggu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Jam Buka – Tutup
              </label>
              <input
                type="text"
                required
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Contoh: 09.00 – 21.00 WIB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Catatan Jam Operasional
              </label>
              <input
                type="text"
                value={operatingNote}
                onChange={(e) => setOperatingNote(e.target.value)}
                placeholder="*Menerima pesanan online & takeaway setiap hari."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 3. ALAMAT & LOKASI GOOGLE MAPS */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>3. Alamat Fisik &amp; Titik Lokasi</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Alamat Lengkap (Bagian Kontak)
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Alamat Ringkas (Ditampilkan di Footer Bawah)
              </label>
              <input
                type="text"
                value={addressShort}
                onChange={(e) => setAddressShort(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Link Google Maps
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 4. AKUN MEDIA SOSIAL */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>4. Media Sosial Resmi (Instagram &amp; TikTok)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nama Akun Instagram
                </label>
                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  placeholder="@gurih.gacor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Link URL Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/gurih.gacor/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nama Akun TikTok
                </label>
                <input
                  type="text"
                  value={tiktokUsername}
                  onChange={(e) => setTiktokUsername(e.target.value)}
                  placeholder="@gurih.gacor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Link URL TikTok
                </label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@gurih.gacor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan Kontak & Toko"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
