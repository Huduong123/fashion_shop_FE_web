import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/layout';
import AccountLayout from './layouts/AccountLayout/AccountLayout';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import AccountProfile from './pages/Account/AccountProfile';
import AccountAddresses from './pages/Account/AccountAddresses';
import AccountMyOrder from './pages/Account/AccountMyOrder';
import AccountProductFavourite from './pages/Account/AccountProductFavourite';
import Blog from './pages/Blog';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Account Pages with AccountLayout */}
            <Route path="/account" element={<AccountLayout />}>
              <Route path="profile" element={<AccountProfile />} />
              <Route path="orders" element={<AccountMyOrder />} />
              <Route path="favorites" element={<AccountProductFavourite />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="membership" element={<div style={{padding: '20px', textAlign: 'center'}}>Chính sách membership (Coming soon)</div>} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
