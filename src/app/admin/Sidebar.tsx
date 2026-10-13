'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import {
  PriorityPowerLogo,
  DashboardIcon,
  JobsIcon,
  UserIcon,
  ExpensesIcon,
  ChartsIcon,
  ThreeDotsGroupIcon,
} from './TailAdminIcons';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, isCollapsed, closeMobileSidebar } = useSidebar();

  const menuItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
    { href: '/admin/jobs', label: 'Jobs', icon: JobsIcon },
    { href: '/admin/customers', label: 'Customers', icon: UserIcon },
    { href: '/admin/expenses', label: 'Expenses', icon: ExpensesIcon },
    { href: '/admin/reports', label: 'Reports', icon: ChartsIcon },
  ];

  const isRouteActive = (item: NavItem) => {
    if (item.href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(item.href);
  };

  // Nav item renderer matching TailAdmin Sales / Free template
  const renderNavLink = (item: NavItem, collapsed: boolean) => {
    const active = isRouteActive(item);
    const Icon = item.icon;

    if (collapsed) {
      return (
        <li key={item.href + item.label} className="relative group">
          <Link
            href={item.href}
            onClick={closeMobileSidebar}
            className={`relative flex items-center justify-center w-11 h-11 mx-auto rounded-lg transition-colors ${
              active
                ? 'bg-[#ecf3ff] text-[#465fff]'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            aria-label={item.label}
          >
            <Icon
              className={`w-6 h-6 shrink-0 transition-colors ${
                active ? 'text-[#465fff]' : 'text-gray-500 group-hover:text-gray-700'
              }`}
            />
          </Link>
          {/* Tooltip on collapsed rail */}
          <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-lg">
            {item.label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-gray-900" />
          </div>
        </li>
      );
    }

    return (
      <li key={item.href + item.label}>
        <Link
          href={item.href}
          onClick={closeMobileSidebar}
          className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active
              ? 'bg-[#ecf3ff] text-[#465fff]'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <Icon
            className={`w-6 h-6 shrink-0 transition-colors ${
              active ? 'text-[#465fff]' : 'text-gray-500 group-hover:text-gray-700'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  };

  const renderSidebarBody = (collapsed: boolean) => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* SIDEBAR HEADER */}
      <div
        className={`sidebar-header flex items-center pt-8 pb-7 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <Link
          href="/admin"
          onClick={closeMobileSidebar}
          className={`flex items-center gap-3 group transition-transform ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Priority Power"
        >
          <PriorityPowerLogo className="w-9 h-9 shrink-0 transition-transform group-hover:scale-105" />
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 tracking-tight leading-none font-sans whitespace-nowrap">
              Priority Power
            </span>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={closeMobileSidebar}
          className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SIDEBAR MENU */}
      <div className="no-scrollbar flex flex-col flex-1 overflow-y-auto duration-300 ease-linear">
        <nav>
          {/* MENU Category Group */}
          <div>
            <h3 className="mb-4 text-xs leading-5 text-gray-400 uppercase font-medium tracking-wider">
              {!collapsed ? (
                <span>MENU</span>
              ) : (
                <ThreeDotsGroupIcon className="mx-auto fill-current text-gray-400" />
              )}
            </h3>
            <ul className="mb-6 flex flex-col gap-1">
              {menuItems.map((item) => renderNavLink(item, collapsed))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom version badge when expanded */}
      {!collapsed && (
        <div className="pt-4 pb-6 mt-auto border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Priority Power</span>
            <span className="font-semibold text-gray-500">v2.1</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Mobile Backdrop Blur Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* 2. Mobile Drawer (<1024px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[290px] bg-white border-r border-gray-200 px-5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Sidebar"
      >
        {renderSidebarBody(false)}
      </aside>

      {/* 3. Desktop Sticky Sidebar (>=1024px) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 px-5 transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-[90px]' : 'w-[290px]'
        }`}
        aria-label="Desktop Sidebar"
      >
        {renderSidebarBody(isCollapsed)}
      </aside>
    </>
  );
}
