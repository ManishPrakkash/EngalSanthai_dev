
import React, { useState, useMemo, useCallback } from 'react';
import type { Vegetable, BillItem, Bill, User } from '../../types/types';
import UserHeader from './UserHeader.tsx';
import Button from './ui/Button.tsx';
import { PlusIcon, MinusIcon, MagnifyingGlassIcon } from './ui/Icon.tsx';
import PaymentPage from './PaymentPage.tsx';
import CartView from './CartView.tsx';
import BillPreviewPage from './BillPreviewPage.tsx';
import Settings from './Settings.tsx';

interface OrderPageProps {
  user: User;
  vegetables: Vegetable[];
  addBill: (newBill: Omit<Bill, 'id' | 'date'>) => Promise<Bill>;
  onLogout: () => void;
}

type OrderStage = 'ordering' | 'payment' | 'success' | 'settings';

// Utility to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

type CartItemDetails = BillItem & { name: string; icon: string; pricePerKg: number; stockKg: number; };

const OrderPage: React.FC<OrderPageProps> = ({ user, vegetables, addBill, onLogout }) => {
  const [stage, setStage] = useState<OrderStage>('ordering');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [finalBill, setFinalBill] = useState<Bill | null>(null);
  
  const vegetableMap = useMemo(() => new Map(vegetables.map(v => [v.id, v])), [vegetables]);
  const categories = useMemo(() => ['All', ...new Set(vegetables.map(v => v.category))], [vegetables]);

  const filteredVegetables = useMemo(() => {
    return vegetables.filter(v => {
      const matchesCategory = category === 'All' || v.category === category;
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [vegetables, searchTerm, category]);

  const updateCart = (vegId: string, quantity: number) => {
    setCart(prev => {
      const newCart = new Map(prev);
      const vegetable = vegetableMap.get(vegId);
      if (!vegetable) return prev;

      // Clamp quantity between 0 and stockKg
      const clampedQuantity = Math.max(0, Math.min(quantity, vegetable.stockKg));

      if (clampedQuantity > 0) {
        newCart.set(vegId, parseFloat(clampedQuantity.toFixed(2)));
      } else {
        newCart.delete(vegId);
      }
      return newCart;
    });
  };

  const { cartItems, total, totalItems } = useMemo(() => {
    const items: CartItemDetails[] = [];
    let currentTotal = 0;
    let itemCount = 0;
    cart.forEach((quantity, vegId) => {
      const veg = vegetableMap.get(vegId);
      if (veg) {
        const subtotal = veg.pricePerKg * quantity;
        items.push({ 
            vegetableId: vegId, 
            quantityKg: quantity, 
            subtotal,
            name: veg.name,
            icon: veg.icon,
            pricePerKg: veg.pricePerKg,
            stockKg: veg.stockKg,
        });
        currentTotal += subtotal;
        itemCount += 1;
      }
    });
    items.sort((a, b) => a.name.localeCompare(b.name));
    return { cartItems: items, total: currentTotal, totalItems: itemCount };
  }, [cart, vegetableMap]);

  const handleConfirmOrder = useCallback(async (screenshot: File) => {
    const paymentScreenshotBase64 = await fileToBase64(screenshot);
    
    const createdBill = await addBill({
      items: cartItems.map(({name, icon, pricePerKg, stockKg, ...item}) => item),
      total,
      customerName: user.name,
      paymentScreenshot: paymentScreenshotBase64,
    });
    setFinalBill(createdBill);
    setStage('success');
    setCart(new Map());
  }, [cartItems, total, addBill, user.name]);

  const handlePlaceOrder = () => {
      setIsCartVisible(false);
      setStage('payment');
  };

  const handleOpenSettings = () => {
    setStage('settings');
  };

  const handleUpdateProfile = (profile: { name: string; email: string }) => {
    // Handle profile update logic here
    console.log('Profile updated:', profile);
    // You can add API calls or state updates here
  };

  const handleChangePassword = (passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    // Handle password change logic here
    console.log('Password change requested');
    // You can add API calls or validation here
  };

  if (stage === 'payment') {
    return <PaymentPage total={total} onConfirmOrder={handleConfirmOrder} onBack={() => setStage('ordering')} />;
  }
  
  if (stage === 'success' && finalBill) {
    return (
        <BillPreviewPage 
            bill={finalBill}
            vegetables={vegetables}
            onLogout={onLogout}
        />
    );
  }

  if (stage === 'settings') {
    return (
      <div className="min-h-screen bg-slate-100">
        <UserHeader user={user} onLogout={onLogout} />
        <div className="p-4">
          <button 
            onClick={() => setStage('ordering')}
            className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Shopping
          </button>
          <Settings 
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <UserHeader user={user} onLogout={onLogout} onOpenSettings={handleOpenSettings} />
      <div className="flex-1 flex lg:flex-row overflow-hidden">
        {/* Product List */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search for vegetables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-slate-300 bg-white pl-10 py-2.5 text-slate-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div className="mt-3">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-md border-slate-300 bg-white py-2.5 text-slate-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {filteredVegetables.length > 0 ? filteredVegetables.map(veg => {
              const quantity = cart.get(veg.id) || 0;
              return (
              <div key={veg.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{veg.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{veg.name}</p>
                    <p className="text-sm text-slate-500">₹{veg.pricePerKg.toFixed(2)}/kg</p>
                  </div>
                </div>
                {quantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateCart(veg.id, quantity - 0.25)} className="p-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50" disabled={quantity <= 0}><MinusIcon className="h-4 w-4"/></button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => updateCart(veg.id, parseFloat(e.target.value) || 0)}
                      className="w-16 text-center font-bold text-primary-700 border-b-2 border-slate-300 focus:outline-none focus:border-primary-500 transition bg-transparent"
                      min="0"
                      max={veg.stockKg}
                      step="0.25"
                      aria-label={`${veg.name} quantity in kg`}
                    />
                    <button onClick={() => updateCart(veg.id, quantity + 0.25)} className="p-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50" disabled={quantity >= veg.stockKg}><PlusIcon className="h-4 w-4"/></button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      const defaultQuantity = veg.category === 'Greens' ? 0.25 : 1;
                      updateCart(veg.id, defaultQuantity);
                    }} 
                    size="md" 
                    className="px-3 py-1.5 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1"/> Add
                  </Button>
                )}
              </div>
            )}) : <p className="text-center text-slate-500 py-10">No vegetables found.</p>}
          </div>
        </main>

        {/* Desktop Cart Summary */}
        <aside className="hidden lg:flex lg:w-2/5 xl:w-1/3 bg-white border-l border-slate-200 flex-col">
            <CartView
                isDesktop={true}
                cartItems={cartItems}
                total={total}
                onUpdateCart={updateCart}
                onPlaceOrder={handlePlaceOrder}
            />
        </aside>
      </div>

       {/* Mobile Sticky Footer */}
       <footer className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out ${cartItems.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-slate-500">{totalItems} {totalItems > 1 ? 'ITEMS' : 'ITEM'}</span>
                    <p className="text-xl font-bold text-slate-800">₹{total.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsCartVisible(true)} size="md">
                    View Order
                </Button>
            </div>
        </footer>

      {/* Mobile Cart Sheet */}
      <CartView
        isOpen={isCartVisible}
        onClose={() => setIsCartVisible(false)}
        cartItems={cartItems}
        total={total}
        onUpdateCart={updateCart}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default OrderPage;