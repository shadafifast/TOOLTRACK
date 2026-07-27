# ToolTrack QR — Sistem Manajemen Aset TIK

Aplikasi web untuk manajemen peminjaman alat dan aset TIK menggunakan sistem QR Code.
Dibangun dengan **React + TypeScript + Vite + Tailwind CSS**.

---

## 📋 Daftar Isi

- [Teknologi yang Digunakan](#teknologi)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Folder](#struktur-folder)
- [Panduan Integrasi Back-End](#panduan-integrasi-back-end)
- [Daftar Endpoint API yang Dibutuhkan](#daftar-endpoint-api)
- [Cara Deploy](#cara-deploy)

---

## 🛠 Teknologi

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | Framework UI utama |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool & dev server |
| Tailwind CSS | 4.x | Styling |
| React Router | 7.x | Navigasi berbasis URL |
| Recharts | 2.x | Grafik & chart |
| Lucide React | latest | Icon library |

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
Buat file `.env.local` di root project (salin dari `.env.example`):
```bash
cp .env.example .env.local
```
Edit `.env.local` dan isi URL Back-End:
```env
VITE_API_URL=http://localhost:8000/api
```
> **Catatan:** Jika Back-End belum siap, biarkan nilai default `/api`. Aplikasi berjalan dengan data dummy.

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser di: **http://localhost:5173**

### 4. Build untuk Production
```bash
npm run build
```
Output ada di folder `dist/`.

---

## 📁 Struktur Folder

```
src/
└── app/
    ├── App.tsx                    # Root routing (React Router)
    │
    ├── types/
    │   └── index.ts               # Tipe data TypeScript (kontrak FE & BE)
    │
    ├── data/
    │   └── mockData.ts            # Data dummy untuk development
    │
    ├── services/                  # Layer API — YANG DIEDIT TIM BACK-END
    │   ├── api.ts                 # Utility fetch + token management
    │   ├── authService.ts         # Login, register, logout
    │   ├── toolService.ts         # CRUD alat
    │   ├── borrowService.ts       # Peminjaman & pengembalian
    │   ├── employeeService.ts     # Data karyawan
    │   └── index.ts               # Barrel export
    │
    ├── layouts/
    │   └── DashboardLayout.tsx    # Shell layout (Sidebar + Header)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   └── Header.tsx
    │   └── shared/
    │       └── index.tsx          # StatusBadge, QRCodeSVG, dll
    │
    └── pages/                     # Satu file per halaman
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── QuickScanPage.tsx
        ├── DashboardPage.tsx
        ├── ToolManagementPage.tsx
        ├── ToolDetailPage.tsx
        ├── QRScanPage.tsx
        ├── BorrowConfirmPage.tsx
        ├── ReturnConfirmPage.tsx
        └── BorrowHistoryPage.tsx
```

---

## 🔌 Panduan Integrasi Back-End

Seluruh logika API terpusat di folder `src/app/services/`.

### 3 Langkah Integrasi

**Langkah 1 — Set URL Back-End di `.env.local`:**
```env
VITE_API_URL=http://localhost:8000/api
```

**Langkah 2 — Buka file service, hapus MOCK DATA, uncomment REAL API:**
```typescript
// src/app/services/toolService.ts

export async function getTools(params) {
  // HAPUS blok ini:
  // const filtered = mockTools.filter(...);
  // return { data: filtered, ... };

  // UNCOMMENT blok ini:
  return apiCall(`/tools?${q.toString()}`);
}
```

**Langkah 3 — Restart dev server:**
```bash
npm run dev
```
Selesai! Semua halaman langsung terhubung ke Back-End.

---

## 📡 Daftar Endpoint API yang Dibutuhkan

> **Format:** JSON  
> **Auth:** Header `Authorization: Bearer <token>` (kecuali `/auth/login` & `/auth/register`)

### 🔐 Autentikasi

| Method | Endpoint | Body | Respons |
|--------|----------|------|---------|
| `POST` | `/auth/login` | `{ email, password }` | `{ token, user }` |
| `POST` | `/auth/register` | `{ name, email, department, position, phone, password }` | `{ token, user }` |
| `POST` | `/auth/logout` | — | `{ success }` |
| `GET` | `/auth/me` | — | `Employee` |

### 🔧 Alat (Tool)

| Method | Endpoint | Query / Body | Respons |
|--------|----------|------|---------|
| `GET` | `/tools` | `?search=&status=&category=&page=&limit=` | `{ data: Tool[], total, page, limit }` |
| `GET` | `/tools/:id` | — | `Tool` |
| `POST` | `/tools` | `{ name, category, location, serialNumber, purchaseDate, description }` | `Tool` |
| `PUT` | `/tools/:id` | `Partial<Tool>` | `Tool` |
| `DELETE` | `/tools/:id` | — | `{ success: true }` |
| `GET` | `/tools/:id/history` | — | `BorrowRecord[]` |
| `POST` | `/tools/:id/photo` | `FormData` (multipart) | `{ photoUrl: string }` |
| `GET` | `/tools/categories` | — | `string[]` |

### 📦 Peminjaman (Borrow)

| Method | Endpoint | Query / Body | Respons |
|--------|----------|------|---------|
| `GET` | `/borrows` | `?status=&toolId=&employeeId=&search=&page=&limit=` | `{ data: BorrowRecord[], total, page, limit }` |
| `POST` | `/borrows` | `{ toolId, employeeId, estimatedReturnDate, notes? }` | `BorrowRecord` |
| `PATCH` | `/borrows/:id/return` | `{ condition, notes? }` | `BorrowRecord` |
| `POST` | `/borrows/quick` | `{ toolId, employeeId }` | `BorrowRecord` |
| `GET` | `/borrows/export` | `?format=csv` atau `?format=pdf` | `File` |
| `GET` | `/dashboard/stats` | — | `DashboardStats` |

### 👤 Karyawan (Employee)

| Method | Endpoint | Query | Respons |
|--------|----------|-------|---------|
| `GET` | `/employees` | `?search=&department=` | `Employee[]` |
| `GET` | `/employees/:id` | — | `Employee` |
| `GET` | `/employees/departments` | — | `string[]` |

### 📐 Format Data (Contoh Objek JSON)

```json
// Tool
{
  "id": "TL-001",
  "name": "Fluke LinkIQ Cable Analyzer",
  "category": "Network Equipment",
  "location": "IT Storage A",
  "status": "available",
  "lastUser": "Ahmad Rifai",
  "lastScanTime": "2024-01-15 09:23",
  "serialNumber": "FLK-LQ-2023-001",
  "purchaseDate": "2023-03-15",
  "description": "..."
}

// BorrowRecord
{
  "id": "BR-001",
  "toolId": "TL-001",
  "toolName": "Fluke LinkIQ Cable Analyzer",
  "employeeId": "EMP001",
  "employeeName": "Ahmad Rifai",
  "department": "IT Support",
  "borrowTime": "2024-01-15 09:23",
  "returnTime": null,
  "duration": null,
  "status": "active",
  "condition": null,
  "notes": null
}
```

> Lihat `src/app/types/index.ts` untuk format lengkap semua tipe data.

---

## 🌐 Rute URL Aplikasi

| URL | Halaman | Perlu Login |
|-----|---------|-------------|
| `/login` | Halaman Login | ❌ |
| `/register` | Halaman Daftar Akun | ❌ |
| `/quick-scan` | Scan QR Tanpa Login | ❌ |
| `/dashboard` | Dasbor Utama | ✅ |
| `/tools` | Daftar & Manajemen Alat | ✅ |
| `/tools/:toolId` | Detail Alat | ✅ |
| `/qr-scan` | Scanner QR | ✅ |
| `/history` | Riwayat Peminjaman | ✅ |
| `/borrow-confirm/:toolId` | Konfirmasi Peminjaman | ✅ |
| `/return-confirm/:toolId` | Konfirmasi Pengembalian | ✅ |

---

## 🚢 Cara Deploy

### Static Hosting (Netlify / Vercel)
```bash
npm run build
# Upload folder dist/ ke hosting pilihan Anda
```
Set environment variable `VITE_API_URL` di dashboard hosting.

### Nginx
```nginx
server {
    listen 80;
    root /var/www/tooltrack/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 👥 Tim

| Peran | Tanggung Jawab |
|-------|----------------|
| **Front-End** | Tampilan UI, komponen React, routing |
| **Back-End** | REST API, database, autentikasi |

> **Catatan untuk Tim Back-End:** Baca `src/app/services/` dan `src/app/types/index.ts` untuk memahami kontrak data yang diharapkan Front-End.