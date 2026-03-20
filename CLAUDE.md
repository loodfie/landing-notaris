# CLAUDE.md — Landing Page Alfa Digital Communica

## Overview
Landing page multi-produk untuk **Alfa Digital Communica (ADC)**. Dibangun dengan React + Vite + Tailwind CSS, backend Supabase, dan admin panel terintegrasi di `/admin`.

## Tech Stack
- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v3**
- **Supabase** (PostgreSQL + Auth + RLS)
- **lucide-react** untuk ikon
- Deploy di **Vercel** → `landing-notaris.vercel.app`

## Struktur File Penting
```
src/
  App.tsx           — Landing page utama, fetch data dari Supabase
  AdminPanel.tsx    — Admin panel (route /admin), login Supabase Auth
  ProductDetail.tsx — Halaman detail produk
  types.ts          — TypeScript interfaces (Product, Platform, Feature, dll)
  lib/
    supabase.ts     — Supabase client (pakai VITE_ env vars)
    applyTheme.ts   — CSS variable theme engine (accent, bg, font, radius)
public/
  products.json     — Data fallback (tidak dipakai, Supabase adalah sumber utama)
  logo-adc.svg      — Logo ADC
  banner-adc.svg    — Banner ADC
vercel.json         — SPA rewrites untuk React Router
```

## Environment Variables
File `.env.local` **tidak di-commit** (ada di .gitignore). Buat ulang di komputer baru:

```
VITE_SUPABASE_URL=https://uarhjhvaqxondlkjrmxe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcmhqaHZhcXhvbmRsa2pybXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDE3NTUsImV4cCI6MjA4OTUxNzc1NX0.186GylPMqfrd2l0YXd2QGrIQpqh6j_Sssbs3d8Ope70
```

## Setup di Komputer Baru
```bash
git clone https://github.com/loodfie/landing-notaris.git
cd landing-notaris
npm install
# Buat file .env.local dengan isi di atas
npm run dev
```

## Supabase Database
- **Project URL**: `https://uarhjhvaqxondlkjrmxe.supabase.co`
- **Tabel utama**:
  - `products` — data produk (JSONB columns: platforms, features, images, videos)
  - `site_content` — konten halaman (hero, social proof, pricing, FAQ, footer, tema)
- **Auth**: Supabase email/password. Buat user admin di Supabase Dashboard → Authentication → Users.
- **RLS**: Aktif. Policy: `auth.uid() is not null` untuk INSERT/UPDATE/DELETE.

## Admin Panel (`/admin`)
- Login dengan email/password Supabase Auth
- 3 tab: **Produk**, **Konten Halaman**, **Tema**
- Auto logout setelah **15 menit tidak aktif**
- Warning banner muncul 2 menit sebelum logout
- Tombol logout di navbar kanan atas

## Theme System
`src/lib/applyTheme.ts` menginjeksi CSS variables ke `:root`:
- `--adc-acc` — accent color (RGB)
- `--adc-acc-dk` — accent dark
- `--adc-bg` — background main
- `--adc-font-h` — font heading
- `--adc-font-b` — font body
- `--adc-radius` — border radius

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build (tsc + vite)
npm run preview  # Preview production build
```

## Deploy
Auto-deploy ke Vercel saat push ke branch `main`.
- Production: `https://landing-notaris.vercel.app`
- Env vars Supabase sudah diset di Vercel Dashboard (tidak perlu set ulang untuk deploy).
