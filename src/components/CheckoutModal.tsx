import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with a test key
// In production, this should be an environment variable
const stripePromise = loadStripe('pk_live_51QbcUzRsl974fpm1erQgI05cA6PMe759c58hlL2hOXaRoFGT2vWVQYRUO0PCFlFFGI03E1Vj4I1L6eYwV1pXGt1l000Y5dsClz');

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { size: string; price: number; quantity: number }[];
  total: number;
}

const CheckoutForm = ({ onClose, total, cart, onSuccess }: { onClose: () => void, total: number, cart: any[], onSuccess: (data: any) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          address: {
            line1: formData.address,
            city: formData.city,
            postal_code: formData.zip,
          },
        },
      });

      if (error) {
        setError(error.message || 'An error occurred');
        setProcessing(false);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        // Simulate backend processing delay
        setTimeout(() => {
            setProcessing(false);
            onSuccess({
                ...formData,
                paymentMethodId: paymentMethod.id
            });
        }, 1500);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="Ex. Antony Tran"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="email@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Address</label>
        <input
          required
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="Street Address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            required
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="City"
          />
        </div>
        <div>
          <input
            required
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="ZIP Code"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 mt-2">
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
            Card Details
        </label>
        <div className="border border-gray-300 p-3 bg-white">
            <CardElement 
                options={{
                    style: {
                        base: {
                            fontSize: '14px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                    },
                    hidePostalCode: true,
                }}
            />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs mt-1">
            {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-black text-white font-bold py-3 mt-4 uppercase tracking-widest hover:bg-[#4F46E5] transition-colors duration-300 text-sm ${processing ? 'opacity-75 cursor-wait' : ''}`}
      >
        {processing ? 'Processing...' : `Pay $${total}`}
      </button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
        Encrypted by Stripe
      </p>
    </form>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, total }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Fetch PaymentIntent when modal opens
  React.useEffect(() => {
    if (isOpen && total > 0) {
      setIsInitializing(true);
      setInitError(null);
      
      // On Vercel, the /api directory is automatically routed
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      })
        .then(async (res) => {
           if (!res.ok) {
             // Try to read error as JSON, fallback to text
             const text = await res.text();
             try {
                 const json = JSON.parse(text);
                 throw new Error(json.error || json.message || `Error ${res.status}`);
             } catch(e) {
                 throw new Error(`Server Error ${res.status}: ${text}`);
             }
           }
           return res.json();
        })
        .then((data) => {
            if (data.error) throw new Error(data.error);
            if (!data.clientSecret) throw new Error("No client secret returned");
            setClientSecret(data.clientSecret);
        })
        .catch(err => {
            console.error("Checkout Init Error:", err);
            setInitError(err.message);
        })
        .finally(() => setIsInitializing(false));
    }
  }, [isOpen, total, cart]);

  if (!isOpen) return null;

  const handleSuccess = (data: any) => {
      setCustomerEmail(data.email);
      setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-md w-full text-center relative animate-fade-in">
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            ✕
          </button>
          <div className="mb-4 text-green-500 text-5xl">✓</div>
          <h2 className="text-2xl font-bold font-serif mb-2">Payment Successful</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase.<br/>
            A receipt has been sent to <b>{customerEmail}</b>.
          </p>
          <button 
            onClick={onClose}
            className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
          >
            Back to Art
          </button>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
        colorPrimary: '#000000',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={onClose} // Close when clicking backdrop
    >
      <div 
        className="bg-[#FFFBF0] w-full max-w-lg relative animate-slide-up shadow-2xl my-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking content
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 p-2"
        >
          ✕
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-serif font-bold mb-4 border-b border-gray-300 pb-2">
            Checkout
          </h2>

          <div className="mb-4 bg-white p-3 border border-gray-200 text-sm">
            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Order Summary</h3>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-1">
                <span>{item.quantity}x {item.size} Print</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          
          {isInitializing && (
             <div className="text-center py-8 text-gray-500">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
                <p className="text-sm">Securing connection...</p>
             </div>
          )}

          {initError && (
             <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm mb-4">
                <strong>Checkout Error:</strong> {initError}
                <p className="mt-2 text-xs text-gray-500">
                    If you are on localhost, ensure you are running `vercel dev`. 
                    If on Vercel, check STRIPE_SECRET_KEY in settings.
                </p>
             </div>
          )}

          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                    onClose={onClose} 
                    total={total} 
                    cart={cart}
                    onSuccess={handleSuccess}
                />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
