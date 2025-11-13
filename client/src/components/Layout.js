import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* This will render the child route components */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

