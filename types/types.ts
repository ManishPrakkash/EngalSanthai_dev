export interface Vegetable {
  id: string;
  name: string;
  pricePerKg: number;
  stockKg: number;
  category: string;
  icon: string;
}

export interface BillItem {
  vegetableId: string;
  quantityKg: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  date: string; // ISO string
  items: BillItem[];
  total: number;
  customerName: string;
  paymentScreenshot?: string; // base64 string
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  email?: string; // Optional email field for settings
}
