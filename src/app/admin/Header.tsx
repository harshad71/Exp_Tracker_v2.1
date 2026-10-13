'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminLogoutAction } from '@/actions/adminAuth';
import { useSidebar } from './SidebarContext';
import {
  HamburgerIcon,
  SearchIcon,
  BellIcon,
} from './TailAdminIcons';

export default function Header() {
  const router = useRouter();
  const { toggleSidebar, isCollapsed } = useSidebar();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setNotificationOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await adminLogoutAction();
    router.push('/admin-login');
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white font-sans">
      <div className="flex grow items-center justify-between px-4 sm:px-6 py-3 lg:py-4">
        {/* Left Section: Toggle Button & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Toggle BTN */}
          <button
            onClick={toggleSidebar}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar navigation"
          >
            <HamburgerIcon className="fill-current" />
          </button>

          {/* Search Input Bar (TailAdmin official styling) */}
          <div className="relative hidden sm:block">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
              <SearchIcon className="fill-current" />
            </span>
            <input
              type="text"
              placeholder="Search or type command..."
              className="h-11 w-64 lg:w-96 rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#465fff] focus:ring-3 focus:ring-[#465fff]/10 focus:outline-hidden transition-all"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 font-medium"
            >
              <span>⌘</span>
              <span>K</span>
            </button>
          </div>
        </div>

        {/* Right Section: Utilities, Notifications & User Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Dark Mode / Moon Icon) */}
          <button
            type="button"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle color theme"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Notification Menu Area */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <span className="absolute top-0.5 right-0.5 flex h-2 w-2 items-center justify-center pointer-events-none">
                <span
                  className="absolute inset-0 h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"
                  style={{ animationDuration: '2.5s' }}
                />
                <span className="relative h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <BellIcon className="fill-current" />
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-3 flex w-80 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <h5 className="text-sm font-semibold text-gray-800">Notifications</h5>
                  <span className="text-[10px] font-semibold text-[#465fff] bg-[#ecf3ff] px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-800 block">System Update</span>
                    <span>All services running smoothly with real-time sync.</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-800 block">Expense Approved</span>
                    <span>Recent reimbursement request has been processed.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Area */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded-lg gap-2"
              aria-expanded={userDropdownOpen}
              aria-haspopup="true"
            >
              <span className="h-9 w-9 sm:h-11 sm:w-11 overflow-hidden rounded-full ring-2 ring-gray-100 shrink-0">
                <img
                  src="/images/user-01.jpg"
                  alt="Musharof Chowdhury"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="text-sm font-semibold text-gray-800 hidden sm:block">
                Musharof
              </span>
              {/* Chevron icon toggling up/down */}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 flex w-72 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info header */}
                <div className="pb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Musharof Chowdhury
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    randomuser@pimjo.com
                  </p>
                </div>

                {/* Menu options */}
                <div className="space-y-1 pt-1">
                  {/* 1. Edit profile */}
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer group"
                  >
                    <span className="text-gray-500 group-hover:text-gray-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    </span>
                    <span>Edit profile</span>
                  </button>

                  {/* 2. Account settings */}
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer group"
                  >
                    <span className="text-gray-500 group-hover:text-gray-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                    <span>Account settings</span>
                  </button>

                  {/* 3. Support */}
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer group"
                  >
                    <span className="text-gray-500 group-hover:text-gray-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </span>
                    <span>Support</span>
                  </button>

                  {/* 4. Language */}
                  <div className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 group-hover:text-gray-700">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </span>
                      <span>Language</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs">
                      English 🇺🇸
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100" />

                {/* 5. Sign out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group"
                >
                  <span className="text-gray-500 group-hover:text-red-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </span>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
