// lib/cart.js

export const getCartItems = () => {
    if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }
    return [];
};

export const saveCartItems = (cartItems) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const addToCart = (productId, quantity) => {
    const cart = getCartItems();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity });
    }

    saveCartItems(cart);
};

export const updateCartItemQuantity = (productId, newQuantity) => {
    const cart = getCartItems();
    const updatedCart = cart.map(item =>
        item.id === productId ? {...item, quantity: newQuantity } : item
    );
    saveCartItems(updatedCart);
};

export const removeCartItem = (productId) => {
    const cart = getCartItems();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCartItems(updatedCart);
};

export const clearCart = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
    }
};