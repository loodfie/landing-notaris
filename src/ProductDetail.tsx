import { useState } from 'react';
import {
  ArrowLeft, Globe, Smartphone, Download, ExternalLink,
  ArrowRight, CheckCircle2, X, ShoppingCart,
  ShieldCheck, Clock, CreditCard, Users, Briefcase,
  Lock, Cloud, Database, BookOpen, Video, Layers,
  Award, Bell, FileText, MessageSquare, Settings, Zap,
} from 'lucide-react';
import type { Product, Platform } from './types';

// ── Modal Konfirmasi Download Mobile ────────────────────────────────────────
function DownloadModal({ platform, productName, onClose }: {
  platform: Platform;
  productName: string;
  onClose: () => void;
}) {
  const handleDownload = () => {
    if (platform.href) window.open(platform.href, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handlePurchase = () => {
    if (platform.purchaseHref) window.open(platform.purchaseHref, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-800 border border-white/10 rounded-[28px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5">
          <Smartphone size={28} strokeWidth={2} />
        </div>

        {/* Judul */}
        <h3 className="text-xl font-black text-white mb-2">Download {productName} Mobile</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Aplikasi mobile memerlukan akun aktif <strong className="text-white">{productName}</strong> versi web. Apakah Anda sudah berlangganan?
        </p>

        {/* Pilihan */}
        <div className="flex flex-col gap-3">
          {/* Sudah berlangganan → download APK */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-3 px-5 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="font-black text-sm leading-tight">Ya, sudah berlangganan</p>
              <p className="text-amber-100/70 text-xs font-medium mt-0.5">Lanjut download APK</p>
            </div>
            <Download size={16} className="ml-auto shrink-0" />
          </button>

          {/* Belum berlangganan → ke pembayaran */}
          <button
            onClick={platform.purchaseHref ? handlePurchase : undefined}
            disabled={!platform.purchaseHref}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-left border ${
              platform.purchaseHref
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:-translate-y-0.5'
                : 'bg-white/[0.03] border-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${platform.purchaseHref ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-600'}`}>
              <ShoppingCart size={18} />
            </div>
            <div>
              <p className="font-black text-sm leading-tight">Belum, ingin berlangganan dulu</p>
              <p className={`text-xs font-medium mt-0.5 ${platform.purchaseHref ? 'text-slate-400' : 'text-slate-600'}`}>
                {platform.purchaseHref ? 'Beli lisensi via Mayar' : 'Link pembayaran segera tersedia'}
              </p>
            </div>
            <ArrowRight size={16} className="ml-auto shrink-0" />
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          Butuh bantuan? Hubungi kami via WhatsApp
        </p>
      </div>
    </div>
  );
}

// Map icon string ke komponen Lucide
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  ShieldCheck, Clock, CreditCard, Users, Briefcase,
  Lock, Cloud, Database, BookOpen, Video, Layers,
  Award, Bell, FileText, MessageSquare, Settings, Zap,
  Globe, Smartphone, Download,
};

// Map color string ke Tailwind classes
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue:    { bg: 'bg-blue-500/20',    text: 'text-blue-400' },
  rose:    { bg: 'bg-rose-500/20',    text: 'text-rose-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  amber:   { bg: 'bg-amber-500/20',   text: 'text-amber-400' },
  violet:  { bg: 'bg-violet-500/20',  text: 'text-violet-400' },
  slate:   { bg: 'bg-slate-500/20',   text: 'text-slate-400' },
};

// Map platform type ke icon
const PLATFORM_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  web: Globe,
  android: Smartphone,
  ios: Smartphone,
  download: Download,
};

function ImageWithFallback({ img }: { img: { src: string; alt: string; caption?: string } }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] min-h-[220px] flex flex-col items-center justify-center gap-3 text-center p-8">
        <Smartphone size={36} className="text-slate-700" />
        <p className="text-slate-600 font-bold text-sm">Gambar gagal dimuat</p>
        <p className="text-slate-700 text-xs font-mono">{img.src}</p>
      </div>
    );
  }
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-800 shadow-xl">
      <img
        src={img.src}
        alt={img.alt}
        className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        onError={() => setError(true)}
      />
      {img.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-sm font-semibold">{img.caption}</p>
        </div>
      )}
    </div>
  );
}

function getCategoryStyle(categoryType: string): string {
  const styles: Record<string, string> = {
    management: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    education:  'text-violet-400 bg-violet-500/10 border-violet-500/20',
    content:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  return styles[categoryType] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}

export default function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [modalPlatform, setModalPlatform] = useState<Platform | null>(null);
  const availablePlatforms = product.platforms.filter(p => p.status === 'available' && p.href);

  const handlePlatformClick = (platform: Platform) => {
    if (platform.requiresSubscription) {
      setModalPlatform(platform);
    } else if (platform.href) {
      window.open(platform.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* MODAL */}
      {modalPlatform && (
        <DownloadModal
          platform={modalPlatform}
          productName={product.name}
          onClose={() => setModalPlatform(null)}
        />
      )}
      {/* STICKY BACK NAV - di bawah main navbar */}
      <div className="sticky top-[73px] z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Katalog Produk
          </button>
          <span className="text-white/20">/</span>
          <span className="text-white text-sm font-bold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 pb-28 md:pb-16">

        {/* HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="animate-in fade-in slide-in-from-left-5 duration-500">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-5 ${getCategoryStyle(product.categoryType)}`}>
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-amber-400/80 font-semibold text-lg mb-4">{product.tagline}</p>
            <p className="text-slate-400 leading-relaxed mb-10">{product.description}</p>

            {product.status === 'coming_soon' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-slate-400 font-bold text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Segera Hadir — Dalam Pengembangan
              </div>
            )}

            {/* Platform Links */}
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Tersedia di</p>
              <div className="flex flex-wrap gap-4">
                {product.platforms.map((platform, i) => {
                  const PlatformIcon = PLATFORM_ICON_MAP[platform.type] ?? ExternalLink;
                  if (platform.status === 'available' && platform.href) {
                    return (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{platform.label}</span>
                        <button
                          onClick={() => handlePlatformClick(platform)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                        >
                          <PlatformIcon size={16} />
                          {platform.cta}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{platform.label}</span>
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-500 rounded-xl font-bold cursor-not-allowed select-none">
                        <PlatformIcon size={16} />
                        {platform.cta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mockup image */}
          {product.mockupImage ? (
            <div className="relative group animate-in fade-in slide-in-from-right-5 duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[28px] p-3 shadow-2xl">
                <div className="flex gap-1.5 mb-2 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
                </div>
                <img
                  src={product.mockupImage}
                  alt={`Tampilan ${product.name}`}
                  className="rounded-xl w-full object-cover bg-slate-800"
                  onError={(e) => {
                    if (product.mockupFallback) e.currentTarget.src = product.mockupFallback;
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px] bg-white/5 border border-dashed border-white/10 rounded-[28px]">
              <div className="text-center text-slate-600">
                <Layers size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">Gambar Segera Ditambahkan</p>
              </div>
            </div>
          )}
        </div>

        {/* FEATURES SECTION */}
        {product.features.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-14">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Fitur Unggulan</p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Kendali Total di Tangan Anda</h2>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto">Dirancang khusus untuk menyelesaikan masalah operasional harian kantor Notaris dan PPAT.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.features.map((feature, i) => {
                const Icon = ICON_MAP[feature.icon];
                const colors = COLOR_MAP[feature.color] ?? COLOR_MAP.slate;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
                    <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {Icon && <Icon size={28} strokeWidth={2} />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SCREENSHOTS SECTION */}
        {product.images.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-14">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Screenshot</p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Tampilan Aplikasi</h2>
            </div>
            <div className={`grid gap-6 ${product.images.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {product.images.map((img, i) => (
                <div key={i} className="flex flex-col gap-3">
                  {/* Label di atas gambar */}
                  {img.label && (
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        {img.label}
                      </span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>
                  )}
                  {/* Gambar atau placeholder */}
                  {img.src ? (
                    <ImageWithFallback img={img} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] min-h-[220px] flex flex-col items-center justify-center gap-3 text-center p-8">
                      <Smartphone size={36} className="text-slate-700" />
                      <p className="text-slate-600 font-bold text-sm">Gambar segera ditambahkan</p>
                      <p className="text-slate-700 text-xs">Isi field "src" di products.json dengan URL gambar</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIDEO TUTORIALS SECTION — selalu tampil, placeholder jika belum ada youtubeId */}
        {product.videos.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-14">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Video Tutorial</p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Panduan Penggunaan</h2>
            </div>
            <div className={`grid gap-8 ${product.videos.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {product.videos.map((video, i) => (
                <div key={i} className="flex flex-col gap-3">
                  {/* Label di atas video */}
                  {video.label && (
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        {video.label}
                      </span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>
                  )}
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    {video.youtubeId ? (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video flex flex-col items-center justify-center gap-3 bg-slate-800/50">
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-slate-600">
                          <Video size={28} />
                        </div>
                        <p className="text-slate-600 font-bold text-sm">Video segera ditambahkan</p>
                        <p className="text-slate-700 text-xs text-center px-6">Isi field "youtubeId" di products.json dengan ID video YouTube</p>
                      </div>
                    )}
                    <div className="p-5 border-t border-white/10">
                      <h3 className="text-white font-bold mb-1">{video.title}</h3>
                      {video.description && <p className="text-slate-400 text-sm">{video.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-10 md:p-14 rounded-[36px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/10 blur-[70px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
              {availablePlatforms.length > 0 ? `Siap Mencoba ${product.name}?` : `${product.name} Segera Hadir`}
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              {availablePlatforms.length > 0
                ? 'Bergabunglah sekarang dan rasakan kemudahan yang kami hadirkan.'
                : 'Pantau terus perkembangan kami. Hubungi kami untuk info lebih lanjut.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {availablePlatforms.map((platform, i) => {
                const PlatformIcon = PLATFORM_ICON_MAP[platform.type] ?? ExternalLink;
                return (
                  <a
                    key={i}
                    href={platform.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <PlatformIcon size={18} /> {platform.cta}
                  </a>
                );
              })}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
                <CheckCircle2 size={18} className="text-emerald-500" /> Bebas Setup Ribet
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
