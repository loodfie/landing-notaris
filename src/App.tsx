import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Layers,
  Lock,
  Cloud,
  Database,
  MessageCircle,
  Briefcase,
  Video,
  BookOpen,
  Globe,
  Smartphone,
  Download,
  Star,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import type { Product, ProductsData } from './types';
import ProductDetail from './ProductDetail';

// ── Category styles ──────────────────────────────────────────────────────────
function getCategoryStyle(categoryType: string) {
  const map: Record<string, string> = {
    management: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    education:  'text-violet-400 bg-violet-500/10 border-violet-500/20',
    content:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  return map[categoryType] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}

function getCategoryIcon(categoryType: string) {
  const icons: Record<string, React.ReactNode> = {
    management: <Briefcase size={14} />,
    education:  <Video size={14} />,
    content:    <BookOpen size={14} />,
  };
  return icons[categoryType] ?? <Layers size={14} />;
}

function getPlatformIcon(type: string) {
  const map: Record<string, React.ReactNode> = {
    web: <Globe size={16} />,
    android: <Smartphone size={16} />,
    ios: <Smartphone size={16} />,
    download: <Download size={16} />,
  };
  return map[type] ?? <ExternalLink size={16} />;
}

// ── Featured Product Card ────────────────────────────────────────────────────
function FeaturedProductCard({ product, onDetail }: { product: Product; onDetail: () => void }) {
  return (
    <div
      className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] overflow-hidden group hover:border-amber-500/30 transition-all duration-500 cursor-pointer"
      onClick={onDetail}
    >
      <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest">
        <Star size={11} fill="currentColor" /> Unggulan
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Info */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${getCategoryStyle(product.categoryType)}`}>
              {getCategoryIcon(product.categoryType)} {product.category}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{product.name}</h3>
            <p className="text-amber-400/80 font-semibold text-sm mb-4">{product.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
          </div>

          {/* Platform badges */}
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Tersedia di</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.platforms.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  {getPlatformIcon(p.type)}
                  {p.label}
                  {p.status === 'available'
                    ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></span>
                    : <span className="text-[10px] text-slate-600 font-bold">(Soon)</span>}
                </div>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDetail(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20 text-sm"
            >
              Lihat Detail Produk <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative bg-slate-800/50 flex items-center justify-center p-6 md:p-8 min-h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          {product.mockupImage && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
              <div className="flex gap-1.5 p-3 bg-slate-900/80">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
              </div>
              <img
                src={product.mockupImage}
                alt={`Tampilan ${product.name}`}
                className="w-full object-cover bg-slate-800"
                onError={(e) => {
                  if (product.mockupFallback) (e.currentTarget as HTMLImageElement).src = product.mockupFallback;
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Regular Product Card ─────────────────────────────────────────────────────
function ProductCard({ product, onDetail }: { product: Product; onDetail: () => void }) {
  return (
    <div
      className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[28px] p-8 group hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={onDetail}
    >
      <div className="absolute top-5 right-5 px-2.5 py-1 bg-slate-700/80 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Coming Soon
      </div>
      <div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${getCategoryStyle(product.categoryType)}`}>
          {getCategoryIcon(product.categoryType)} {product.category}
        </div>
        <h3 className="text-xl font-black text-white mb-2">{product.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm group/btn"
      >
        Lihat Info <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then((data: ProductsData) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenDetail = (id: string) => {
    setSelectedProductId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const featuredProduct = products.find(p => p.featured);
  const otherProducts = products.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-slate-900 font-inter text-slate-200 selection:bg-amber-500/30 overflow-x-hidden relative">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="font-black text-lg tracking-tight text-white leading-none block">Alfa Digital</span>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">Communica</span>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="hidden md:inline-block text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Produk
            </button>
            <a
              href="https://wa.me/6282132752200"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <MessageCircle size={16} /> Hubungi Kami
            </a>
          </div>
        </div>
      </nav>

      {/* PRODUCT DETAIL VIEW */}
      {selectedProduct && (
        <div className="pt-[73px]">
          <ProductDetail product={selectedProduct} onBack={handleBack} />
        </div>
      )}

      {/* CATALOG VIEW */}
      {!selectedProduct && (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-36 pb-20 md:pt-52 md:pb-28 px-6 flex flex-col items-center">
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/15 blur-[130px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-5 duration-700 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Studio Produk Digital Indonesia
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
                Produk Digital yang{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Membangun Bisnis
                </span>{' '}
                Anda.
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
                Alfa Digital Communica menghadirkan aplikasi, kursus, dan konten digital berkualitas tinggi untuk mendorong produktivitas dan pertumbuhan bisnis Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <a
                  href="#produk"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Lihat Semua Produk <ChevronRight size={18} />
                </a>
                <a
                  href="https://wa.me/6282132752200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> Konsultasi Gratis
                </a>
              </div>

              {/* Trust Banner */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider opacity-80">
                <div className="flex items-center gap-2"><Lock size={16} className="text-amber-500" /> Keamanan Enkripsi</div>
                <div className="flex items-center gap-2"><Cloud size={16} className="text-amber-500" /> Akses Cloud 24/7</div>
                <div className="flex items-center gap-2"><Database size={16} className="text-amber-500" /> Backup Otomatis</div>
              </div>
            </div>
          </section>

          {/* PRODUK SECTION */}
          <section id="produk" className="py-24 px-6 relative z-10 bg-black/20 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Katalog Produk</p>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Produk & Layanan Kami</h2>
                <p className="text-slate-400 font-medium max-w-2xl mx-auto">Dari aplikasi manajemen hingga konten edukatif—solusi digital lengkap untuk kebutuhan Anda.</p>
              </div>

              {loading && (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500 font-medium">Memuat produk...</p>
                </div>
              )}

              {!loading && (
                <>
                  {featuredProduct && (
                    <div className="mb-8">
                      <FeaturedProductCard product={featuredProduct} onDetail={() => handleOpenDetail(featuredProduct.id)} />
                    </div>
                  )}

                  {otherProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherProducts.map(product => (
                        <ProductCard key={product.id} product={product} onDetail={() => handleOpenDetail(product.id)} />
                      ))}
                      {/* Slot produk berikutnya */}
                      <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[28px] p-8 flex flex-col items-center justify-center text-center min-h-[200px] gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                          <Layers size={24} />
                        </div>
                        <p className="text-slate-600 font-bold text-sm">Produk Berikutnya</p>
                        <p className="text-slate-700 text-xs">Sedang dalam pengembangan</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="py-24 px-6 relative z-10">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-10 md:p-16 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Ada Ide Produk Digital?</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Kami terbuka untuk kolaborasi, custom development, atau konsultasi seputar transformasi digital bisnis Anda.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a
                    href="https://wa.me/6282132752200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> Diskusi via WhatsApp
                  </a>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                    <CheckCircle2 size={18} className="text-emerald-500" /> Konsultasi Gratis
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/10 py-10 px-6 bg-black/40 pb-24 md:pb-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
                  <Layers size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-black text-sm text-white leading-none block">Alfa Digital Communica</span>
                  <span className="text-slate-500 text-xs">Studio Produk Digital Indonesia</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium text-center md:text-right">
                © 2026 Alfa Digital Communica. Dikembangkan dengan <span className="text-amber-500">♥</span> untuk kemajuan Indonesia.
              </p>
            </div>
          </footer>
        </>
      )}

      {/* TOMBOL WHATSAPP MELAYANG */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3">
        <div className="bg-white text-emerald-600 font-black text-[10px] px-4 py-2 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-emerald-100 tracking-widest uppercase relative">
          CHAT US
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-emerald-100"></div>
        </div>
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
