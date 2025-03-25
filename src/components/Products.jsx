import React, { useState, useEffect } from 'react';
import { Box, Card, Button, Typography, IconButton, Paper, Grid, Divider, LinearProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
    <Box sx={{ p: 4 }}>

      <Typography variant="h4" mb={4} sx={{ textAlign: 'center', fontWeight: 600 }}>
        Shopping Cart
      </Typography>


      <Typography variant="h5" mb={2} sx={{ fontWeight: 600 ,textAlign:'justify'}}>Products</Typography>
      <Grid container spacing={2} >
        {PRODUCTS.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 550 }}>{product.name}</Typography>
              <Typography sx={{ fontWeight: 500 }}>₹{product.price}</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, width: '100%' }}

                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" mt={4} mb={2} sx={{ fontWeight: 600 ,textAlign:'justify'}}>Cart Summary</Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {/* Subtotal Section with Divider */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography sx={{ fontWeight: 600 }}>Subtotal:</Typography>
          <Typography sx={{ fontWeight: 600 }}>₹{cartTotal}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />


        <Box sx={{ bgcolor: '#E0F7FA', p: 2, borderRadius: 2 }}>
          {cartTotal < THRESHOLD ? (
            <>
              <Typography>
                Add ₹{THRESHOLD - cartTotal} more to get a <b>FREE Wireless Mouse!</b>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(cartTotal / THRESHOLD) * 100}
                sx={{
                  my: 2,
                  backgroundColor: '#e0e0e0',
                  height: 10,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: cartTotal >= THRESHOLD ? 'aliceblue' : '#1976d2'
                  }
                }}
              />

            </>
          ) : (
            <Typography><b>Congratulations!</b> You got a free Wireless Mouse!</Typography>
          )}
        </Box>
      </Paper>
      
      {cart.length > 0 && (
        <Typography variant="h5" mt={4} mb={2} sx={{ fontWeight: 600,textAlign:'justify' }}>
          Cart Items
        </Typography>
      )}

      {cart.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center', fontWeight: 600, color: 'gray' }}>
          <Typography sx={{ fontWeight: 600, color: 'gray' }}>Your cart is empty</Typography>
          <Typography>Add some products to see them here!</Typography>
        </Paper>
      ) : (
        cart.map((item) => (
          <Card key={item.id} sx={{ mb: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              {/* Product Info */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography color="text.secondary">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</Typography>
              </Box>

              {/* Action Buttons */}
              {item.id !== FREE_GIFT.id ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton sx={{ bgcolor: 'red', color: 'white',borderRadius: '8px',padding: '4px 8px', '&:hover': { bgcolor: '#d32f2f' } }} onClick={() => updateQuantity(item, -1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ fontWeight: 600 }}>{item.quantity}</Typography>
                  <IconButton sx={{ bgcolor: 'green', color: 'white', borderRadius: '8px',padding: '4px 8px','&:hover': { bgcolor: '#388e3c' } }} onClick={() => updateQuantity(item, 1)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography color="success.main" sx={{ bgcolor: '#E8F5E9', px: 2, py: 1, borderRadius: '12px',fontSize:'12px' ,fontWeight: 600 }}>
                  FREE GIFT
                </Typography>
              )}
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Products;  