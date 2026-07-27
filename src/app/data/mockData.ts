// ─── Mock Data ──────────────────────────────────────────────────────────────────
// File ini berisi data PALSU (dummy) untuk keperluan pengembangan Front-End.
// Saat Back-End sudah siap, ganti data di file ini dengan panggilan API (fetch/axios).
// Format data di sini adalah KONTRAK yang harus diikuti oleh API Back-End.

import type { Employee, Tool, BorrowRecord, Activity } from "../types";

export const employees: Employee[] = [
  { id: "EMP001", name: "Ahmad Rifai", department: "IT Support", position: "Senior IT Support", email: "ahmad.rifai@company.com", phone: "+62 812-3456-7890", avatar: "AR", activeBorrows: 2, totalBorrows: 47 },
  { id: "EMP002", name: "Siti Rahayu", department: "Teknik Jaringan", position: "Network Engineer", email: "siti.rahayu@company.com", phone: "+62 813-2345-6789", avatar: "SR", activeBorrows: 1, totalBorrows: 31 },
  { id: "EMP003", name: "Budi Santoso", department: "Administrasi Sistem", position: "Administrator Sistem", email: "budi.santoso@company.com", phone: "+62 814-3456-7891", avatar: "BS", activeBorrows: 0, totalBorrows: 22 },
  { id: "EMP004", name: "Dewi Kusuma", department: "Help Desk", position: "Analis Help Desk", email: "dewi.kusuma@company.com", phone: "+62 815-4567-8901", avatar: "DK", activeBorrows: 3, totalBorrows: 55 },
  { id: "EMP005", name: "Reza Pratama", department: "Manajemen IT", position: "Manajer IT", email: "reza.pratama@company.com", phone: "+62 816-5678-9012", avatar: "RP", activeBorrows: 0, totalBorrows: 18 },
  { id: "EMP006", name: "Fajar Hidayat", department: "Infrastruktur", position: "Insinyur Infrastruktur", email: "fajar.hidayat@company.com", phone: "+62 817-6789-0123", avatar: "FH", activeBorrows: 2, totalBorrows: 38 },
  { id: "EMP007", name: "Maya Permata", department: "Keamanan IT", position: "Analis Keamanan", email: "maya.permata@company.com", phone: "+62 818-7890-1234", avatar: "MP", activeBorrows: 1, totalBorrows: 29 },
  { id: "EMP008", name: "Irfan Hakim", department: "Pengembangan", position: "Senior Developer", email: "irfan.hakim@company.com", phone: "+62 819-8901-2345", avatar: "IH", activeBorrows: 0, totalBorrows: 14 },
];

export const tools: Tool[] = [
  { id: "TL-001", name: "Fluke LinkIQ Cable Analyzer", category: "Network Equipment", location: "IT Storage A", status: "borrowed", lastUser: "Ahmad Rifai", lastScanTime: "2024-01-15 09:23", serialNumber: "FLK-LQ-2023-001", purchaseDate: "2023-03-15", description: "Professional network cable analyzer for Cat5e/6/6A/7A testing with WireMap technology" },
  { id: "TL-002", name: "Cisco Catalyst 2960 24-Port Switch", category: "Network Equipment", location: "Server Room B", status: "available", lastUser: "Siti Rahayu", lastScanTime: "2024-01-14 16:45", serialNumber: "CSC-CAT-2022-002", purchaseDate: "2022-07-20", description: "Managed 24-port PoE gigabit switch for lab use and temporary deployments" },
  { id: "TL-003", name: "HP ProBook 450 G9 Laptop", category: "Computing", location: "Help Desk Cabinet", status: "borrowed", lastUser: "Dewi Kusuma", lastScanTime: "2024-01-15 08:00", serialNumber: "HP-PB-2023-003", purchaseDate: "2023-05-10", description: "15.6-inch business laptop for field support, i5-12th Gen, 16GB RAM, 512GB SSD" },
  { id: "TL-004", name: "MacBook Pro 14-inch M3", category: "Computing", location: "IT Storage A", status: "available", lastUser: "Reza Pratama", lastScanTime: "2024-01-12 17:30", serialNumber: "APL-MBP-2023-004", purchaseDate: "2023-11-01", description: "High-performance laptop for development and design tasks, 18GB unified memory" },
  { id: "TL-005", name: "Fluke 117 Digital Multimeter", category: "Testing Equipment", location: "Network Lab", status: "available", lastUser: "Fajar Hidayat", lastScanTime: "2024-01-13 11:20", serialNumber: "FLK-117-2022-005", purchaseDate: "2022-04-05", description: "TRMS digital multimeter for electrical measurements in commercial environments" },
  { id: "TL-006", name: "Fiber Optic Splicing Kit", category: "Network Equipment", location: "Server Room A", status: "overdue", lastUser: "Ahmad Rifai", lastScanTime: "2024-01-08 14:15", serialNumber: "FBR-SPL-2021-006", purchaseDate: "2021-09-22", description: "Complete fiber optic splicing and termination kit with cleaver and splicer" },
  { id: "TL-007", name: "Dell UltraSharp 27-inch 4K Monitor", category: "Computing", location: "IT Storage B", status: "available", lastUser: "Irfan Hakim", lastScanTime: "2024-01-11 09:45", serialNumber: "DLL-US27-2023-007", purchaseDate: "2023-02-14", description: "4K USB-C monitor for productivity and color-accurate design work" },
  { id: "TL-008", name: "USB Protocol Analyzer", category: "Testing Equipment", location: "Network Lab", status: "available", lastUser: "Maya Permata", lastScanTime: "2024-01-10 15:30", serialNumber: "USB-PA-2022-008", purchaseDate: "2022-11-30", description: "USB 3.1 Gen2 protocol analyzer for debugging and security audits" },
  { id: "TL-009", name: "NetScout Wi-Fi Analyzer", category: "Network Equipment", location: "IT Storage A", status: "borrowed", lastUser: "Siti Rahayu", lastScanTime: "2024-01-15 07:50", serialNumber: "NSC-WFA-2023-009", purchaseDate: "2023-08-17", description: "Wireless network analyzer for enterprise site surveys and troubleshooting" },
  { id: "TL-010", name: "iPad Pro 12.9-inch (Demo Unit)", category: "Mobile Devices", location: "Help Desk Cabinet", status: "damaged", lastUser: "Dewi Kusuma", lastScanTime: "2024-01-09 13:00", serialNumber: "APL-IPD-2022-010", purchaseDate: "2022-06-01", description: "Demo iPad for customer presentations — currently awaiting screen repair" },
  { id: "TL-011", name: "Raspberry Pi 4 Dev Kit", category: "Computing", location: "Network Lab", status: "available", lastUser: "Irfan Hakim", lastScanTime: "2024-01-14 10:15", serialNumber: "RPI-4-2023-011", purchaseDate: "2023-04-28", description: "8GB Raspberry Pi 4 development kit with official case and accessories" },
  { id: "TL-012", name: "KVM Switch 8-Port", category: "Infrastructure", location: "Server Room A", status: "available", lastUser: "Budi Santoso", lastScanTime: "2024-01-13 16:20", serialNumber: "KVM-8P-2022-012", purchaseDate: "2022-08-15", description: "8-port KVM switch with HDMI/USB for server room management" },
  { id: "TL-013", name: "Power Supply Tester", category: "Testing Equipment", location: "IT Storage B", status: "borrowed", lastUser: "Fajar Hidayat", lastScanTime: "2024-01-15 10:00", serialNumber: "PST-TL-2023-013", purchaseDate: "2023-01-10", description: "ATX/EPS/SATA/Molex power supply tester with LCD display" },
  { id: "TL-014", name: "Crimping Tool Set", category: "Network Equipment", location: "Help Desk Cabinet", status: "available", lastUser: "Ahmad Rifai", lastScanTime: "2024-01-14 14:30", serialNumber: "CRM-TS-2021-014", purchaseDate: "2021-12-05", description: "Professional RJ45/RJ11 crimping tool with wire stripper and cable tester" },
  { id: "TL-015", name: "UPS Test Unit 1500VA", category: "Infrastructure", location: "Server Room B", status: "overdue", lastUser: "Budi Santoso", lastScanTime: "2024-01-05 09:10", serialNumber: "UPS-1500-2022-015", purchaseDate: "2022-03-20", description: "APC Smart-UPS 1500VA for testing backup power configurations in server racks" },
];

export const borrowHistory: BorrowRecord[] = [
  { id: "BR-001", toolId: "TL-001", toolName: "Fluke LinkIQ Cable Analyzer", employeeId: "EMP001", employeeName: "Ahmad Rifai", department: "IT Support", borrowTime: "2024-01-15 09:23", returnTime: null, duration: null, status: "active", condition: null, notes: null },
  { id: "BR-002", toolId: "TL-003", toolName: "HP ProBook 450 G9 Laptop", employeeId: "EMP004", employeeName: "Dewi Kusuma", department: "Help Desk", borrowTime: "2024-01-15 08:00", returnTime: null, duration: null, status: "active", condition: null, notes: null },
  { id: "BR-003", toolId: "TL-009", toolName: "NetScout Wi-Fi Analyzer", employeeId: "EMP002", employeeName: "Siti Rahayu", department: "Teknik Jaringan", borrowTime: "2024-01-15 07:50", returnTime: null, duration: null, status: "active", condition: null, notes: null },
  { id: "BR-004", toolId: "TL-006", toolName: "Fiber Optic Splicing Kit", employeeId: "EMP001", employeeName: "Ahmad Rifai", department: "IT Support", borrowTime: "2024-01-08 14:15", returnTime: null, duration: null, status: "overdue", condition: null, notes: null },
  { id: "BR-005", toolId: "TL-015", toolName: "UPS Test Unit 1500VA", employeeId: "EMP003", employeeName: "Budi Santoso", department: "Administrasi Sistem", borrowTime: "2024-01-05 09:10", returnTime: null, duration: null, status: "overdue", condition: null, notes: null },
  { id: "BR-006", toolId: "TL-002", toolName: "Cisco Catalyst 2960 Switch", employeeId: "EMP002", employeeName: "Siti Rahayu", department: "Teknik Jaringan", borrowTime: "2024-01-12 10:00", returnTime: "2024-01-14 16:45", duration: "2h 6j 45m", status: "returned", condition: "Baik", notes: "Digunakan untuk rekonfigurasi jaringan di Gedung B" },
  { id: "BR-007", toolId: "TL-004", toolName: "MacBook Pro 14-inch M3", employeeId: "EMP005", employeeName: "Reza Pratama", department: "Manajemen IT", borrowTime: "2024-01-10 09:00", returnTime: "2024-01-12 17:30", duration: "2h 8j 30m", status: "returned", condition: "Sangat Baik", notes: null },
  { id: "BR-008", toolId: "TL-010", toolName: "iPad Pro 12.9-inch", employeeId: "EMP004", employeeName: "Dewi Kusuma", department: "Help Desk", borrowTime: "2024-01-08 11:00", returnTime: "2024-01-09 13:00", duration: "1h 2j 0m", status: "returned", condition: "Rusak", notes: "Layar retak saat presentasi pelanggan" },
  { id: "BR-009", toolId: "TL-005", toolName: "Fluke 117 Digital Multimeter", employeeId: "EMP006", employeeName: "Fajar Hidayat", department: "Infrastruktur", borrowTime: "2024-01-11 14:00", returnTime: "2024-01-13 11:20", duration: "1h 21j 20m", status: "returned", condition: "Baik", notes: null },
  { id: "BR-010", toolId: "TL-007", toolName: "Dell UltraSharp 27-inch Monitor", employeeId: "EMP008", employeeName: "Irfan Hakim", department: "Pengembangan", borrowTime: "2024-01-09 08:30", returnTime: "2024-01-11 09:45", duration: "2h 1j 15m", status: "returned", condition: "Sangat Baik", notes: "Digunakan untuk setup dual monitor saat sprint" },
  { id: "BR-011", toolId: "TL-013", toolName: "Power Supply Tester", employeeId: "EMP006", employeeName: "Fajar Hidayat", department: "Infrastructure", borrowTime: "2024-01-15 10:00", returnTime: null, duration: null, status: "active", condition: null, notes: null },
  { id: "BR-012", toolId: "TL-008", toolName: "USB Protocol Analyzer", employeeId: "EMP007", employeeName: "Maya Permata", department: "Keamanan IT", borrowTime: "2024-01-07 09:00", returnTime: "2024-01-10 15:30", duration: "3h 6j 30m", status: "returned", condition: "Baik", notes: "Audit keamanan pada armada workstation" },
];

export const activities: Activity[] = [
  { id: "1", type: "borrow", tool: "Fluke LinkIQ Cable Analyzer", user: "Ahmad Rifai", time: "09:23", description: "Dipinjam untuk troubleshooting jaringan di Gedung C, Lantai 4" },
  { id: "2", type: "borrow", tool: "HP ProBook 450 G9", user: "Dewi Kusuma", time: "08:00", description: "Dipinjam untuk dukungan lapangan — tiket eskalasi #4821" },
  { id: "3", type: "return", tool: "Cisco Catalyst 2960 Switch", user: "Siti Rahayu", time: "Kemarin 16:45", description: "Dikembalikan dalam kondisi baik setelah rekonfigurasi jaringan" },
  { id: "4", type: "borrow", tool: "NetScout Wi-Fi Analyzer", user: "Siti Rahayu", time: "07:50", description: "Dipinjam untuk survei jaringan nirkabel di perluasan Lantai 2" },
  { id: "5", type: "damage", tool: "iPad Pro 12.9-inch", user: "Dewi Kusuma", time: "9 Jan, 13:00", description: "Dikembalikan dengan layar retak — dikirim ke antrian perbaikan" },
  { id: "6", type: "return", tool: "MacBook Pro 14-inch M3", user: "Reza Pratama", time: "12 Jan, 17:30", description: "Dikembalikan dalam kondisi sangat baik setelah presentasi eksekutif" },
  { id: "7", type: "borrow", tool: "Power Supply Tester", user: "Fajar Hidayat", time: "10:00", description: "Dipinjam untuk pemeliharaan ruang server — proyek upgrade rak" },
  { id: "8", type: "maintenance", tool: "UPS Test Unit 1500VA", user: "Sistem", time: "5 Jan, 09:00", description: "Ditandai terlambat — terakhir dipinjam oleh Budi Santoso" },
];

export const usageChartData = [
  { hari: "Sen", peminjaman: 8, pengembalian: 5 },
  { hari: "Sel", peminjaman: 12, pengembalian: 9 },
  { hari: "Rab", peminjaman: 6, pengembalian: 8 },
  { hari: "Kam", peminjaman: 15, pengembalian: 11 },
  { hari: "Jum", peminjaman: 9, pengembalian: 7 },
  { hari: "Sab", peminjaman: 3, pengembalian: 4 },
  { hari: "Min", peminjaman: 1, pengembalian: 2 },
];

export const statusDistData = [
  { name: "Tersedia", value: 9, color: "#22c55e" },
  { name: "Dipinjam", value: 4, color: "#3b82f6" },
  { name: "Terlambat", value: 2, color: "#ef4444" },
  { name: "Rusak", value: 1, color: "#f59e0b" },
];
