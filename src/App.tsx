import { 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Users, 
  ArrowRight, 
  Briefcase,
  CheckCircle2,
  Lock,
  Cloud,
  Database,
  MessageCircle
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 font-inter text-slate-200 selection:bg-amber-500/30 overflow-x-hidden relative">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Briefcase size={20} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight text-white">ADC Notary</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://notaris.loodfie.net/#/login" className="hidden md:inline-block text-sm font-bold text-slate-400 hover:text-white transition-colors">
              Masuk Klien
            </a>
            <a href="https://notaris.loodfie.net/#/register" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5">
              Coba Sekarang
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION DENGAN TRUST BANNER & MOCKUP */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 min-h-screen flex flex-col items-center">
        {/* Background Glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-5 duration-700 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Sistem Digital Terpadu
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-8">
            Sistem Administrasi Terpusat untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Notaris & PPAT.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Tingkatkan efisiensi kerja kantor Anda. Pantau progres berkas secara mendetail, kelola tagihan pembayaran, dan berikan update transparan kepada klien secara otomatis—semua dari satu layar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="https://notaris.loodfie.net/#/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Mulai Gunakan Sistem <ArrowRight size={18} />
            </a>
            <a href="#fitur" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center">
              Pelajari Fitur
            </a>
          </div>

          {/* 2. TRUST BANNER (Pita Keamanan) */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-16 opacity-80">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-amber-500" /> Keamanan Enkripsi
            </div>
            <div className="flex items-center gap-2">
              <Cloud size={16} className="text-amber-500" /> Akses Cloud 24/7
            </div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-amber-500" /> Backup Otomatis
            </div>
          </div>

          {/* 1. VISUAL MOCKUP APLIKASI */}
          <div className="relative max-w-5xl mx-auto group animate-in fade-in zoom-in duration-1000 delay-300">
            {/* Efek cahaya di belakang mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-amber-500/30 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            {/* Bingkai Mockup (Glassmorphism) */}
            <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 md:p-4 shadow-2xl">
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              {/* Gambar Screenshot. Pastikan nama file di folder public adalah mockup.png atau ubah nama di bawah ini */}
              <img 
                src="/mockup.png" 
                alt="Tampilan Aplikasi ADC Notary" 
                className="rounded-xl md:rounded-[20px] w-full border border-white/5 object-cover shadow-inner bg-slate-800 min-h-[200px]"
                // Jika gambar tidak ditemukan, akan muncul kotak warna gelap sebagai pengganti sementara
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop';
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" className="py-24 px-6 relative z-10 bg-black/20 border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Kendali Total di Tangan Anda</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">Sistem yang dirancang khusus untuk menyelesaikan masalah operasional harian kantor Notaris dan PPAT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Efisiensi Alur Kerja</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Pantau setiap tahap dokumen dari pengumpulan syarat hingga serah terima tanpa ada yang terlewat.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Radar Jatuh Tempo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Sistem peringatan otomatis untuk berkas yang mengendap lama atau mendekati batas waktu penyelesaian.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Portal Klien Mandiri</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Bebaskan staf dari chat klien. Klien dapat mengecek progres berkasnya sendiri secara real-time dan aman.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manajemen Keuangan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Catat uang muka (DP) dan pantau sisa tagihan klien yang terintegrasi langsung dengan progres berkas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-10 md:p-16 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Siap Mengubah Cara Kerja Kantor Anda?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Bergabunglah dan rasakan kemudahan mengelola ratusan berkas Notaris & PPAT dengan tingkat akurasi dan profesionalisme yang tinggi.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="https://notaris.loodfie.net/#/register" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1">
                Buat Akun Sekarang
              </a>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                <CheckCircle2 size={18} className="text-emerald-500" /> Bebas Setup Ribet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 bg-black/40 text-center pb-24 md:pb-10">
        <p className="text-slate-500 text-sm font-medium">
          © 2026 ADC Notary Manager. Dikembangkan dengan <span className="text-amber-500">♥</span> untuk kemudahan Notaris & PPAT.
        </p>
      </footer>

      {/* 3. TOMBOL WHATSAPP MELAYANG (Sama seperti aplikasi utama) */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3">
        {/* Tulisan CHAT US permanen */}
        <div className="bg-white text-emerald-600 font-black text-[10px] px-4 py-2 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-emerald-100 tracking-widest uppercase relative animate-in fade-in slide-in-from-bottom-2">
          CHAT US
          {/* Segitiga panah ke bawah */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-emerald-100"></div>
        </div>

        {/* Tombol WhatsApp */}
        <a
          href="https://wa.me/6282132752200" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 text-white p-4 md:p-5 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.4)] hover:bg-emerald-600 hover:scale-110 transition-all duration-300 flex items-center justify-center border-4 border-slate-900"
        >
          <MessageCircle size={28} className="md:w-8 md:h-8" />
        </a>
      </div>

    </div>
  );
}