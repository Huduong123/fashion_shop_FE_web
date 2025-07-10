import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/AccountSidebar';
import './AccountLayout.css';

const AccountLayout = () => {
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