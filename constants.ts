import type { Vegetable, User, Bill } from './types/types';

export const VEGETABLES_DATA: Vegetable[] = [
  { id: 'veg1', name: 'Tomato', pricePerKg: 40, stockKg: 100, category: 'Vegetable', icon: '🍅' },
  { id: 'veg2', name: 'Potato', pricePerKg: 30, stockKg: 150, category: 'Vegetable', icon: '🥔' },
  { id: 'veg3', name: 'Onion', pricePerKg: 50, stockKg: 200, category: 'Vegetable', icon: '🧅' },
  { id: 'veg4', name: 'Carrot', pricePerKg: 60, stockKg: 80, category: 'Vegetable', icon: '🥕' },
  { id: 'veg5', name: 'Broccoli', pricePerKg: 120, stockKg: 50, category: 'Exotic Veggies', icon: '🥦' },
  { id: 'veg6', name: 'Spinach', pricePerKg: 20, stockKg: 60, category: 'Greens', icon: '🥬' },
  { id: 'veg7', name: 'Cucumber', pricePerKg: 35, stockKg: 70, category: 'Vegetable', icon: '🥒' },
  { id: 'veg8', name: 'Bell Pepper', pricePerKg: 80, stockKg: 40, category: 'Vegetable', icon: '🫑' },
  { id: 'veg9', name: 'Lettuce', pricePerKg: 100, stockKg: 30, category: 'Greens', icon: '🥬' },
  { id: 'veg10', name: 'Mushroom', pricePerKg: 150, stockKg: 25, category: 'Exotic Veggies', icon: '🍄' },
];

export const USERS_DATA: User[] = [
  { id: 'admin', name: 'Admin One', role: 'admin' },
  { id: 'user', name: 'Priya Kumar', role: 'user' },
  { id: 'user2', name: 'Ravi Singh', role: 'user' },
];

export const BILLS_DATA: Bill[] = []; // Start with no bills
