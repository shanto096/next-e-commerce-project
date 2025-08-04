   
"use client";
import React, { useState, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { getCartItems, clearCart } from '../../lib/cart';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // যদি লগইন করা না থাকে, তাহলে লগইন পেজে রিডাইরেক্ট করবে
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const fetchCartProducts = async () => {
      try {
        const storedCart = getCartItems();
        if (storedCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const productIds = storedCart.map(item => item.id);
        const response = await fetch('/api/products/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: productIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart products');
        }

        const { data: fetchedProducts } = await response.json();

        // fetchedProducts এবং storedCart ডেটা মার্জ করা
        const mergedCartItems = storedCart.map(cartItem => {
          const product = fetchedProducts.find(p => p._id === cartItem.id);
          return product ? {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.productImage,
            quantity: cartItem.quantity
          } : null;
        }).filter(item => item !== null);

        setCartItems(mergedCartItems);
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [user, router]);

  // মোট মূল্য গণনা করা
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  // ইনপুট ফিল্ডের মান পরিবর্তন হলে স্টেট আপডেট করার জন্য ফাংশন
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  // পেমেন্ট বাটনে ক্লিক করলে এই ফাংশনটি চলবে
  const handlePayment = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }
    setIsProcessing(true);

    // এখানে আপনার আসল পেমেন্ট প্রসেসিং লজিক (যেমন Stripe বা SSLCommerz API) আসবে
    console.log('Processing payment with details:', {
      paymentMethod,
      ...cardDetails,
      orderTotal: total
    });

    // ডেমো হিসেবে কিছু সময় অপেক্ষা করা
    await new Promise(resolve => setTimeout(resolve, 2000));

    // পেমেন্ট সফল হলে
    alert('Payment successful! Thank you for your purchase.');
    clearCart(); // পেমেন্ট সফল হলে কার্ট খালি করা
    setIsProcessing(false);
    router.push('/order-confirmation'); // পেমেন্ট সফল হওয়ার পর অন্য পেজে নেভিগেট করা
  };

  if (loading) {
    return <div className="text-center mt-10">Loading payment page...</div>;
  }
  
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty.</h2>
          <button onClick={() => router.push('/products')} className="text-blue-500 hover:underline">
            Go to products page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 sm:p-10 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">

        {/* পেমেন্ট ফর্ম সেকশন */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment</h2>
          
          <form onSubmit={handlePayment}>
            {/* পেমেন্ট মেথড নির্বাচন */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Select a Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer transition duration-300 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="absolute opacity-0"
                  />
                  <FaCreditCard className="text-3xl text-gray-600 mr-2" />
                  <span className="text-gray-700 font-medium">Credit/Debit Card</span>
                </label>
                <label className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer transition duration-300 ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="absolute opacity-0"
                  />
                  <FaPaypal className="text-3xl text-gray-600 mr-2" />
                  <span className="text-gray-700 font-medium">PayPal</span>
                </label>
              </div>
            </div>

            {/* কার্ডের তথ্য ইনপুট */}
            {paymentMethod === 'card' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Enter cardholder's name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 space-x-2 text-gray-400">
                      <FaCcVisa className="text-2xl" />
                      <FaCcMastercard className="text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* পেমেন্ট বোতাম */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay Now ৳${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        {/* অর্ডার সারসংক্ষেপ সেকশন */}
        <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-contain" />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <span className="text-lg font-bold text-gray-700">৳{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-gray-600 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>৳{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax ({taxRate * 100}%)</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-2xl font-bold text-gray-800 border-t border-gray-300 pt-4 mt-4">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentPage;
