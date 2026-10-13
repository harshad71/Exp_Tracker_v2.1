'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from './SidebarContext';

function AdminShellContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans antialiased text-gray-900 selection:bg-[#465fff] selection:text-white">
      {/* 1. Interactive Sidebar (Handles desktop sticky w-64/w-20 & mobile drawer) */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out">
        {/* Sticky Interactive Top Bar */}
        <Header />

        {/* Content Canvas */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </SidebarProvider>
  );
}
