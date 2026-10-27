import React from "react";
import Image from "next/image";
import { Heart, Award, ShieldCheck, Leaf, Flame, Users, CheckCircle2 } from "lucide-react";

export const AboutSection: React.FC = () => {
  const advantages = [
    {
      icon: Leaf,
      title: "100% Jamur Segar Petani Lokal",
      desc: "Dipetik langsung setiap pagi dari budidaya jamur tiram lokal berkualitas premium tanpa bahan pengawet.",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: Flame,
      title: "Resep Rahasia 7 Rempah",
      desc: "Diracik dengan formula bumbu khas Nusantara yang meresap ke dalam serat jamur, menghasilkan gurih otentik.",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      icon: ShieldCheck,
      title: "Minyak Higienis & Terkontrol",
      desc: "Selalu menggunakan minyak nabati bersih dengan kontrol suhu penggorengan presisi, minim minyak dan anti tengik.",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      icon: Award,
      title: "Kriuk Tahan Lama",
      desc: "Tekstur garing maksimal yang awet renyah berjam-jam, cocok untuk lauk makan maupun camilan santai kapan saja.",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  return (
    <section id="tentang-kami" className="py-20 bg-[#faf8f5] relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Cerita & Profil UMKM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Mengenal Lebih Dekat <br className="hidden sm:block" />
            <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            Dari dapur rumahan sederhana, lahir cita rasa kriuk jamur berkualitas tinggi yang kini menjadi camilan favorit keluarga Indonesia.
          </p>
        </div>

        {/* Profile & History Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-200/50 p-6 sm:p-10 lg:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Mascot & Brand Visual */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-4 border-2 border-amber-300 shadow-inner group">
                <img
                  src="/logo-gurih-gacor.webp"
                  alt="Logo Maskot Gurih Gacor"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-black tracking-wide uppercase shadow">
                <span>Pelopor Jamur Crispy Juara</span>
              </div>
            </div>

            {/* Right: Story & Profile Text */}
            <div className="lg:col-span-7 space-y-5 text-stone-700">
              <div className="border-l-4 border-amber-500 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Sejarah Kami</span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                  Berawal dari Cinta pada Camilan Nusantara
                </h3>
              </div>
              
              <p className="text-sm sm:text-base leading-relaxed text-stone-600">
                <strong>Gurih Gacor</strong> didirikan dengan satu misi sederhana: menghadirkan olahan jamur tiram yang tidak hanya lezat dan renyah luar biasa, namun juga higienis, terjangkau, dan bernilai gizi tinggi.
              </p>
              
              <p className="text-sm sm:text-base leading-relaxed text-stone-600">
                Bermula dari eksperimen resep keluarga yang menggabungkan tepung bumbu rahasia 7 rempah Nusantara dengan jamur tiram segar petik harian, Gurih Gacor berkembang pesat berkat ulasan positif dari mulut ke mulut penikmat kuliner krispi.
              </p>

              {/* Visi & Misi Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Visi Kami</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Menjadi ikon camilan jamur crispy nomor 1 di Nusantara yang dicintai karena kualitas rasa dan keaslian rempah alami.
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm mb-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Misi Kami</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Memberdayakan pembudidaya jamur lokal dan menyajikan produk higienis yang cepat disajikan dengan pelayanan ramah.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 4 Keunggulan Gurih Gacor Grid */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Mengapa Memilih <span className="text-amber-600">Gurih Gacor</span>?
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              4 Alasan kenapa kriuk kami bikin nagih dan selalu dirindukan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${item.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-base text-stone-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center text-amber-600 text-[11px] font-bold uppercase tracking-wider">
                    <span>Terjamin Kualitasnya</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
