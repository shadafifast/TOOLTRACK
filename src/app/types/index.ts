// ─── Types ─────────────────────────────────────────────────────────────────────
// File ini adalah "kontrak data" antara Front-End dan Back-End.
// Tim Back-End harus memastikan format JSON yang dikirimkan
// sesuai dengan interface yang didefinisikan di sini.

export type Page =
  | "login" | "register" | "quick-scan" | "dashboard" | "tools" | "tool-detail" | "qr-scan"
  | "borrow-confirm" | "return-confirm" | "history";

export type ToolStatus = "available" | "borrowed" | "overdue" | "damaged";
export type BorrowStatus = "active" | "returned" | "overdue";

export interface Tool {
  id: string;
  name: string;
  category: string;
  location: string;
  status: ToolStatus;
  lastUser: string;
  lastScanTime: string;
  serialNumber: string;
  purchaseDate: string;
  description: string;
  photoUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  avatar: string;
  activeBorrows: number;
  totalBorrows: number;
  role?: 'admin' | 'user';
}

export interface BorrowRecord {
  id: string;
  toolId: string;
  toolName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  borrowTime: string;
  returnTime: string | null;
  duration: string | null;
  status: BorrowStatus;
  condition: string | null;
  notes: string | null;
}

export interface Activity {
  id: string;
  type: "borrow" | "return" | "damage" | "maintenance";
  tool: string;
  user: string;
  time: string;
  description: string;
}
