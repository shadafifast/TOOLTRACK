# 🔧 ToolTrack QR — Sistem Manajemen Aset TIK
### PT Semen Padang — Divisi TIK

> Aplikasi web untuk manajemen peminjaman alat dan aset TIK menggunakan sistem QR Code.
> Dibangun dengan **React + TypeScript + Vite + Tailwind CSS**.

---

## 📋 Daftar Isi
- [Tech Stack](#-tech-stack)
- [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)
- [Panduan Kolaborasi Tim Git](#-panduan-kolaborasi-tim-git)
- [Struktur Folder](#-struktur-folder)
- [Panduan Integrasi Back-End](#-panduan-integrasi-back-end)
- [Daftar Endpoint API](#-daftar-endpoint-api-yang-dibutuhkan)
- [Cara Deploy](#-cara-deploy)

---

## 🛠 Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | Framework UI |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| Tailwind CSS | 4.x | Styling |
| React Router | 7.x | Routing |
| Recharts | 2.x | Chart & grafik |
| qrcode | 1.x | Generate QR Code |
| Lucide React | latest | Icon |

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
Pastikan sudah terinstall di komputer Anda:
- **Node.js** versi 18 atau lebih baru → [Download di nodejs.org](https://nodejs.org)
- **Git** → [Download di git-scm.com](https://git-scm.com)
- **VS Code** (direkomendasikan) → [Download di code.visualstudio.com](https://code.visualstudio.com)

### Langkah Pertama Kali (Clone & Setup)

```bash
# 1. Clone repository ini
git clone https://github.com/shadafifast/TOOLTRACK.git

# 2. Masuk ke folder proyek
cd TOOLTRACK

# 3. Install semua dependency
npm install

# 4. Buat file konfigurasi environment
# Salin file .env.example menjadi .env.local
copy .env.example .env.local

# 5. Jalankan development server
npm run dev
```

Buka browser di **http://localhost:5173** 🎉

---

## 👥 Panduan Kolaborasi Tim Git

> **Aturan Utama:** Jangan pernah langsung push ke branch `main`!
> Semua perubahan harus melalui **branch terpisah** dan **Pull Request**.

### 🌿 Struktur Branch

```
main          ← Branch utama yang selalu STABIL (production-ready)
  └── develop ← Branch pengembangan aktif (opsional, bisa langsung ke main)
        ├── feature/login-page        ← Fitur baru
        ├── feature/qr-scanner        ← Fitur baru
        ├── fix/bug-return-form       ← Perbaikan bug
        └── backend/api-integration   ← Integrasi Back-End
```

---

### 📌 Alur Kerja Harian (Wajib Diikuti!)

#### LANGKAH 1 — Selalu update branch lokal Anda sebelum mulai kerja

```bash
# Pindah ke branch main
git checkout main

# Ambil update terbaru dari GitHub
git pull origin main
```

#### LANGKAH 2 — Buat branch baru untuk pekerjaan Anda

```bash
# Format nama branch: feature/nama-fitur atau fix/nama-bug
# Contoh untuk Front-End:
git checkout -b feature/halaman-profil-karyawan

# Contoh untuk Back-End:
git checkout -b backend/api-endpoint-tools

# Contoh untuk perbaikan bug:
git checkout -b fix/qr-scanner-tidak-muncul
```

#### LANGKAH 3 — Kerjakan & simpan perubahan secara rutin

```bash
# Lihat file apa saja yang berubah
git status

# Tambahkan file yang mau di-commit
# Cara 1: Tambah semua file sekaligus
git add .

# Cara 2: Tambah file tertentu saja (lebih aman)
git add src/app/pages/ProfilePage.tsx

# Simpan perubahan dengan pesan yang jelas
git commit -m "feat: tambah halaman profil karyawan"
```

> **Tips menulis pesan commit yang baik:**
> - `feat:` → fitur baru
> - `fix:` → perbaikan bug
> - `style:` → perubahan tampilan/CSS
> - `refactor:` → perbaikan kode tanpa mengubah fungsi
> - `docs:` → perubahan dokumentasi
> - `chore:` → update dependency, konfigurasi

#### LANGKAH 4 — Upload branch Anda ke GitHub

```bash
# Upload branch ke GitHub (lakukan ini setiap selesai kerja)
git push origin feature/halaman-profil-karyawan
```

#### LANGKAH 5 — Buat Pull Request (PR) di GitHub

1. Buka **https://github.com/shadafifast/TOOLTRACK**
2. Klik tombol **"Compare & pull request"** yang muncul di bagian atas
3. Isi judul dan deskripsi PR dengan jelas:
   - **Judul:** `[Feature] Tambah halaman profil karyawan`
   - **Deskripsi:** Jelaskan apa yang berubah dan kenapa
4. Pilih reviewer (minta teman satu tim untuk review)
5. Klik **"Create pull request"**

#### LANGKAH 6 — Review & Merge

- Anggota tim lain **wajib review** sebelum PR di-merge
- Jika ada komentar/perubahan yang diminta → perbaiki, commit lagi, push lagi
- Setelah di-approve → klik **"Merge pull request"**

---

### 🚨 Skenario Umum & Solusinya

#### ❓ "Ada konflik saat pull/merge (conflict)"

Konflik terjadi ketika 2 orang mengubah file yang sama. Cara menyelesaikannya:

```bash
# 1. Update dulu branch main
git checkout main
git pull origin main

# 2. Kembali ke branch Anda dan merge dari main
git checkout feature/nama-branch-anda
git merge main

# 3. Git akan menandai file yang konflik dengan tanda <<<, ===, >>>
# Buka file tersebut di VS Code → pilih perubahan mana yang dipakai
# VS Code punya tombol "Accept Current Change" / "Accept Incoming Change"

# 4. Setelah konflik diselesaikan, commit hasilnya
git add .
git commit -m "fix: selesaikan konflik merge dengan main"
git push origin feature/nama-branch-anda
```

#### ❓ "Salah commit ke branch main langsung"

```bash
# Batalkan commit terakhir (file tetap ada, hanya commit yang dibatalkan)
git reset HEAD~1

# Buat branch baru dari sini
git checkout -b feature/perbaikan-yang-salah-branch

# Lanjutkan seperti biasa
git add .
git commit -m "feat: ..."
git push origin feature/perbaikan-yang-salah-branch
```

#### ❓ "Ingin melihat riwayat commit"

```bash
# Tampilkan log commit secara ringkas
git log --oneline --graph

# Tampilkan siapa yang mengubah apa
git log --pretty=format:"%h %an %s" --graph
```

#### ❓ "Ingin membatalkan perubahan yang belum di-commit"

```bash
# Batalkan perubahan pada satu file
git checkout -- src/app/pages/LoginPage.tsx

# Batalkan SEMUA perubahan yang belum di-commit (hati-hati!)
git checkout -- .
```

---

### 📋 Checklist Sebelum Push / Pull Request

Pastikan semua ini terpenuhi sebelum push ke GitHub:

- [ ] Aplikasi bisa dijalankan (`npm run dev`) tanpa error di terminal
- [ ] Build berhasil (`npm run build`) tanpa error
- [ ] Tidak ada file `.env.local` yang ikut ter-commit (cek dengan `git status`)
- [ ] Tidak ada folder `node_modules/` yang ikut ter-commit
- [ ] Pesan commit sudah jelas dan deskriptif
- [ ] Kode sudah rapi (tidak ada `console.log` debug yang tertinggal)

---

### 👤 Setup Git untuk Anggota Tim Baru

Jalankan ini sekali saja saat pertama kali menggunakan Git di komputer:

```bash
# Isi dengan nama dan email GitHub Anda
git config --global user.name "Nama Lengkap Anda"
git config --global user.email "email.github.anda@gmail.com"

# Verifikasi
git config --global --list
```

---

## 📁 Struktur Folder

```
TOOLTRACK/
├── public/                        # File statis (favicon, dll)
├── src/
│   └── app/
│       ├── App.tsx                # Root routing (React Router)
│       │
│       ├── types/
│       │   └── index.ts           # 📌 Tipe data TypeScript (kontrak FE & BE)
│       │
│       ├── data/
│       │   └── mockData.ts        # Data dummy (dipakai sebelum BE siap)
│       │
│       ├── services/              # 🔌 Layer API — EDIT INI untuk sambungkan BE
│       │   ├── api.ts             # Utility fetch + token management
│       │   ├── authService.ts     # Login, register, logout
│       │   ├── toolService.ts     # CRUD alat + QR
│       │   ├── borrowService.ts   # Peminjaman & pengembalian
│       │   ├── employeeService.ts # Data karyawan
│       │   └── index.ts           # Barrel export
│       │
│       ├── layouts/
│       │   └── DashboardLayout.tsx # Shell layout (Sidebar + Header)
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   └── Header.tsx
│       │   └── shared/
│       │       ├── index.tsx       # StatusBadge, QRCodeSVG, BorrowBadge
│       │       └── QRGenerator.tsx # 🆕 Generator QR Code yang bisa di-scan
│       │
│       └── pages/
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── QuickScanPage.tsx
│           ├── DashboardPage.tsx
│           ├── ToolManagementPage.tsx  # ← Tambah Alat + Generate QR
│           ├── ToolDetailPage.tsx
│           ├── QRScanPage.tsx
│           ├── BorrowConfirmPage.tsx
│           ├── ReturnConfirmPage.tsx
│           └── BorrowHistoryPage.tsx
│
├── .env.example                   # Template environment (commit ini)
├── .env.local                     # Konfigurasi lokal (JANGAN di-commit!)
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔌 Panduan Integrasi Back-End

### 3 Langkah Sambungkan Back-End

**Langkah 1** — Set URL Back-End di `.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

**Langkah 2** — Buka file service, hapus MOCK DATA, uncomment REAL API:
```typescript
// src/app/services/toolService.ts

export async function getTools(params) {
  // ❌ HAPUS blok mock ini:
  // const filtered = mockTools.filter(...);
  // return { data: filtered, ... };

  // ✅ UNCOMMENT blok ini:
  return apiCall(`/tools?${q.toString()}`);
}
```

**Langkah 3** — Restart dev server: `npm run dev`

---

## 📡 Daftar Endpoint API yang Dibutuhkan

> Auth Header: `Authorization: Bearer <token>` (semua endpoint kecuali login/register)

### 🔐 Auth
| Method | Endpoint | Body | Respons |
|--------|----------|------|---------|
| `POST` | `/auth/login` | `{ email, password }` | `{ token, user }` |
| `POST` | `/auth/register` | `{ name, email, department, position, phone, password }` | `{ token, user }` |
| `POST` | `/auth/logout` | — | `{ success }` |
| `GET`  | `/auth/me` | — | `Employee` |

### 🔧 Tools (Alat)
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET`    | `/tools?search=&status=&category=&page=&limit=` | Daftar alat |
| `GET`    | `/tools/:id` | Detail alat |
| `POST`   | `/tools` | Tambah alat baru |
| `PUT`    | `/tools/:id` | Update alat |
| `DELETE` | `/tools/:id` | Hapus alat |
| `GET`    | `/tools/:id/history` | Riwayat peminjaman alat |

### 📦 Borrows (Peminjaman)
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET`   | `/borrows?status=&page=&limit=` | Riwayat peminjaman |
| `POST`  | `/borrows` | Buat peminjaman baru |
| `PATCH` | `/borrows/:id/return` | Kembalikan alat |
| `GET`   | `/dashboard/stats` | Statistik untuk Dasbor |
| `GET`   | `/borrows/export?format=csv` | Ekspor laporan |

### 👤 Employees (Karyawan)
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET` | `/employees?search=&department=` | Daftar karyawan |
| `GET` | `/employees/:id` | Detail karyawan |
| `GET` | `/employees/departments` | Daftar departemen |

> 📌 Lihat `src/app/types/index.ts` untuk format lengkap semua objek data.

---

## 🌐 Rute URL Aplikasi

| URL | Halaman | Login |
|-----|---------|-------|
| `/login` | Login | ❌ |
| `/register` | Daftar Akun | ❌ |
| `/quick-scan` | Scan QR Tanpa Login | ❌ |
| `/dashboard` | Dasbor | ✅ |
| `/tools` | Manajemen Alat + Generate QR | ✅ |
| `/tools/:toolId` | Detail Alat | ✅ |
| `/qr-scan` | Scanner QR | ✅ |
| `/history` | Riwayat Peminjaman | ✅ |
| `/borrow-confirm/:toolId` | Konfirmasi Pinjam | ✅ |
| `/return-confirm/:toolId` | Konfirmasi Kembali | ✅ |

---

## 🚢 Cara Deploy

```bash
# Build untuk production
npm run build

# Output ada di folder dist/
# Upload folder dist/ ke hosting pilihan (Netlify, Vercel, VPS)
```

Set environment variable `VITE_API_URL` di dashboard hosting sesuai URL server production.

---

## 👥 Tim Pengembang — Magang PT Semen Padang

| Nama | Peran | Branch Utama |
|------|-------|--------------|
| Shada | Front-End Developer | `feature/frontend-*` |
| *(Nama teman)* | Back-End Developer | `backend/*` |
| *(Nama teman)* | Back-End / AI | `backend/*` |

---

> **💡 Ada pertanyaan?** Hubungi Front-End Lead atau buat Issue di GitHub repository ini.