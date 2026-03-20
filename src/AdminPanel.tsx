import { useState, useEffect } from 'react';
import {
  LogIn, LogOut, Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp,
  Layers, ShieldCheck, Eye, EyeOff, ArrowLeft, Loader2, Package, FileText, Palette,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { applyTheme, DEFAULT_THEME, FONT_OPTIONS, BG_PRESETS, RADIUS_PRESETS } from './lib/applyTheme';
import type { Theme } from './lib/applyTheme';
import type { Product, Platform, Feature, ProductImage, ProductVideo } from './types';
import type {
  SiteContent, SiteSettings, HeroContent, SocialProofData,
  PricingData, PricingPlan, FaqItem, StatItem, TestimonialItem,
} from './App';

// ── DB mapping ────────────────────────────────────────────────────────────────
interface DBProduct {
  id: string; name: string; tagline: string; description: string;
  category: string; category_type: string; status: string; featured: boolean;
  mockup_image: string | null; mockup_fallback: string | null;
  platforms: Platform[]; features: Feature[]; images: ProductImage[]; videos: ProductVideo[];
  sort_order: number;
}
function dbToProduct(row: DBProduct): Product {
  return { id: row.id, name: row.name, tagline: row.tagline, description: row.description, category: row.category, categoryType: row.category_type, status: row.status as 'available' | 'coming_soon', featured: row.featured, mockupImage: row.mockup_image, mockupFallback: row.mockup_fallback, platforms: row.platforms ?? [], features: row.features ?? [], images: row.images ?? [], videos: row.videos ?? [] };
}
function productToDB(p: Product, sortOrder = 0): DBProduct {
  return { id: p.id, name: p.name, tagline: p.tagline, description: p.description, category: p.category, category_type: p.categoryType, status: p.status, featured: p.featured, mockup_image: p.mockupImage, mockup_fallback: p.mockupFallback, platforms: p.platforms, features: p.features, images: p.images, videos: p.videos, sort_order: sortOrder };
}
function emptyProduct(): Product {
  return { id: '', name: '', tagline: '', description: '', category: '', categoryType: 'management', status: 'coming_soon', featured: false, mockupImage: null, mockupFallback: null, platforms: [], features: [], images: [], videos: [] };
}

// ── Reusable field components ─────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
    </div>
  );
}
function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-all resize-none placeholder:text-slate-600" />
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-black text-white text-sm uppercase tracking-widest">{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError('Email atau password salah.'); else onLogin();
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20"><Layers size={24} strokeWidth={2.5} /></div>
          <div><span className="font-black text-xl text-white leading-none block">Alfa Digital</span><span className="text-amber-500 text-xs font-black uppercase tracking-widest">Admin Panel</span></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">
          <h1 className="text-2xl font-black text-white mb-2">Login Admin</h1>
          <p className="text-slate-400 text-sm mb-8">Masuk untuk mengelola konten landing page.</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field label="Email" value={email} onChange={setEmail} placeholder="admin@example.com" type="email" />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="mt-2 w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}{loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: PRODUK
// ══════════════════════════════════════════════════════════════════════════════

function PlatformEditor({ platforms, onChange }: { platforms: Platform[]; onChange: (v: Platform[]) => void }) {
  const add = () => onChange([...platforms, { label: '', type: 'web', status: 'coming_soon', href: null, cta: 'Segera Hadir' }]);
  const remove = (i: number) => onChange(platforms.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Platform, value: string | boolean | null) => { const u = [...platforms]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {platforms.map((p, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Platform {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Label" value={p.label} onChange={v => update(i, 'label', v)} />
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label><select value={p.type} onChange={e => update(i, 'type', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"><option value="web">Web</option><option value="android">Android</option><option value="ios">iOS</option><option value="download">Download</option></select></div>
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label><select value={p.status} onChange={e => update(i, 'status', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"><option value="available">Available</option><option value="coming_soon">Coming Soon</option></select></div>
            <Field label="CTA Text" value={p.cta} onChange={v => update(i, 'cta', v)} />
          </div>
          <Field label="Link (href)" value={p.href ?? ''} onChange={v => update(i, 'href', v || null)} placeholder="https://..." />
          {p.type === 'android' && (<>
            <Field label="Link Pembelian (Mayar)" value={p.purchaseHref ?? ''} onChange={v => update(i, 'purchaseHref', v || null)} placeholder="https://..." />
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={!!p.requiresSubscription} onChange={e => update(i, 'requiresSubscription', e.target.checked)} className="accent-amber-500" />Wajib berlangganan sebelum download</label>
          </>)}
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Platform</button>
    </div>
  );
}

function FeatureEditor({ features, onChange }: { features: Feature[]; onChange: (v: Feature[]) => void }) {
  const ICONS = ['ShieldCheck', 'Clock', 'CreditCard', 'Users', 'Briefcase', 'Lock', 'Cloud', 'Database', 'BookOpen', 'Video', 'Layers', 'Award', 'Bell', 'FileText', 'MessageSquare', 'Settings', 'Zap', 'Globe', 'Smartphone'];
  const COLORS = ['blue', 'rose', 'emerald', 'amber', 'violet', 'slate'];
  const add = () => onChange([...features, { icon: 'ShieldCheck', color: 'blue', title: '', description: '' }]);
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Feature, value: string) => { const u = [...features]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {features.map((f, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Fitur {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Icon</label><select value={f.icon} onChange={e => update(i, 'icon', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">{ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warna</label><select value={f.color} onChange={e => update(i, 'color', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">{COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <Field label="Judul Fitur" value={f.title} onChange={v => update(i, 'title', v)} />
          <TextArea label="Deskripsi" value={f.description} onChange={v => update(i, 'description', v)} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Fitur</button>
    </div>
  );
}

function ImageEditor({ images, onChange }: { images: ProductImage[]; onChange: (v: ProductImage[]) => void }) {
  const add = () => onChange([...images, { src: '', alt: '', label: '', caption: '' }]);
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ProductImage, value: string) => { const u = [...images]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {images.map((img, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Gambar {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <Field label="Label" value={img.label ?? ''} onChange={v => update(i, 'label', v)} />
          <Field label="URL / Path Gambar" value={img.src} onChange={v => update(i, 'src', v)} placeholder="/mockup.png atau https://..." />
          <Field label="Alt Text" value={img.alt} onChange={v => update(i, 'alt', v)} />
          <Field label="Caption" value={img.caption ?? ''} onChange={v => update(i, 'caption', v)} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Gambar</button>
    </div>
  );
}

function VideoEditor({ videos, onChange }: { videos: ProductVideo[]; onChange: (v: ProductVideo[]) => void }) {
  const add = () => onChange([...videos, { youtubeId: '', title: '', label: '', description: '' }]);
  const remove = (i: number) => onChange(videos.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ProductVideo, value: string) => { const u = [...videos]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {videos.map((v, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Video {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <Field label="YouTube Video ID" value={v.youtubeId ?? ''} onChange={val => update(i, 'youtubeId', val)} placeholder="dQw4w9WgXcQ" />
          <Field label="Label" value={v.label ?? ''} onChange={val => update(i, 'label', val)} />
          <Field label="Judul Video" value={v.title} onChange={val => update(i, 'title', val)} />
          <Field label="Deskripsi" value={v.description ?? ''} onChange={val => update(i, 'description', val)} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Video</button>
    </div>
  );
}

function ProductEditor({ product, onSave, onCancel, isNew }: { product: Product; onSave: (p: Product) => Promise<void>; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState<Product>({ ...product, platforms: [...product.platforms], features: [...product.features], images: [...product.images], videos: [...product.videos] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (field: keyof Product, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));
  const handleSave = async () => {
    if (!form.id.trim()) { setError('ID produk wajib diisi.'); return; }
    if (!form.name.trim()) { setError('Nama produk wajib diisi.'); return; }
    setSaving(true); setError('');
    try { await onSave(form); } catch { setError('Gagal menyimpan. Coba lagi.'); }
    setSaving(false);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold group"><ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali</button>
        <h2 className="text-xl font-black text-white">{isNew ? 'Produk Baru' : `Edit: ${product.name}`}</h2>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
      <Section title="Informasi Dasar">
        <Field label="ID Produk (unik, tanpa spasi)" value={form.id} onChange={v => set('id', v.toLowerCase().replace(/\s+/g, '-'))} placeholder="adc-notary" />
        <Field label="Nama Produk" value={form.name} onChange={v => set('name', v)} />
        <Field label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} />
        <TextArea label="Deskripsi" value={form.description} onChange={v => set('description', v)} rows={4} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori (tampil)" value={form.category} onChange={v => set('category', v)} />
          <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipe Kategori</label><select value={form.categoryType} onChange={e => set('categoryType', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"><option value="management">management</option><option value="education">education</option><option value="content">content</option></select></div>
          <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label><select value={form.status} onChange={e => set('status', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"><option value="available">Available</option><option value="coming_soon">Coming Soon</option></select></div>
          <div className="flex flex-col gap-1 justify-end"><label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer py-2"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-amber-500 w-4 h-4" />Produk Unggulan</label></div>
        </div>
      </Section>
      <Section title="Gambar Mockup (Hero)">
        <Field label="Path/URL Mockup Utama" value={form.mockupImage ?? ''} onChange={v => set('mockupImage', v || null)} placeholder="/mockup.png" />
        <Field label="URL Fallback" value={form.mockupFallback ?? ''} onChange={v => set('mockupFallback', v || null)} placeholder="https://..." />
      </Section>
      <Section title="Platform & Link Download"><PlatformEditor platforms={form.platforms} onChange={v => set('platforms', v)} /></Section>
      <Section title="Fitur Unggulan"><FeatureEditor features={form.features} onChange={v => set('features', v)} /></Section>
      <Section title="Screenshot / Gambar Produk"><ImageEditor images={form.images} onChange={v => set('images', v)} /></Section>
      <Section title="Video Tutorial"><VideoEditor videos={form.videos} onChange={v => set('videos', v)} /></Section>
      <div className="flex gap-3 sticky bottom-0 bg-slate-900/95 backdrop-blur-md py-4 border-t border-white/10 -mx-6 px-6">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm transition-all"><X size={16} /> Batal</button>
      </div>
    </div>
  );
}

function ProductTab({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'edit' | 'new'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (data) setProducts((data as DBProduct[]).map(dbToProduct));
    setLoading(false);
  };
  useEffect(() => { loadProducts(); }, []);

  const handleSave = async (p: Product) => {
    const sortOrder = view === 'new' ? products.length + 1 : products.findIndex(x => x.id === p.id) + 1;
    if (view === 'new') { const { error } = await supabase.from('products').insert(productToDB(p, sortOrder)); if (error) throw error; }
    else { const { error } = await supabase.from('products').update(productToDB(p, sortOrder)).eq('id', p.id); if (error) throw error; }
    await loadProducts(); setView('list'); setEditingProduct(null);
  };
  const handleDelete = async (id: string) => { await supabase.from('products').delete().eq('id', id); await loadProducts(); setConfirmDelete(null); };

  if (view !== 'list') return <ProductEditor product={editingProduct!} onSave={handleSave} onCancel={() => { setView('list'); setEditingProduct(null); }} isNew={view === 'new'} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-white">Produk</h1><p className="text-slate-400 text-sm">Kelola daftar produk landing page</p></div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditingProduct(emptyProduct()); setView('new'); }} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all"><Plus size={16} /> Produk Baru</button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl font-bold text-sm transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-amber-200/80 text-sm">Perubahan yang disimpan akan <strong>langsung tampil</strong> di landing page tanpa perlu deploy ulang.</p>
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-amber-500 animate-spin" /></div> : (
        <div className="flex flex-col gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-white">{p.name}</h3>
                  {p.featured && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">Unggulan</span>}
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${p.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>{p.status === 'available' ? 'Live' : 'Coming Soon'}</span>
                </div>
                <p className="text-slate-400 text-sm truncate">{p.tagline}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { setEditingProduct(p); setView('edit'); }} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all"><Pencil size={14} /> Edit</button>
                <button onClick={() => confirmDelete === p.id ? handleDelete(p.id) : setConfirmDelete(p.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${confirmDelete === p.id ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 hover:bg-red-500/10 border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30'}`}>
                  <Trash2 size={14} />{confirmDelete === p.id ? 'Yakin?' : 'Hapus'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: KONTEN HALAMAN
// ══════════════════════════════════════════════════════════════════════════════

function StatEditor({ stats, onChange }: { stats: StatItem[]; onChange: (v: StatItem[]) => void }) {
  const ICONS = ['Users', 'FileText', 'Cloud', 'Clock', 'Star', 'CheckCircle2', 'Briefcase', 'Award', 'Zap'];
  const add = () => onChange([...stats, { icon: 'Users', value: '0+', label: '' }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof StatItem, value: string) => { const u = [...stats]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Statistik {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Icon</label><select value={s.icon} onChange={e => update(i, 'icon', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-2 py-2 text-white text-xs outline-none">{ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <Field label="Nilai" value={s.value} onChange={v => update(i, 'value', v)} placeholder="15+" />
            <Field label="Label" value={s.label} onChange={v => update(i, 'label', v)} placeholder="Kantor Terdaftar" />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Statistik</button>
    </div>
  );
}

function TestimonialEditor({ testimonials, onChange }: { testimonials: TestimonialItem[]; onChange: (v: TestimonialItem[]) => void }) {
  const add = () => onChange([...testimonials, { name: '', role: '', quote: '', initial: '' }]);
  const remove = (i: number) => onChange(testimonials.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof TestimonialItem, value: string) => { const u = [...testimonials]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Testimoni {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3"><Field label="Nama" value={t.name} onChange={v => update(i, 'name', v)} /></div>
            <Field label="Inisial" value={t.initial} onChange={v => update(i, 'initial', v)} placeholder="A" />
          </div>
          <Field label="Jabatan / Kantor" value={t.role} onChange={v => update(i, 'role', v)} placeholder="Notaris — Kota" />
          <TextArea label="Kutipan" value={t.quote} onChange={v => update(i, 'quote', v)} rows={2} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Testimoni</button>
    </div>
  );
}

function PlanEditor({ plans, onChange }: { plans: PricingPlan[]; onChange: (v: PricingPlan[]) => void }) {
  const add = () => onChange([...plans, { name: '', price: '', period: '/bulan', desc: '', features: [], cta: 'Mulai Sekarang', href: '', primary: false, popular: false }]);
  const remove = (i: number) => onChange(plans.filter((_, idx) => idx !== i));
  const updateField = (i: number, field: keyof PricingPlan, value: unknown) => { const u = [...plans]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  const updateFeature = (pi: number, fi: number, value: string) => { const u = [...plans]; u[pi].features[fi] = value; onChange(u); };
  const addFeature = (pi: number) => { const u = [...plans]; u[pi].features.push(''); onChange(u); };
  const removeFeature = (pi: number, fi: number) => { const u = [...plans]; u[pi].features = u[pi].features.filter((_, idx) => idx !== fi); onChange(u); };
  return (
    <div className="flex flex-col gap-4">
      {plans.map((plan, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">Paket {i + 1}: {plan.name}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Nama Paket" value={plan.name} onChange={v => updateField(i, 'name', v)} />
            <Field label="Harga" value={plan.price} onChange={v => updateField(i, 'price', v)} placeholder="Rp 99.000" />
            <Field label="Periode" value={plan.period} onChange={v => updateField(i, 'period', v)} placeholder="/bulan" />
            <Field label="CTA Button" value={plan.cta} onChange={v => updateField(i, 'cta', v)} />
          </div>
          <Field label="Deskripsi Singkat" value={plan.desc} onChange={v => updateField(i, 'desc', v)} />
          <Field label="Link Tombol (href)" value={plan.href} onChange={v => updateField(i, 'href', v)} placeholder="https://..." />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={plan.primary} onChange={e => updateField(i, 'primary', e.target.checked)} className="accent-amber-500" />Tombol Utama (kuning)</label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={plan.popular} onChange={e => updateField(i, 'popular', e.target.checked)} className="accent-amber-500" />Paling Populer</label>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fitur Termasuk</p>
            <div className="flex flex-col gap-2">
              {plan.features.map((f, fi) => (
                <div key={fi} className="flex gap-2">
                  <input value={f} onChange={e => updateFeature(i, fi, e.target.value)} placeholder={`Fitur ${fi + 1}`} className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                  <button onClick={() => removeFeature(i, fi)} className="text-slate-500 hover:text-red-400 transition-colors px-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => addFeature(i)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"><Plus size={12} /> Tambah Fitur</button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah Paket Harga</button>
    </div>
  );
}

function FaqEditor({ faqs, onChange }: { faqs: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  const add = () => onChange([...faqs, { q: '', a: '' }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'q' | 'a', value: string) => { const u = [...faqs]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between"><span className="text-xs font-black text-amber-400 uppercase tracking-widest">FAQ {i + 1}</span><button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
          <Field label="Pertanyaan" value={faq.q} onChange={v => update(i, 'q', v)} />
          <TextArea label="Jawaban" value={faq.a} onChange={v => update(i, 'a', v)} rows={2} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-bold"><Plus size={16} /> Tambah FAQ</button>
    </div>
  );
}

function ContentTab() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) {
        const map: Partial<SiteContent> = {};
        for (const row of data as { key: string; value: unknown }[]) {
          if (row.key === 'settings') map.settings = row.value as SiteSettings;
          if (row.key === 'hero') map.hero = row.value as HeroContent;
          if (row.key === 'social_proof') map.socialProof = row.value as SocialProofData;
          if (row.key === 'pricing') map.pricing = row.value as PricingData;
          if (row.key === 'faqs') map.faqs = row.value as FaqItem[];
        }
        setContent(map as SiteContent);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    await Promise.all([
      supabase.from('site_content').upsert({ key: 'settings', value: content.settings }),
      supabase.from('site_content').upsert({ key: 'hero', value: content.hero }),
      supabase.from('site_content').upsert({ key: 'social_proof', value: content.socialProof }),
      supabase.from('site_content').upsert({ key: 'pricing', value: content.pricing }),
      supabase.from('site_content').upsert({ key: 'faqs', value: content.faqs }),
    ]);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setContent(prev => prev ? { ...prev, [key]: value } : prev);

  if (loading || !content) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-amber-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-white">Konten Halaman</h1><p className="text-slate-400 text-sm">Edit seluruh teks dan data di landing page</p></div>
      </div>

      {/* Pengaturan Umum */}
      <Section title="⚙️ Pengaturan Umum">
        <Field label="Nama Brand" value={content.settings.brandName} onChange={v => set('settings', { ...content.settings, brandName: v })} />
        <Field label="Tagline Brand" value={content.settings.brandTagline} onChange={v => set('settings', { ...content.settings, brandTagline: v })} />
        <Field label="Nomor WhatsApp (tanpa +)" value={content.settings.waNumber} onChange={v => set('settings', { ...content.settings, waNumber: v })} placeholder="6282132752200" />
        <Field label="Pesan WA Default (URL encoded)" value={content.settings.waDefaultMessage} onChange={v => set('settings', { ...content.settings, waDefaultMessage: v })} />
        <Field label="Alamat" value={content.settings.address} onChange={v => set('settings', { ...content.settings, address: v })} />
        <Field label="Teks Footer" value={content.settings.footerText} onChange={v => set('settings', { ...content.settings, footerText: v })} />
      </Section>

      {/* Hero */}
      <Section title="🚀 Hero Section (Headline Utama)">
        <Field label="Badge Atas" value={content.hero.badge} onChange={v => set('hero', { ...content.hero, badge: v })} />
        <Field label="Judul Baris 1" value={content.hero.title} onChange={v => set('hero', { ...content.hero, title: v })} />
        <Field label="Judul Baris 2 (warna aksen)" value={content.hero.titleHighlight} onChange={v => set('hero', { ...content.hero, titleHighlight: v })} />
        <TextArea label="Subjudul / Deskripsi" value={content.hero.subtitle} onChange={v => set('hero', { ...content.hero, subtitle: v })} />
        <Field label="Teks Tombol Utama" value={content.hero.ctaPrimary} onChange={v => set('hero', { ...content.hero, ctaPrimary: v })} />
        <Field label="Teks Tombol Sekunder" value={content.hero.ctaSecondary} onChange={v => set('hero', { ...content.hero, ctaSecondary: v })} />
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trust Items (3 baris di bawah tombol)</p>
          {content.hero.trustItems.map((item, i) => (
            <div key={i} className="mb-2">
              <Field label={`Item ${i + 1}`} value={item} onChange={v => { const u = [...content.hero.trustItems]; u[i] = v; set('hero', { ...content.hero, trustItems: u }); }} />
            </div>
          ))}
        </div>
      </Section>

      {/* Social Proof */}
      <Section title="🏆 Dipercaya Profesional (Statistik)">
        <Field label="Badge" value={content.socialProof.badge} onChange={v => set('socialProof', { ...content.socialProof, badge: v })} />
        <Field label="Judul Section" value={content.socialProof.title} onChange={v => set('socialProof', { ...content.socialProof, title: v })} />
        <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Statistik</p><StatEditor stats={content.socialProof.stats} onChange={v => set('socialProof', { ...content.socialProof, stats: v })} /></div>
      </Section>

      {/* Testimoni */}
      <Section title="💬 Testimoni">
        <TestimonialEditor testimonials={content.socialProof.testimonials} onChange={v => set('socialProof', { ...content.socialProof, testimonials: v })} />
      </Section>

      {/* Pricing */}
      <Section title="💰 Harga & Paket">
        <Field label="Badge" value={content.pricing.badge} onChange={v => set('pricing', { ...content.pricing, badge: v })} />
        <Field label="Judul Section" value={content.pricing.title} onChange={v => set('pricing', { ...content.pricing, title: v })} />
        <Field label="Subjudul" value={content.pricing.subtitle} onChange={v => set('pricing', { ...content.pricing, subtitle: v })} />
        <PlanEditor plans={content.pricing.plans} onChange={v => set('pricing', { ...content.pricing, plans: v })} />
      </Section>

      {/* FAQ */}
      <Section title="❓ Pertanyaan Umum (FAQ)">
        <FaqEditor faqs={content.faqs} onChange={v => set('faqs', v)} />
      </Section>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">Pastikan semua perubahan sudah benar sebelum menyimpan.</p>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saved ? '✓ Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: TEMA
// ══════════════════════════════════════════════════════════════════════════════

function ThemeTab() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'theme').single().then(({ data }) => {
      if (data) setTheme(data.value as Theme);
      setLoading(false);
    });
  }, []);

  const set = (field: keyof Theme, value: string) => setTheme(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('site_content').upsert({ key: 'theme', value: theme });
    applyTheme(theme);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePreview = () => { applyTheme(theme); };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-amber-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-white">Tema & Tampilan</h1><p className="text-slate-400 text-sm">Ubah warna, font, dan gaya seluruh landing page</p></div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 text-amber-200/80 text-sm">
        Klik <strong>Preview</strong> untuk melihat perubahan sementara di halaman ini. Klik <strong>Simpan Tema</strong> agar berlaku permanen di landing page.
      </div>

      {/* Warna Aksen */}
      <Section title="🎨 Warna Aksen (Warna Utama)">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Warna</label>
            <input type="color" value={theme.accentColor} onChange={e => set('accentColor', e.target.value)} className="w-16 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
          </div>
          <Field label="Kode Hex" value={theme.accentColor} onChange={v => set('accentColor', v)} placeholder="#f59e0b" />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warna Gelap (hover)</label>
            <input type="color" value={theme.accentColorDark} onChange={e => set('accentColorDark', e.target.value)} className="w-16 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
          </div>
          <Field label="Kode Hex Gelap" value={theme.accentColorDark} onChange={v => set('accentColorDark', v)} placeholder="#d97706" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preset Warna Populer</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Amber (default)', acc: '#f59e0b', dk: '#d97706' },
              { label: 'Blue', acc: '#3b82f6', dk: '#2563eb' },
              { label: 'Emerald', acc: '#10b981', dk: '#059669' },
              { label: 'Violet', acc: '#8b5cf6', dk: '#7c3aed' },
              { label: 'Rose', acc: '#f43f5e', dk: '#e11d48' },
              { label: 'Cyan', acc: '#06b6d4', dk: '#0891b2' },
              { label: 'Orange', acc: '#f97316', dk: '#ea580c' },
            ].map(preset => (
              <button key={preset.label} onClick={() => { set('accentColor', preset.acc); set('accentColorDark', preset.dk); }} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.acc }}></span>{preset.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Background */}
      <Section title="🌙 Warna Background">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Warna</label>
            <input type="color" value={theme.bgMain} onChange={e => set('bgMain', e.target.value)} className="w-16 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
          </div>
          <Field label="Kode Hex Background" value={theme.bgMain} onChange={v => set('bgMain', v)} placeholder="#0f172a" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preset Background</p>
          <div className="flex flex-wrap gap-2">
            {BG_PRESETS.map(preset => (
              <button key={preset.label} onClick={() => set('bgMain', preset.value)} className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-bold text-slate-300 transition-all ${theme.bgMain === preset.value ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}>
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: preset.value }}></span>{preset.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Font */}
      <Section title="🔤 Font (Huruf)">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Font Judul (Heading)</label>
            <select value={theme.fontHeading} onChange={e => set('fontHeading', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-xs text-slate-500" style={{ fontFamily: theme.fontHeading }}>Preview: Judul Halaman</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Font Isi (Body)</label>
            <select value={theme.fontBody} onChange={e => set('fontBody', e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-xs text-slate-500" style={{ fontFamily: theme.fontBody }}>Preview: Teks deskripsi dan isi konten halaman.</p>
          </div>
        </div>
      </Section>

      {/* Border Radius */}
      <Section title="⬜ Gaya Sudut Kartu (Border Radius)">
        <div className="flex flex-wrap gap-3">
          {RADIUS_PRESETS.map(preset => (
            <button key={preset.label} onClick={() => set('borderRadius', preset.value)} className={`flex flex-col items-center gap-2 px-6 py-4 border rounded-xl text-sm font-bold transition-all ${theme.borderRadius === preset.value ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'}`}>
              <div className="w-10 h-10 bg-amber-500/30 border border-amber-500/40" style={{ borderRadius: preset.value }}></div>
              {preset.label}
              <span className="text-xs text-slate-500">{preset.value}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button onClick={handlePreview} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm transition-all">
            👁 Preview Perubahan
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saved ? '✓ Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan Tema'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'theme'>('products');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setLoggedIn(!!data.session); setChecking(false); });
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setLoggedIn(false); };

  if (checking) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 size={32} className="text-amber-500 animate-spin" /></div>;
  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const TABS = [
    { key: 'products' as const, label: 'Produk', icon: Package },
    { key: 'content' as const, label: 'Konten Halaman', icon: FileText },
    { key: 'theme' as const, label: 'Tema', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white"><Layers size={16} strokeWidth={2.5} /></div>
            <span className="font-black text-white text-sm">Admin Panel <span className="text-slate-600">— Alfa Digital Communica</span></span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-bold">Lihat Landing Page →</a>
        </div>
        {/* Tab Bar */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-3">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon size={15} />{tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === 'products' && <ProductTab onLogout={handleLogout} />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'theme' && <ThemeTab />}
      </div>
    </div>
  );
}
