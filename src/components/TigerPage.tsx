import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tigerPainting from '../assets/images/tiger-painting.png';
import tigerIcon from '../assets/icons/tiger0.png';
import CheckoutModal from './CheckoutModal';

const TigerPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pricing state
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  
  const printOptions = [
    { size: '8x6', price: 35 },
    { size: '12x9', price: 45 },
    { size: '16x12', price: 55 },
    { size: '24x18', price: 65 },
    { size: '32x24', price: 95 },
    { size: '48x36', price: 135, note: '(original size)' },
  ];

  const handleQuantityChange = (size: string, value: string) => {
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 0) {
        setQuantities(prev => {
            const newQty = { ...prev };
            delete newQty[size];
            return newQty;
        });
        return;
    }
    setQuantities(prev => ({
      ...prev,
      [size]: qty
    }));
  };

  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [size, qty]) => {
      const option = printOptions.find(p => p.size === size);
      return total + (option ? option.price * qty : 0);
    }, 0);
  };

  const getCartItems = () => {
    return Object.entries(quantities).map(([size, qty]) => {
      const option = printOptions.find(p => p.size === size)!;
      return {
        size,
        price: option.price,
        quantity: qty
      };
    });
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#FFFBF0] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div 
          className="mb-8 cursor-pointer text-gray-700 italic hover:underline inline-block"
          onClick={() => navigate('/')}
        >
          Back home
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Painting */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-2 shadow-lg w-full">
              <img 
                src={tigerPainting} 
                alt="Con Cop Painting" 
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">This is the original painting</p>
          </div>

          {/* Right Column - Details */}
          <div className="flex flex-col space-y-8">
            
            {/* Header Section with Icon */}
            <div className="flex items-start gap-6">
              <img src={tigerIcon} alt="Tiger Icon" className="w-24 md:w-32 object-contain" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
                  "con cop" (the tiger) 2025
                </h1>
                <p className="text-xl font-bold font-serif italic text-black">
                  48x36 acrylic on canvas
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm md:text-base text-gray-800 leading-relaxed">
              <p className="italic text-gray-600 text-xs md:text-sm">
                to define is to limit. so i will tell you my inspiration, not my interpretations.
              </p>
              <p>
                The tiger "con cop" in vietnamese culture is a symbol of strength and protection. 
                It protects our shrines, our tombstone, and our gates. This tiger is to protect my bed, 
                watching over me as i sleep. the extra elements are up for interpretations
              </p>
            </div>

            {/* Prints Options */}
            <div className="mt-8">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-2 mb-4">
                <h2 className="text-xl font-serif">Prints Options</h2>
                <span className="text-xs text-gray-500 italic">(All prints are in giclee + first 25, signed)</span>
              </div>

              <div className="space-y-2">
                {printOptions.map((option) => (
                  <div key={option.size} className="flex justify-between items-center py-1">
                    <span className="font-medium flex-1 whitespace-nowrap">
                      {option.size} {option.note && <span className="text-xs font-normal text-gray-500 ml-1">{option.note}</span>}
                    </span>
                    <span className="font-bold w-16 text-right mr-4">${option.price}</span>
                    <div className="w-16 flex justify-end">
                      <input 
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-12 h-8 border border-gray-400 text-center focus:outline-none focus:border-black"
                        style={{ borderRadius: 0 }}
                        value={quantities[option.size] || ''}
                        onChange={(e) => handleQuantityChange(option.size, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Checkout */}
              <div className="mt-6 pt-4 border-t-2 border-gray-400 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                
                {total > 0 && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest hover:bg-[#4F46E5] transition-colors duration-300 animate-fade-in"
                  >
                    Purchase
                  </button>
                )}
              </div>
            </div>

            {/* Contact Footer */}
            <div className="text-right mt-auto pt-8">
              <a href="mailto:contact@example.com" className="font-bold italic text-lg hover:underline inline-block">
                Contact for Original
              </a>
            </div>

          </div>
        </div>
      </div>
      
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cart={getCartItems()}
        total={total}
      />
    </div>
  );
};

export default TigerPage;
