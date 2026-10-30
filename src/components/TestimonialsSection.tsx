import React from "react";
import { Star, MessageCircle, Quote, CheckCircle } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: "rev-1",
      name: "Dinda Pratiwi",
      role: "Pecinta Kuliner Pedas, Jakarta",
      rating: 5,
      date: "Kemarin",
      review: "Kerenyahannya gila sih! Biasanya jamur krispi di tempat lain dingin dikit langsung alot, tapi Gurih Gacor ini awet kriuk sampe sore. Sambal korek uleknya pedas nampol!",
      menu: "Jamur Crispy Signature + Sambal Bawang",
    },
    {
      id: "rev-2",
      name: "Rian Firmansyah",
      role: "Karyawan Swasta, Depok",
      rating: 5,
      date: "3 hari yang lalu",
      review: "Pesan buat camilan nonton bola bareng temen-temen kantor. Porsinya ngenyangin, minyaknya bersih nggak bikin gatal di tenggorokan. Pasti re-order lagi via WA!",
      menu: "Paket Komplit Jamur & Enoki Golden",
    },
    {
      id: "rev-3",
      name: "Siti Rahmawati",
      role: "Ibu Rumah Tangga, Bekasi",
      rating: 5,
      date: "1 minggu yang lalu",
      review: "Anak-anak suka banget varian Jagung Bakar dan Baladonya. Rasanya gurih pas, rempahnya berasa otentik bukan micin instan. Pelayanan admin WhatsApp-nya juga sangat ramah dan cepat.",
      menu: "Jamur Crispy Varian Jagung Bakar",
    },
    {
      id: "rev-4",
      name: "Budi Santoso",
      role: "Mahasiswa, Tangerang",
      rating: 5,
      date: "2 minggu yang lalu",
      review: "Harga ramah kantong mahasiswa tapi rasa bintang lima. Nasi wangi daun jeruknya dipadukan sama jamur kriuk beneran bikin nagih parah. Gacor abis!",
      menu: "Paket Nasi Wangi Jamur Crispy",
    },
  ];

  return (
    <section id="testimoni" className="py-20 bg-white relative overflow-hidden border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Kata Mereka yang Sudah Mencoba</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Testimoni Pelanggan <br className="hidden sm:block" />
            <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          
          {/* Rating Summary Bar */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-extrabold text-stone-900">4.9 / 5.0</span>
            <span className="text-xs text-stone-500 font-medium">
              (Berdasarkan 500+ ulasan pembeli via WhatsApp)
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#faf8f5] rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-stone-300 fill-stone-200" />
                </div>

                {/* Review Body */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Author & Menu Details */}
              <div className="pt-4 border-t border-stone-200/60">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-stone-900">
                    {rev.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>Terverifikasi</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {rev.role}
                </p>
                <div className="mt-2 text-[10px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  Menu: {rev.menu}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
