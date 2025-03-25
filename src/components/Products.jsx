import React, { useState, useEffect } from 'react';
import './Products.css';

const Products = () => {
  const PRODUCTS = [
    { id: 1, name: 'Laptop', price: 500 },
    { id: 2, name: 'Smartphone', price: 300 },
    { id: 3, name: 'Headphones', price: 100 },
    { id: 4, name: 'Smartwatch', price: 150 },
  ];

  const FREE_GIFT = { id: 99, name: 'Wireless Mouse', price: 0 };
  const THRESHOLD = 1000;

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (product, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.id === product.id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);

    setCart(updatedCart);
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = calculateTotal();

  useEffect(() => {
    if (cartTotal >= THRESHOLD && !cart.some((item) => item.id === FREE_GIFT.id)) {
      setCart([...cart, { ...FREE_GIFT, quantity: 1 }]);
    }
  }, [cartTotal]);
  const isFreeGiftEligible = cartTotal >= THRESHOLD;

  // Check if the free gift is already in the cart
  const hasFreeGift = cart.some((item) => item.id === FREE_GIFT.id);
  
  if (isFreeGiftEligible && !hasFreeGift) {
    cart.push({ ...FREE_GIFT, quantity: 1 });
  }

  return (
    <div className="container">
      <h1 className="title">Shopping Cart</h1>

      <h2 className="section-title">Products</h2>
      <div className="products-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-name">{product.name}</div>
            <div className="product-price">₹{product.price}</div>
            <button className="add-button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">Cart Summary</h2>
      <div className="cart-summary">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>₹{cartTotal}</span>
        </div>
        <div className="divider" />

        <div className="progress-box">
          {cartTotal < THRESHOLD ? (
            <>
              <p>Add ₹{THRESHOLD - cartTotal} more to get a <b>FREE Wireless Mouse!</b></p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(cartTotal / THRESHOLD) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <p><b>Congratulations!</b> You got a free Wireless Mouse!</p>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <h2 className="section-title">Cart Items</h2>
      )}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p className='empty1'>Your cart is empty</p>
          <p>Add some products to see them here!</p>
        </div>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-content">
              <div>
                <h3 className="product-name">{item.name}</h3>
                <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
              </div>

              {item.id !== FREE_GIFT.id ? (
                <div className="quantity-controls">
                  <button className="quantity-button decrease-button" onClick={() => updateQuantity(item, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-button increase-button" onClick={() => updateQuantity(item, 1)}>+</button>
                </div>
              ) : (
                <span className="free-gift-badge">FREE GIFT</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;