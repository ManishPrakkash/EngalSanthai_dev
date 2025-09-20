import { useState, useCallback } from 'react';
import { VEGETABLES_DATA, BILLS_DATA } from '../constants.ts';
import type { Vegetable, Bill } from '../types.ts';

export const useBillingData = () => {
  const [vegetables, setVegetables] = useState<Vegetable[]>(VEGETABLES_DATA);
  const [bills, setBills] = useState<Bill[]>(BILLS_DATA);

  const addVegetable = useCallback((newVegetable: Omit<Vegetable, 'id'>) => {
    setVegetables(prev => [
      ...prev,
      { ...newVegetable, id: `veg${Date.now()}` },
    ]);
  }, []);

  const updateVegetable = useCallback((updatedVegetable: Vegetable) => {
    setVegetables(prev =>
      prev.map(v => (v.id === updatedVegetable.id ? updatedVegetable : v))
    );
  }, []);

  const deleteVegetable = useCallback((vegId: string) => {
    setVegetables(prev => prev.filter(v => v.id !== vegId));
  }, []);

  const addBill = useCallback(async (newBillData: Omit<Bill, 'id' | 'date'>): Promise<Bill> => {
    // --- START FIREBASE INTEGRATION POINT ---
    // In the future, this function will contain your Firebase logic.
    // 1. You would start a Firebase transaction.
    // 2. Create a new bill document in your 'bills' collection.
    
    const newBill: Bill = {
      ...newBillData,
      id: `bill${Date.now()}`,
      date: new Date().toISOString(),
    };

    // 3. For each item in the bill, you would update the stock in your 'vegetables' collection.
    // This local state update correctly mimics that database transaction.
    setVegetables(prevVeggies => {
      const updatedVeggies = [...prevVeggies];
      newBill.items.forEach(item => {
        const vegIndex = updatedVeggies.findIndex(v => v.id === item.vegetableId);
        if (vegIndex !== -1) {
          const originalStock = updatedVeggies[vegIndex].stockKg;
          updatedVeggies[vegIndex] = {
            ...updatedVeggies[vegIndex],
            // Ensure stock doesn't go below zero
            stockKg: Math.max(0, originalStock - item.quantityKg),
          };
        }
      });
      return updatedVeggies;
    });

    // 4. Finally, you would commit the transaction.
    
    // This local state update mimics adding the new bill to your app's state.
    // With Firebase, you'd likely rely on a real-time listener for bills instead.
    setBills(prev => [newBill, ...prev]);

    // The function returns the created bill, which is good practice.
    return newBill;
    // --- END FIREBASE INTEGRATION POINT ---
  }, []);

  return {
    vegetables,
    addVegetable,
    updateVegetable,
    deleteVegetable,
    bills,
    addBill,
  };
};
