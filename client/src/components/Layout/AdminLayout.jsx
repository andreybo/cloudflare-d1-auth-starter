import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Header';

const AdminLayout = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className='container mx-auto'>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;