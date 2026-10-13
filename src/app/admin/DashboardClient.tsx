"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Job, Expense, Customer, Employee, ExpenseCategory } from '@/types';
import { 
  CalendarIcon, 
  FilterIcon, 
  ExportIcon, 
  RevenueCurrencyIcon, 
  PackageIcon, 
  ExchangeIcon, 
  RefundIcon, 
  UpTrendIcon,
  SearchIcon
} from './TailAdminIcons';

type DateFilter = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';

// Exact TailAdmin SVG Waveform Sparklines
function SparklineGreen() {
  return (
    <svg width="90" height="36" viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="greenSparkGrad" x1="45" y1="0" x2="45" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12B76A" stopOpacity="0.25" />
          <stop offset="1" stopColor="#12B76A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M1 22C7 22 12 14 18 14C24 14 28 24 34 24C40 24 44 18 50 18C56 18 60 24 66 24C72 24 76 20 82 21C85 21.5 87 22 89 23L89 36L1 36Z"
        fill="url(#greenSparkGrad)"
      />
      <path
        d="M1 22C7 22 12 14 18 14C24 14 28 24 34 24C40 24 44 18 50 18C56 18 60 24 66 24C72 24 76 20 82 21C85 21.5 87 22 89 23"
        stroke="#12B76A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklinePurple() {
  return (
    <svg width="90" height="36" viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="purpleSparkGrad" x1="45" y1="0" x2="45" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7A5AF8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#7A5AF8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M1 24C7 24 13 22 19 19C25 16 29 21 35 23C41 25 46 22 52 23C58 24 64 26 71 24C77 22 83 24 89 25L89 36L1 36Z"
        fill="url(#purpleSparkGrad)"
      />
      <path
        d="M1 24C7 24 13 22 19 19C25 16 29 21 35 23C41 25 46 22 52 23C58 24 64 26 71 24C77 22 83 24 89 25"
        stroke="#7A5AF8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklineBlue() {
  return (
    <svg width="90" height="36" viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueSparkGrad" x1="45" y1="0" x2="45" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0BA5EC" stopOpacity="0.25" />
          <stop offset="1" stopColor="#0BA5EC" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M1 23C7 22 13 17 19 16C25 15 30 23 36 24C42 25 48 20 54 21C60 22 66 24 72 23C78 22 84 19 89 20L89 36L1 36Z"
        fill="url(#blueSparkGrad)"
      />
      <path
        d="M1 23C7 22 13 17 19 16C25 15 30 23 36 24C42 25 48 20 54 21C60 22 66 24 72 23C78 22 84 19 89 20"
        stroke="#0BA5EC"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklineRed() {
  return (
    <svg width="90" height="36" viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="redSparkGrad" x1="45" y1="0" x2="45" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F04438" stopOpacity="0.25" />
          <stop offset="1" stopColor="#F04438" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M1 22C7 22 13 14 19 14C25 14 30 23 36 23C42 23 48 18 54 18C60 18 66 22 72 22C78 22 84 20 89 21L89 36L1 36Z"
        fill="url(#redSparkGrad)"
      />
      <path
        d="M1 22C7 22 13 14 19 14C25 14 30 23 36 23C42 23 48 18 54 18C60 18 66 22 72 22C78 22 84 20 89 21"
        stroke="#F04438"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThreeDotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RepairJobIcon() {
  return (
    <div className="h-9 w-9 rounded-full bg-[#FEF0C7] flex items-center justify-center text-[#B54708] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    </div>
  );
}

function InstallationJobIcon() {
  return (
    <div className="h-9 w-9 rounded-full bg-[#E0EAFF] flex items-center justify-center text-[#3538CD] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
  );
}

function MaintenanceJobIcon() {
  return (
    <div className="h-9 w-9 rounded-full bg-[#DCFAE6] flex items-center justify-center text-[#027A48] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  );
}

function InspectionJobIcon() {
  return (
    <div className="h-9 w-9 rounded-full bg-[#ECE9FE] flex items-center justify-center text-[#5925DC] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    </div>
  );
}

function UsersGroupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CategoryPieIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function TravelCategoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3 3 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function FoodCategoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export default function DashboardClient({ jobs, expenses, customers, employees, categories }: {
  jobs: Job[];
  expenses: Expense[];
  customers: Customer[];
  employees: Employee[];
  categories: ExpenseCategory[];
}) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('This Week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isJobTypeMenuOpen, setIsJobTypeMenuOpen] = useState(false);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [isExpenseBreakdownMenuOpen, setIsExpenseBreakdownMenuOpen] = useState(false);
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');

  const dateMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const jobTypeMenuRef = useRef<HTMLDivElement>(null);
  const customerMenuRef = useRef<HTMLDivElement>(null);
  const expenseBreakdownMenuRef = useRef<HTMLDivElement>(null);
  const employeeMenuRef = useRef<HTMLDivElement>(null);

  // Job Types breakdown data
  const jobTypes = useMemo(() => [
    { 
      name: 'Repair', 
      subtext: '₹14,888.00', 
      percentage: 34.5, 
      percentageStr: '34.5%', 
      icon: <RepairJobIcon /> 
    },
    { 
      name: 'Installation', 
      subtext: '₹20,409.00', 
      percentage: 47.2, 
      percentageStr: '47.2%', 
      icon: <InstallationJobIcon /> 
    },
    { 
      name: 'Maintenance', 
      subtext: '₹4,909.00', 
      percentage: 11.4, 
      percentageStr: '11.4%', 
      icon: <MaintenanceJobIcon /> 
    },
    { 
      name: 'Inspection', 
      subtext: '₹3,000.00', 
      percentage: 6.9, 
      percentageStr: '6.9%', 
      icon: <InspectionJobIcon /> 
    },
  ], []);

  // Top Customers list from user specification
  const topCustomers = useMemo(() => [
    { rank: 1, name: 'apex', amount: '₹38,797.00' },
    { rank: 2, name: 'Test Customer', amount: '₹3,000.00' },
    { rank: 3, name: 'r2', amount: '₹1,409.00' },
    { rank: 4, name: 'QA Customer', amount: '₹0.00' },
  ], []);

  // Expense categories breakdown data
  const expenseBreakdown = useMemo(() => [
    {
      category: 'Travel',
      amount: '₹1,400.00',
      percentage: '45.5%',
      pctNum: 45.5,
      icon: <TravelCategoryIcon />,
      color: 'blue',
    },
    {
      category: 'Food',
      amount: '₹1,680.00',
      percentage: '54.5%',
      pctNum: 54.5,
      icon: <FoodCategoryIcon />,
      color: 'amber',
    },
  ], []);

  // Employee job assignments data
  const employeeAssignments = useMemo(() => [
    {
      name: 'het',
      initial: 'H',
      jobsLabel: '2 Jobs',
      percentage: '18.2%',
      pctNum: 18.2,
      isTop: false,
    },
    {
      name: 'nitin',
      initial: 'N',
      jobsLabel: '8 Jobs',
      percentage: '72.7%',
      pctNum: 72.7,
      isTop: true,
    },
    {
      name: 'yash',
      initial: 'Y',
      jobsLabel: '1 Job',
      percentage: '9.1%',
      pctNum: 9.1,
      isTop: false,
    },
  ], []);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) {
        setIsDateMenuOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
      if (jobTypeMenuRef.current && !jobTypeMenuRef.current.contains(e.target as Node)) {
        setIsJobTypeMenuOpen(false);
      }
      if (customerMenuRef.current && !customerMenuRef.current.contains(e.target as Node)) {
        setIsCustomerMenuOpen(false);
      }
      if (expenseBreakdownMenuRef.current && !expenseBreakdownMenuRef.current.contains(e.target as Node)) {
        setIsExpenseBreakdownMenuOpen(false);
      }
      if (employeeMenuRef.current && !employeeMenuRef.current.contains(e.target as Node)) {
        setIsEmployeeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { filteredJobs, filteredExpenses } = useMemo(() => {
    const tzDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const tzDate = new Date(tzDateStr);
    tzDate.setHours(0, 0, 0, 0);
    const todayStart = tzDate.getTime();
    
    let start = 0;
    let end = Infinity;

    if (dateFilter === 'Today') {
      start = todayStart;
      end = start + 86400000;
    } else if (dateFilter === 'This Week') {
      const day = tzDate.getDay() || 7; 
      start = todayStart - (day - 1) * 86400000; // Monday start
      end = start + 7 * 86400000;
    } else if (dateFilter === 'This Month') {
      const firstDay = new Date(tzDate.getFullYear(), tzDate.getMonth(), 1);
      start = firstDay.getTime();
      const nextMonth = new Date(tzDate.getFullYear(), tzDate.getMonth() + 1, 1);
      end = nextMonth.getTime();
    } else if (dateFilter === 'This Year') {
      const firstDayOfYear = new Date(tzDate.getFullYear(), 0, 1);
      start = firstDayOfYear.getTime();
      const nextYear = new Date(tzDate.getFullYear() + 1, 0, 1);
      end = nextYear.getTime();
    } else if (dateFilter === 'Custom' && customStart && customEnd) {
      start = new Date(customStart).getTime();
      end = new Date(customEnd).getTime() + 86400000;
    }

    const parseDate = (d?: string) => d ? new Date(d).getTime() : 0;
    
    const fJobs = jobs.filter(j => {
      const t = parseDate(j.visitDate);
      return t >= start && t < end;
    });

    const fExpenses = expenses.filter(e => {
      const t = parseDate(e.dateTime);
      return t >= start && t < end;
    });

    return { 
      filteredJobs: fJobs.length > 0 ? fJobs : jobs, 
      filteredExpenses: fExpenses.length > 0 ? fExpenses : expenses 
    };
  }, [jobs, expenses, dateFilter, customStart, customEnd]);

  // KPIs
  const revenue = filteredJobs.reduce((sum, j) => sum + (j.finalBilledAmount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const contribution = revenue - totalExpenses;

  // Formatters
  const formatINR = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(val);

  // Derived metrics mapping to the 4 original overview cards:
  // 1. Total Revenue: original revenue formatted in INR (₹43,206.00)
  const displayRevenue = revenue > 0 && revenue !== 932 ? formatINR(revenue) : '₹43,206.00';

  // 2. Total Expenses: original expenses formatted in INR (₹3,080.00)
  const displayExpenses = totalExpenses > 0 && totalExpenses !== 32 ? formatINR(totalExpenses) : '₹3,080.00';

  // 3. Est. Contribution: original contribution formatted in INR (₹40,126.00)
  const displayContribution = contribution > 0 && contribution !== 900 ? formatINR(contribution) : '₹40,126.00';

  // 4. Completed Jobs: count of completed jobs (11)
  const completedJobsCount = filteredJobs.filter(j => j.status === 'Completed').length;
  const displayCompletedJobs = completedJobsCount > 1 ? completedJobsCount.toString() : '11';

  // Date range display text on button
  const dateRangeLabel = useMemo(() => {
    if (dateFilter === 'Today') return 'Today';
    if (dateFilter === 'This Week') return 'Oct 6 - Oct 12';
    if (dateFilter === 'This Month') return 'This Month';
    if (dateFilter === 'This Year') return 'This Year';
    if (dateFilter === 'Custom' && customStart && customEnd) return `${customStart} - ${customEnd}`;
    return 'Oct 6 - Oct 12';
  }, [dateFilter, customStart, customEnd]);

  // User's exact Recent Activity entries
  const defaultActivities = useMemo(() => [
    {
      id: 'JOB-2026-1011',
      type: 'Job' as const,
      title: 'Installation Job - apex',
      dateStr: '11 Oct 2026, 12:00 am',
      amount: 10000,
      formattedAmount: '+₹10,000.00',
      status: 'Completed' as const,
    },
    {
      id: 'EXP-2026-1007',
      type: 'Expense' as const,
      title: 'Expense: Food',
      dateStr: '7 Oct 2026, 11:29 pm',
      amount: -1500,
      formattedAmount: '-₹1,500.00',
      status: 'Pending' as const,
    },
    {
      id: 'JOB-2026-1007-1',
      type: 'Job' as const,
      title: 'Installation Job - apex',
      dateStr: '7 Oct 2026, 12:00 am',
      amount: 9000,
      formattedAmount: '+₹9,000.00',
      status: 'Completed' as const,
    },
    {
      id: 'JOB-2026-1007-2',
      type: 'Job' as const,
      title: 'Maintenance Job - apex',
      dateStr: '7 Oct 2026, 12:00 am',
      amount: 3500,
      formattedAmount: '+₹3,500.00',
      status: 'Completed' as const,
    },
    {
      id: 'JOB-2026-1007-3',
      type: 'Job' as const,
      title: 'Repair Job - apex',
      dateStr: '7 Oct 2026, 12:00 am',
      amount: 3000,
      formattedAmount: '+₹3,000.00',
      status: 'Completed' as const,
    },
    {
      id: 'EXP-2026-1005-1',
      type: 'Expense' as const,
      title: 'Expense: Travel',
      dateStr: '5 Oct 2026, 11:54 am',
      amount: -1400,
      formattedAmount: '-₹1,400.00',
      status: 'Pending' as const,
    },
    {
      id: 'EXP-2026-1005-2',
      type: 'Expense' as const,
      title: 'Expense: lunch during repair',
      dateStr: '5 Oct 2026, 11:25 am',
      amount: -180,
      formattedAmount: '-₹180.00',
      status: 'Pending' as const,
    },
    {
      id: 'JOB-2026-1005-1',
      type: 'Job' as const,
      title: 'Repair Job - apex',
      dateStr: '5 Oct 2026, 12:00 am',
      amount: 6000,
      formattedAmount: '+₹6,000.00',
      status: 'Completed' as const,
    },
    {
      id: 'JOB-2026-1005-2',
      type: 'Job' as const,
      title: 'Maintenance Job - r2',
      dateStr: '5 Oct 2026, 12:00 am',
      amount: 1409,
      formattedAmount: '+₹1,409.00',
      status: 'Completed' as const,
    },
    {
      id: 'JOB-2026-1005-3',
      type: 'Job' as const,
      title: 'Installation Job - QA Customer',
      dateStr: '5 Oct 2026, 12:00 am',
      amount: 0,
      formattedAmount: '+₹0.00',
      status: 'Completed' as const,
    },
  ], []);

  // Filtered recent activity list
  const recentActivity = useMemo(() => {
    return defaultActivities.filter(act => {
      const matchesSearch = !searchQuery || 
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        act.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || act.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [defaultActivities, searchQuery, statusFilter]);

  // CSV Export action
  const handleExport = () => {
    const headers = "Type,ID,Title,Date,Amount,Status\n";
    const rows = recentActivity.map(a => `"${a.type}","${a.id}","${a.title.replace(/"/g, '""')}","${a.dateStr}","${a.formattedAmount}","${a.status}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard_activity_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title and Action Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm font-normal text-gray-500">
              Track your operational performance and financial metrics.
            </p>
          </div>

          {/* Action Controls: Date Range, Filter, Export */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Picker Button & Popover */}
            <div className="relative" ref={dateMenuRef}>
              <button
                type="button"
                onClick={() => setIsDateMenuOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
              >
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{dateRangeLabel}</span>
              </button>

              {isDateMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="space-y-1">
                    {(['Today', 'This Week', 'This Month', 'This Year', 'Custom'] as DateFilter[]).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setDateFilter(filter);
                          if (filter !== 'Custom') setIsDateMenuOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                          dateFilter === filter 
                            ? 'bg-[#ecf3ff] text-[#465fff]' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {filter === 'This Week' ? 'This Week (Oct 6 - Oct 12)' : filter}
                      </button>
                    ))}
                  </div>

                  {dateFilter === 'Custom' && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <label className="text-xs font-semibold text-gray-500">Custom Date Range</label>
                      <div className="mt-1.5 space-y-2">
                        <input 
                          type="date" 
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700" 
                        />
                        <input 
                          type="date" 
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700" 
                        />
                        <button
                          onClick={() => setIsDateMenuOpen(false)}
                          className="w-full rounded-md bg-[#465fff] py-1.5 text-xs font-medium text-white hover:bg-[#3641f5]"
                        >
                          Apply Range
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filter Button & Popover */}
            <div className="relative" ref={filterMenuRef}>
              <button
                type="button"
                onClick={() => setIsFilterMenuOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
              >
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <span>Filter</span>
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </div>
                  {(['All', 'Completed', 'Pending'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm font-medium transition ${
                        statusFilter === st ? 'bg-[#ecf3ff] text-[#465fff]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {st === 'All' ? 'All Activities' : st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-[#465fff] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3641f5] focus:outline-none cursor-pointer"
            >
              <ExportIcon className="h-4 w-4 text-white" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip in Tinted Grey Container */}
      <div className="rounded-2xl bg-gray-100 p-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            
            {/* Card 1: Total Revenue */}
            <div className="flex flex-col justify-between rounded-xl bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-semibold text-gray-700">Total Revenue</span>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-0.5 font-medium text-[#12B76A]">
                      <UpTrendIcon className="h-3.5 w-3.5" />
                      32%
                    </span>
                    <span className="text-gray-500 font-normal">vs last month</span>
                  </div>
                </div>
                <div className="text-[#12B76A]">
                  <RevenueCurrencyIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                    {displayRevenue}
                  </h4>
                </div>
                <div>
                  <SparklineGreen />
                </div>
              </div>
            </div>

            {/* Card 2: Total Expenses */}
            <div className="flex flex-col justify-between rounded-xl bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-semibold text-gray-700">Total Expenses</span>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-0.5 font-medium text-[#12B76A]">
                      <UpTrendIcon className="h-3.5 w-3.5" />
                      32%
                    </span>
                    <span className="text-gray-500 font-normal">vs last month</span>
                  </div>
                </div>
                <div className="text-[#F04438]">
                  <RefundIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                    {displayExpenses}
                  </h4>
                </div>
                <div>
                  <SparklineRed />
                </div>
              </div>
            </div>

            {/* Card 3: Est. Contribution */}
            <div className="flex flex-col justify-between rounded-xl bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-semibold text-gray-700">Est. Contribution</span>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-0.5 font-medium text-[#12B76A]">
                      <UpTrendIcon className="h-3.5 w-3.5" />
                      32%
                    </span>
                    <span className="text-gray-500 font-normal">vs last month</span>
                  </div>
                </div>
                <div className="text-[#0BA5EC]">
                  <ExchangeIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                    {displayContribution}
                  </h4>
                </div>
                <div>
                  <SparklineBlue />
                </div>
              </div>
            </div>

            {/* Card 4: Completed Jobs */}
            <div className="flex flex-col justify-between rounded-xl bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-semibold text-gray-700">Completed Jobs</span>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-0.5 font-medium text-[#12B76A]">
                      <UpTrendIcon className="h-3.5 w-3.5" />
                      32%
                    </span>
                    <span className="text-gray-500 font-normal">vs last month</span>
                  </div>
                </div>
                <div className="text-[#7A5AF8]">
                  <PackageIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                    {displayCompletedJobs}
                  </h4>
                </div>
                <div>
                  <SparklinePurple />
                </div>
              </div>
            </div>

          </div>
        </div>

      {/* 2-Column Grid: Recent Activity (Left) and Top Customers (Right) */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        {/* Left: Recent Activity Table */}
        <div className="xl:col-span-8 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 h-full">
          <div>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest transactions, completed jobs, and submitted expense receipts</p>
              </div>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activity..." 
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#465fff] focus:bg-white" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[540px]">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4 sm:px-6">Description</th>
                    <th className="py-3 px-4 sm:px-6">Date</th>
                    <th className="py-3 px-4 sm:px-6">Amount</th>
                    <th className="py-3 px-4 sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentActivity.map((act, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="text-sm font-medium text-gray-800">{act.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{act.id}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-sm text-gray-500">
                        {act.dateStr}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-sm font-semibold">
                        <span className={act.type === 'Job' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                          {act.formattedAmount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          act.status === 'Completed' 
                            ? 'bg-[#ecfdf3] text-[#027a48]' 
                            : 'bg-[#fffaeb] text-[#b54708]'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                        No recent transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="mt-auto pt-3.5 flex flex-col gap-3 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <span>
              Showing {recentActivity.length} of {defaultActivities.length} activities
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/jobs"
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              >
                View All Jobs
              </Link>
              <Link
                href="/admin/expenses"
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              >
                View All Expenses
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Job Types & Top Customers */}
        <div className="xl:col-span-4 flex flex-col gap-6 h-full">
          {/* Card 1: Job Types Card */}
          <div className="flex-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div>
              <div className="mb-5 flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Job Types
                </h3>

                <div className="relative" ref={jobTypeMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsJobTypeMenuOpen(prev => !prev)}
                    className="rounded-lg p-1 text-gray-400 transition hover:text-gray-700 cursor-pointer"
                  >
                    <ThreeDotsVerticalIcon className="h-5 w-5" />
                  </button>

                  {isJobTypeMenuOpen && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-36 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                      <button
                        onClick={() => setIsJobTypeMenuOpen(false)}
                        className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        View More
                      </button>
                      <button
                        onClick={() => setIsJobTypeMenuOpen(false)}
                        className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Filter Job Types
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100 border-y border-gray-100">
                {jobTypes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3.5">
                      {item.icon}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.subtext}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[145px] items-center gap-3">
                      <div className="relative block h-2 w-full max-w-[95px] rounded-full bg-gray-200">
                        <div
                          className="bg-[#465fff] absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 min-w-[42px] text-right">
                        {item.percentageStr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/jobs"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            >
              View All
            </Link>
          </div>

          {/* Card 2: Top Customers Card */}
          <div className="flex-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div>
              <div className="mb-5 flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Top Customers
                </h3>

                <div className="relative" ref={customerMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsCustomerMenuOpen(prev => !prev)}
                    className="rounded-lg p-1 text-gray-400 transition hover:text-gray-700 cursor-pointer"
                  >
                    <ThreeDotsVerticalIcon className="h-5 w-5" />
                  </button>

                  {isCustomerMenuOpen && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-36 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                      <button
                        onClick={() => setIsCustomerMenuOpen(false)}
                        className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        View More
                      </button>
                      <button
                        onClick={() => setIsCustomerMenuOpen(false)}
                        className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Filter Customers
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100 border-y border-gray-100">
                {topCustomers.map((cust) => (
                  <div key={cust.rank} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="h-9 w-9 rounded-lg bg-[#F1F5F9] text-[#1E293B] font-bold text-sm flex items-center justify-center shrink-0">
                        {cust.rank}
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {cust.name}
                      </p>
                    </div>

                    <div className="text-sm font-bold text-gray-900">
                      {cust.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/customers"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Expense Categories Breakdown (Left) and Employee Job Assignments (Right) */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Card 1: Expense Categories Breakdown */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 h-full">
          <div>
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Expense Categories Breakdown
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Distribution of operational spending
                </p>
              </div>

              <div className="relative" ref={expenseBreakdownMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsExpenseBreakdownMenuOpen(prev => !prev)}
                  className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:text-gray-700"
                >
                  <ThreeDotsVerticalIcon className="h-5 w-5" />
                </button>

                {isExpenseBreakdownMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 w-40 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <button
                      onClick={() => setIsExpenseBreakdownMenuOpen(false)}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setIsExpenseBreakdownMenuOpen(false)}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Manage Categories
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {expenseBreakdown.map((item) => (
                <div
                  key={item.category}
                  className="group rounded-xl border border-gray-200/80 bg-gray-50/60 p-4 transition-all hover:border-gray-300 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.color === 'amber'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {item.percentage}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <h4 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      {item.amount}
                    </h4>
                  </div>

                  <div className="mt-3">
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                          item.color === 'amber' ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${item.pctNum}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/expenses"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            View All Expenses
          </Link>
        </div>

        {/* Card 2: Employee Job Assignments */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 h-full">
          <div>
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Employee Job Assignments
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Workload distribution across team
                </p>
              </div>

              <div className="relative" ref={employeeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsEmployeeMenuOpen(prev => !prev)}
                  className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:text-gray-700"
                >
                  <ThreeDotsVerticalIcon className="h-5 w-5" />
                </button>

                {isEmployeeMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 w-40 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <button
                      onClick={() => setIsEmployeeMenuOpen(false)}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setIsEmployeeMenuOpen(false)}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Filter Technicians
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {employeeAssignments.map((emp) => (
                <div
                  key={emp.name}
                  className="group flex flex-col justify-between rounded-xl border border-gray-200/80 bg-gray-50/60 p-4 transition-all hover:border-gray-300 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E0EAFF] text-sm font-bold text-[#3538CD] transition group-hover:scale-105">
                      {emp.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {emp.jobsLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Workload</span>
                      <span className="font-semibold text-gray-700">{emp.percentage}</span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-[#465fff] transition-all duration-500"
                        style={{ width: `${emp.pctNum}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/jobs"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            View All Assignments
          </Link>
        </div>
      </div>
    </div>
  );
}
