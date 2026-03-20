import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Layers, Lock, Cloud, MessageCircle, Briefcase, Video,
  BookOpen, Globe, Smartphone, Download, Star, ChevronRight, ExternalLink,
  CheckCircle2, Users, FileText, Clock,
} from 'lucide-react';
import type { Product } from './types';
import ProductDetail from './ProductDetail';
import AdminPanel from './AdminPanel';
import { supabase } from './lib/supabase';
import { applyTheme } from './lib/applyTheme';
import type { Theme } from './lib/applyTheme';

// ── DB mapping ────────────────────────────────────────────────────────────────
interface DBProduct {
  id: string; name: string; tagline: string; description: string;
  category: string; category_type: string; status: string;
  featured: boolean; mockup_image: string | null; mockup_fallback: string | null;
  platforms: Product['platforms']; features: Product['features'];
  images: Product['images']; videos: Product['videos']; sort_order: number;
}
function dbToProduct(row: DBProduct): Product {
  return {
    id: row.id, name: row.name, tagline: row.tagline, description: row.description,
    category: row.category, categoryType: row.category_type,
    status: row.status as 'available' | 'coming_soon', featured: row.featured,
    mockupImage: row.mockup_image, mockupFallback: row.mockup_fallback,
    platforms: row.platforms ?? [], features: row.features ?? [],
    images: row.images ?? [], videos: row.videos ?? [],
  };
}

// ── Site Content Types ────────────────────────────────────────────────────────
export interface StatItem { icon: string; value: string; label: string; }
export interface TestimonialItem { name: string; role: string; quote: string; initial: string; }
export interface PricingPlan { name: string; price: string; period: string; desc: string; features: string[]; cta: string; href: string; primary: boolean; popular: boolean; }
export interface FaqItem { q: string; a: string; }
export interface SiteSettings { brandName: string; brandTagline: string; waNumber: string; waDefaultMessage: string; address: string; footerText: string; }
export interface HeroContent { badge: string; title: string; titleHighlight: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; trustItems: string[]; }
export interface SocialProofData { badge: string; title: string; stats: StatItem[]; testimonials: TestimonialItem[]; }
export interface PricingData { badge: string; title: string; subtitle: string; plans: PricingPlan[]; }
export interface SiteContent { settings: SiteSettings; hero: HeroContent; socialProof: SocialProofData; pricing: PricingData; faqs: FaqItem[]; }

const DEFAULT_CONTENT: SiteContent = {
  settings: { brandName: 'Alfa Digital Communica', brandTagline: 'Studio Produk Digital Indonesia', waNumber: '6282132752200', waDefaultMessage: 'Halo%2C%20saya%20tertarik%20dengan%20produk%20Alfa%20Digital%20Communica.%20Bisa%20info%20lebih%20lanjut%3F', address: 'Surabaya, Jawa Timur, Indonesia', footerText: 'Dikembangkan dengan ♥ untuk kemajuan Indonesia.' },
  hero: { badge: 'Studio Produk Digital Indonesia', title: 'Solusi Digital yang Bekerja Selagi', titleHighlight: 'Anda Fokus Berkembang.', subtitle: 'Dari aplikasi manajemen hingga konten edukatif — kami membangun produk digital yang langsung menyelesaikan masalah nyata bisnis Indonesia.', ctaPrimary: 'Lihat Semua Produk', ctaSecondary: 'Konsultasi Gratis', trustItems: ['Keamanan Data Terenkripsi', 'Akses Cloud 24/7', 'Multi-Platform Web & Mobile'] },
  socialProof: { badge: 'Dipercaya Profesional', title: 'Digunakan oleh Kantor Hukum di Seluruh Indonesia', stats: [{ icon: 'Users', value: '15+', label: 'Kantor Terdaftar' }, { icon: 'FileText', value: '500+', label: 'Berkas Dikelola' }, { icon: 'Cloud', value: '99.9%', label: 'Uptime Server' }, { icon: 'Clock', value: '< 3 Menit', label: 'Respon Support' }], testimonials: [{ name: 'Notaris H. Slamet, S.H., M.Kn.', role: 'Kantor Notaris — Surabaya', quote: 'ADC Notary mengubah cara kami bekerja. Berkas yang dulu sering tercecer sekarang terpantau semua dari satu dashboard.', initial: 'S' }, { name: 'Rini Agustina, S.H.', role: 'PPAT — Jakarta Selatan', quote: 'Fitur radar jatuh tempo sangat membantu. Kami tidak pernah lagi kelewatan deadline.', initial: 'R' }, { name: 'M. Fadli, S.H., M.H.', role: 'Lawyer — Bandung', quote: 'Sistem keuangannya rapi sekali. DP dan sisa tagihan langsung terintegrasi dengan progress berkas.', initial: 'F' }] },
  pricing: { badge: 'Harga Transparan', title: 'Investasi Terjangkau untuk Bisnis Anda', subtitle: 'Pilih paket yang sesuai. Semua paket termasuk support via WhatsApp.', plans: [{ name: 'Starter', price: 'Rp 99.000', period: '/bulan', desc: 'Untuk kantor kecil yang baru memulai digitalisasi', features: ['Maksimal 50 berkas aktif', '1 user admin', 'Dashboard & laporan dasar', 'Support WhatsApp (jam kerja)'], cta: 'Mulai Gratis 14 Hari', href: 'https://notaris.loodfie.net/#/register', primary: false, popular: false }, { name: 'Professional', price: 'Rp 199.000', period: '/bulan', desc: 'Untuk kantor yang butuh fitur lengkap', features: ['Berkas aktif unlimited', '5 user admin + staff', 'Portal klien mandiri', 'Radar jatuh tempo', 'Manajemen keuangan', 'Akses mobile Android', 'Support prioritas WhatsApp'], cta: 'Mulai Gratis 14 Hari', href: 'https://notaris.loodfie.net/#/register', primary: true, popular: true }, { name: 'Enterprise', price: 'Hubungi Kami', period: '', desc: 'Untuk firma besar atau kebutuhan kustom', features: ['Semua fitur Professional', 'User unlimited', 'Custom branding', 'API access', 'Dedicated account manager', 'Training tim'], cta: 'Hubungi Sales', href: 'https://wa.me/6282132752200', primary: false, popular: false }] },
  faqs: [{ q: 'Apakah ada uji coba gratis?', a: 'Ya! Semua paket mendapatkan 14 hari uji coba gratis tanpa perlu kartu kredit.' }, { q: 'Bisa upgrade atau downgrade paket?', a: 'Tentu. Anda bisa mengubah paket kapan saja. Perubahan berlaku di periode billing berikutnya.' }, { q: 'Bagaimana metode pembayaran?', a: 'Kami menerima transfer bank, QRIS, dan pembayaran via Mayar.' }, { q: 'Apakah data saya aman?', a: 'Semua data dienkripsi dengan AES-256 dan disimpan di server cloud dengan backup otomatis harian.' }],
};

// Stat icon map
const STAT_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users, FileText, Cloud, Clock, Star, CheckCircle2,
};
const TRUST_ICONS = [Lock, Cloud, Smartphone];

// ── Social Proof Section ─────────────────────────────────────────────────────
function SocialProof({ content }: { content: SocialProofData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-6 relative z-10 bg-black/20 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
            {content.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{content.title}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {content.stats.map((stat, i) => {
            const Icon = STAT_ICON_MAP[stat.icon] ?? Star;
            return (
              <div key={i} className={`flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-[24px] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <Icon size={24} className="text-amber-500 mb-3" />
                <span className="text-4xl font-black text-white mb-1">{stat.value}</span>
                <span className="text-sm text-slate-400">{stat.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-600 text-center -mt-10 mb-16">* Data per Maret 2026</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.testimonials.map((t, i) => (
            <div key={i} className={`bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${(i + 4) * 100}ms` }}>
              <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} className="text-amber-400" fill="currentColor" />)}</div>
              <p className="text-slate-300 italic text-sm leading-relaxed flex-1">
                <span className="text-amber-400 text-2xl font-black leading-none mr-1">"</span>{t.quote}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">{t.initial}</div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing Section ──────────────────────────────────────────────────────────
function PricingSection({ content, faqs }: { content: PricingData; faqs: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <section className="py-24 px-6 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">{content.badge}</div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">{content.title}</h2>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
          {content.plans.map((plan, i) => (
            <div key={i} className={`relative flex flex-col rounded-[28px] p-8 border transition-all duration-300 ${plan.popular ? 'bg-white/[0.07] border-amber-500/30 shadow-xl shadow-amber-500/10 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'}`}>
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap">Paling Populer</div>
              )}
              <div className="mb-6">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm mb-1">{plan.period}</span>}
                </div>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} target="_blank" rel="noopener noreferrer" className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all hover:-translate-y-0.5 ${plan.primary ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Pertanyaan Umum</p>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left text-white font-bold text-sm hover:bg-white/5 transition-colors">
                  {faq.q}
                  <span className={`text-amber-400 transition-transform duration-300 text-lg leading-none ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Category / Platform helpers ───────────────────────────────────────────────
function getCategoryStyle(t: string) {
  return ({ management: 'text-amber-400 bg-amber-500/10 border-amber-500/20', education: 'text-violet-400 bg-violet-500/10 border-violet-500/20', content: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' } as Record<string, string>)[t] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}
function getCategoryIcon(t: string) {
  return ({ management: <Briefcase size={14} />, education: <Video size={14} />, content: <BookOpen size={14} /> } as Record<string, React.ReactNode>)[t] ?? <Layers size={14} />;
}
function getPlatformIcon(t: string) {
  return ({ web: <Globe size={16} />, android: <Smartphone size={16} />, ios: <Smartphone size={16} />, download: <Download size={16} /> } as Record<string, React.ReactNode>)[t] ?? <ExternalLink size={16} />;
}

// ── Featured Product Card ─────────────────────────────────────────────────────
function FeaturedProductCard({ product, onDetail }: { product: Product; onDetail: () => void }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] overflow-hidden group hover:border-amber-500/30 transition-all duration-500 cursor-pointer" onClick={onDetail}>
      <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest">
        <Star size={11} fill="currentColor" /> Unggulan
      </div>
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${getCategoryStyle(product.categoryType)}`}>{getCategoryIcon(product.categoryType)} {product.category}</div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{product.name}</h3>
            <p className="text-amber-400/80 font-semibold text-sm mb-4">{product.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Tersedia di</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.platforms.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  {getPlatformIcon(p.type)}{p.label}
                  {p.status === 'available' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></span> : <span className="text-[10px] text-slate-600 font-bold">(Soon)</span>}
                </div>
              ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDetail(); }} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20 text-sm">
              Lihat Detail Produk <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="relative bg-slate-800/50 flex items-center justify-center p-6 md:p-8 min-h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          {product.mockupImage && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
              <div className="flex gap-1.5 p-3 bg-slate-900/80">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
              </div>
              <img src={product.mockupImage} alt={`Tampilan ${product.name}`} className="w-full object-cover bg-slate-800" loading="lazy" decoding="async" onError={(e) => { if (product.mockupFallback) (e.currentTarget as HTMLImageElement).src = product.mockupFallback; }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Regular Product Card ──────────────────────────────────────────────────────
function ProductCard({ product, onDetail }: { product: Product; onDetail: () => void }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[28px] p-8 group hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 flex flex-col justify-between cursor-pointer" onClick={onDetail}>
      <div className="absolute top-5 right-5 px-2.5 py-1 bg-slate-700/80 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Coming Soon</div>
      <div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${getCategoryStyle(product.categoryType)}`}>{getCategoryIcon(product.categoryType)} {product.category}</div>
        <h3 className="text-xl font-black text-white mb-2">{product.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDetail(); }} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm group/btn">
        Lihat Info <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('sort_order', { ascending: true }),
      supabase.from('site_content').select('*'),
    ]).then(([{ data: productData }, { data: contentData }]) => {
      if (productData) setProducts((productData as DBProduct[]).map(dbToProduct));
      if (contentData) {
        const map: Partial<SiteContent & { theme: Theme }> = {};
        for (const row of contentData as { key: string; value: unknown }[]) {
          if (row.key === 'settings') map.settings = row.value as SiteSettings;
          if (row.key === 'hero') map.hero = row.value as HeroContent;
          if (row.key === 'social_proof') map.socialProof = row.value as SocialProofData;
          if (row.key === 'pricing') map.pricing = row.value as PricingData;
          if (row.key === 'faqs') map.faqs = row.value as FaqItem[];
          if (row.key === 'theme') applyTheme(row.value as Theme);
        }
        setContent(prev => ({ ...prev, ...map }));
      }
      setLoading(false);
    });
  }, []);

  const handleOpenDetail = (id: string) => { setSelectedProductId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleBack = () => { setSelectedProductId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const featuredProduct = products.find(p => p.featured);
  const otherProducts = products.filter(p => !p.featured);
  const waUrl = `https://wa.me/${content.settings.waNumber}?text=${content.settings.waDefaultMessage}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-inter text-slate-200 selection:bg-amber-500/30 overflow-x-hidden relative">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={handleBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="font-black text-lg tracking-tight text-white leading-none block">{content.settings.brandName.split(' ').slice(0, 2).join(' ')}</span>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">{content.settings.brandName.split(' ').slice(2).join(' ')}</span>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="hidden md:inline-block text-sm font-bold text-slate-400 hover:text-white transition-colors">Produk</button>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
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
          {/* HERO */}
          <section className="relative pt-36 pb-20 md:pt-52 md:pb-28 px-6 flex flex-col items-center">
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/15 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-5 duration-700 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {content.hero.badge}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
                {content.hero.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{content.hero.titleHighlight}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">{content.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <a href="#produk" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  {content.hero.ctaPrimary} <ChevronRight size={18} />
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> {content.hero.ctaSecondary}
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider opacity-80">
                {content.hero.trustItems.map((item, i) => {
                  const Icon = TRUST_ICONS[i] ?? Lock;
                  return <div key={i} className="flex items-center gap-2"><Icon size={16} className="text-amber-500" /> {item}</div>;
                })}
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <SocialProof content={content.socialProof} />

          {/* PRODUK */}
          <section id="produk" className="py-24 px-6 relative z-10 bg-black/20 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Katalog Produk</p>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Produk & Layanan Kami</h2>
                <p className="text-slate-400 font-medium max-w-2xl mx-auto">Dari aplikasi manajemen hingga konten edukatif—solusi digital lengkap untuk kebutuhan Anda.</p>
              </div>
              {featuredProduct && <div className="mb-8"><FeaturedProductCard product={featuredProduct} onDetail={() => handleOpenDetail(featuredProduct.id)} /></div>}
              {otherProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProducts.map(p => <ProductCard key={p.id} product={p} onDetail={() => handleOpenDetail(p.id)} />)}
                  <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[28px] p-8 flex flex-col items-center justify-center text-center min-h-[200px] gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600"><Layers size={24} /></div>
                    <p className="text-slate-600 font-bold text-sm">Produk Berikutnya</p>
                    <p className="text-slate-700 text-xs">Sedang dalam pengembangan</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* PRICING */}
          <PricingSection content={content.pricing} faqs={content.faqs} />

          {/* CTA */}
          <section className="py-24 px-6 relative z-10">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-10 md:p-16 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Ada Ide Produk Digital?</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Kami terbuka untuk kolaborasi, custom development, atau konsultasi seputar transformasi digital bisnis Anda.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 flex items-center gap-2">
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
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Layers size={16} strokeWidth={2.5} /></div>
                <div>
                  <span className="font-black text-sm text-white leading-none block mb-1">{content.settings.brandName}</span>
                  <span className="text-slate-500 text-xs block">{content.settings.brandTagline}</span>
                  <span className="text-slate-600 text-xs block mt-0.5">{content.settings.address}</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-slate-500 text-sm font-medium text-center md:text-right">
                  © 2026 {content.settings.brandName}. {content.settings.footerText}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <a href="#" className="hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
                  <span>·</span>
                  <a href="#" className="hover:text-slate-400 transition-colors">Syarat & Ketentuan</a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* WHATSAPP BUTTON */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3">
        <div className="bg-white text-emerald-600 font-black text-[10px] px-4 py-2 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-emerald-100 tracking-widest uppercase relative">
          CHAT US
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-emerald-100"></div>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white p-4 md:p-5 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.4)] hover:bg-emerald-600 hover:scale-110 transition-all duration-300 flex items-center justify-center border-4 border-slate-900">
          <MessageCircle size={28} className="md:w-8 md:h-8" />
        </a>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  if (window.location.pathname === '/admin') return <AdminPanel />;
  return <LandingPage />;
}
