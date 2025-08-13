import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/AccountSidebar';
import userService from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import './AccountLayout.css';

const AccountLayout = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data if authenticated but profile data is incomplete
    const fetchUserProfile = async () => {
      if (user && (!user.fullname || !user.email)) {
        try {
          setLoading(true);
          const profileData = await userService.getUserProfile();
          // Update the user data in context
          login(profileData);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user, login]);

  return (
    <div className="account-layout">
      <div className="account-container">
        <AccountSidebar />
        <main className="account-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout; 