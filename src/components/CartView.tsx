
import React from 'react';
import type { BillItem } from '../../types/types';
import Button from './ui/Button.tsx';
import { ShoppingCartIcon, XMarkIcon, MinusIcon, PlusIcon } from './ui/Icon.tsx';

type CartItemDetails = BillItem & { name: string; icon: string; pricePerKg: number; stockKg: number; };

interface CartViewProps {
  isOpen?: boolean;
  isDesktop?: boolean;
  onClose?: () => void;
  onPlaceOrder: () => void;
  cartItems: CartItemDetails[];
  total: number;
  onUpdateCart: (vegId: string, quantity: number) => void;
}

const CartContent: React.FC<Omit<CartViewProps, 'isOpen'>> = ({ cartItems, total, onUpdateCart, onPlaceOrder, isDesktop, onClose }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 ${isDesktop ? '' : 'bg-slate-50'}`}>
                <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
                {!isDesktop && (
                     <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200"
                        aria-label="Close cart"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                    <ShoppingCartIcon className="h-16 w-16 text-slate-300"/>
                    <p className="mt-4">Your cart is empty.</p>
                    <p className="text-sm text-slate-400">Add items to get started.</p>
                    </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.vegetableId} className="py-2 border-b border-slate-100 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{item.icon}</span>
                            <div>
                              <p className="font-semibold text-slate-800">{item.name}</p>
                              {isDesktop ? (
                                <p className="text-sm text-slate-500">{item.quantityKg} kg &times; ₹{item.pricePerKg.toFixed(2)}/kg</p>
                              ) : (
                                <p className="text-sm text-slate-500">₹{item.pricePerKg.toFixed(2)} / kg</p>
                              )}
                            </div>
                          </div>
                          <p className="font-semibold text-slate-800">₹{item.subtotal.toFixed(2)}</p>
                        </div>
                        {!isDesktop && (
                            <div className="flex justify-end items-center mt-2">
                                <div className="flex items-center border border-slate-300 rounded-md overflow-hidden h-9">
                                    <button onClick={() => onUpdateCart(item.vegetableId, item.quantityKg - 0.25)} className="px-3 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-700 disabled:opacity-50" disabled={item.quantityKg <= 0}>
                                        <MinusIcon className="h-4 w-4"/>
                                    </button>
                                    <input
                                        type="number"
                                        value={item.quantityKg}
                                        onChange={(e) => onUpdateCart(item.vegetableId, parseFloat(e.target.value) || 0)}
                                        className="w-16 h-full text-center font-bold text-primary-700 focus:outline-none bg-white border-x border-slate-300"
                                        min="0"
                                        max={item.stockKg}
                                        step="0.25"
                                        aria-label={`${item.name} quantity in kg`}
                                    />
                                    <button onClick={() => onUpdateCart(item.vegetableId, item.quantityKg + 0.25)} className="px-3 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-700 disabled:opacity-50" disabled={item.quantityKg >= item.stockKg}>
                                        <PlusIcon className="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-white">
                <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full" disabled={cartItems.length === 0} onClick={onPlaceOrder}>
                Place Order
                </Button>
            </div>
        </div>
    );
};


const CartView: React.FC<CartViewProps> = ({ isOpen = false, isDesktop = false, onClose = () => {}, ...props }) => {
    if (isDesktop) {
        return <CartContent isDesktop={true} onClose={onClose} {...props} />;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="relative w-full h-full">
                <CartContent onClose={onClose} {...props} />
            </div>
        </div>
    );
};


export default CartView;