'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Expense, Job, Employee, Customer, ExpenseCategory } from '@/types';
import { formatKolkataDateTime } from '@/lib/dateUtils';
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  FilterIcon, 
  ExportIcon,
  RevenueCurrencyIcon,
  RefundIcon,
  ExchangeIcon,
  PackageIcon,
  UpTrendIcon
} from '@/app/admin/TailAdminIcons';
import { 
  X, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  PieChart, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

type DateFilter = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';
type OverviewTab = 'overview' | 'daily' | 'margins';

// TailAdmin SVG Waveform Sparklines
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
    <div className="h-9 w-9 rounded-xl bg-[#FEF0C7] flex items-center justify-center text-[#B54708] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    </div>
  );
}

function InstallationJobIcon() {
  return (
    <div className="h-9 w-9 rounded-xl bg-[#E0EAFF] flex items-center justify-center text-[#3538CD] shrink-0">
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
    <div className="h-9 w-9 rounded-xl bg-[#ECFDF3] flex items-center justify-center text-[#027A48] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
  );
}

function InspectionJobIcon() {
  return (
    <div className="h-9 w-9 rounded-xl bg-[#F4EBFF] flex items-center justify-center text-[#6941C6] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
}

function OtherJobIcon() {
  return (
    <div className="h-9 w-9 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#475467] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </div>
  );
}

export default function ReportsClient({
  jobs,
  expenses,
  employees,
  categories,
  customers,
}: {
  jobs: Job[];
  expenses: Expense[];
  employees: Employee[];
  categories: ExpenseCategory[];
  customers: Customer[];
}) {
  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>('This Week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');
  const [chargeableFilter, setChargeableFilter] = useState('');

  // Overview Card Interactive State
  const [overviewTab, setOverviewTab] = useState<OverviewTab>('overview');
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);
  const [isOverviewMenuOpen, setIsOverviewMenuOpen] = useState(false);
  const [isJobTypeMenuOpen, setIsJobTypeMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);

  const dateMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const overviewMenuRef = useRef<HTMLDivElement>(null);
  const jobTypeMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const employeeMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) {
        setIsDateMenuOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
      if (overviewMenuRef.current && !overviewMenuRef.current.contains(e.target as Node)) {
        setIsOverviewMenuOpen(false);
      }
      if (jobTypeMenuRef.current && !jobTypeMenuRef.current.contains(e.target as Node)) {
        setIsJobTypeMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (employeeMenuRef.current && !employeeMenuRef.current.contains(e.target as Node)) {
        setIsEmployeeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helpers
  const getJob = useCallback((id: string) => jobs.find(j => j.id === id), [jobs]);
  const getCustomer = useCallback((id: string) => customers.find(c => c.id === id), [customers]);
  const getEmployeeName = useCallback((id: string) => employees.find(e => e.id === id)?.name || 'Unknown', [employees]);
  const getCategoryName = useCallback((id: string) => categories.find(c => c.id === id)?.name || 'Unknown', [categories]);

  // Date range timestamps based on Asia/Kolkata
  const { dateStart, dateEnd } = useMemo(() => {
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
      start = todayStart - 6 * 86400000;
      end = todayStart + 86400000;
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
    } else if (dateFilter === 'Custom' && customStartDate && customEndDate) {
      start = new Date(customStartDate).getTime();
      end = new Date(customEndDate).getTime() + 86400000;
    }

    return { dateStart: start, dateEnd: end };
  }, [dateFilter, customStartDate, customEndDate]);

  // Date range display text on button
  const dateRangeLabel = useMemo(() => {
    if (dateFilter === 'Today') return 'Today';
    if (dateFilter === 'This Week') return 'Oct 6 - Oct 12';
    if (dateFilter === 'This Month') return 'This Month';
    if (dateFilter === 'This Year') return 'This Year';
    if (dateFilter === 'Custom' && customStartDate && customEndDate) return `${customStartDate} - ${customEndDate}`;
    return 'Oct 6 - Oct 12';
  }, [dateFilter, customStartDate, customEndDate]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const job = getJob(exp.jobId);
      const customer = job ? getCustomer(job.customerId) : null;

      // Date Range
      if (exp.dateTime && dateStart > 0) {
        const expTime = new Date(exp.dateTime).getTime();
        if (expTime < dateStart || expTime >= dateEnd) return false;
      }

      if (customerFilter && customer?.id !== customerFilter) return false;
      if (employeeFilter && exp.employeeId !== employeeFilter) return false;
      if (jobTypeFilter && job?.jobType !== jobTypeFilter) return false;
      if (categoryFilter && exp.categoryId !== categoryFilter) return false;
      if (jobStatusFilter && job?.status !== jobStatusFilter) return false;
      if (chargeableFilter) {
        if (chargeableFilter === 'Chargeable' && exp.customerChargeable !== 'Yes') return false;
        if (chargeableFilter === 'Company' && exp.paidBy !== 'Company') return false;
      }

      return true;
    });
  }, [expenses, dateStart, dateEnd, customerFilter, employeeFilter, jobTypeFilter, categoryFilter, jobStatusFilter, chargeableFilter, getJob, getCustomer]);

  // Derived Job filtering based on filtered expenses
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Date Range (using Visit Date)
      if (job.visitDate && dateStart > 0) {
        const jobTime = new Date(job.visitDate).getTime();
        if (jobTime < dateStart || jobTime >= dateEnd) return false;
      }

      if (customerFilter && job.customerId !== customerFilter) return false;
      if (jobTypeFilter && job.jobType !== jobTypeFilter) return false;
      if (jobStatusFilter && job.status !== jobStatusFilter) return false;
      
      // If employee filter is active, job must have this employee assigned
      if (employeeFilter && !job.assignedEmployeeIds?.includes(employeeFilter)) return false;

      // Category and Chargeable filters
      if (categoryFilter || chargeableFilter) {
        const hasMatchingExpense = expenses.some(exp => 
          exp.jobId === job.id && 
          (!categoryFilter || exp.categoryId === categoryFilter) &&
          (!chargeableFilter || (chargeableFilter === 'Chargeable' && exp.customerChargeable === 'Yes') || (chargeableFilter === 'Company' && exp.paidBy === 'Company'))
        );
        if (!hasMatchingExpense) return false;
      }

      return true;
    });
  }, [jobs, expenses, dateStart, dateEnd, customerFilter, employeeFilter, jobTypeFilter, jobStatusFilter, categoryFilter, chargeableFilter]);

  // Active filter count for popover badge
  const activeFilterCount = 
    (jobStatusFilter ? 1 : 0) +
    (jobTypeFilter ? 1 : 0) +
    (chargeableFilter ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (customerFilter ? 1 : 0) +
    (employeeFilter ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    setJobStatusFilter('');
    setJobTypeFilter('');
    setChargeableFilter('');
    setCategoryFilter('');
    setCustomerFilter('');
    setEmployeeFilter('');
  };

  // Financial Totals
  const totalRevenue = filteredJobs.reduce((sum, job) => sum + (job.finalBilledAmount || job.quotedAmount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const estimatedContribution = totalRevenue - totalExpenses;
  const completedJobsCount = filteredJobs.filter(j => j.status === 'Completed').length;

  const marginPercent = totalRevenue > 0 ? ((estimatedContribution / totalRevenue) * 100).toFixed(1) : '0.0';
  const costRatio = totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : '0.0';
  const avgJobRevenue = filteredJobs.length > 0 ? Math.round(totalRevenue / filteredJobs.length).toLocaleString('en-IN') : '0';

  const chargeableTotal = filteredExpenses.filter(e => e.customerChargeable === 'Yes').reduce((sum, e) => sum + (e.amount || 0), 0);
  const companyPaidTotal = filteredExpenses.filter(e => e.paidBy === 'Company').reduce((sum, e) => sum + (e.amount || 0), 0);

  // Revenue by Job Type (Structured Data)
  const jobTypeDetails = useMemo(() => {
    const allTypes = ['Installation', 'Repair', 'Maintenance', 'Inspection', 'Other'];
    return allTypes.map(type => {
      const matchingJobs = filteredJobs.filter(j => (j.jobType || 'Other') === type);
      const amount = matchingJobs.reduce((sum, j) => sum + (j.finalBilledAmount || j.quotedAmount || 0), 0);
      const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
      
      let icon = <OtherJobIcon />;
      if (type === 'Repair') icon = <RepairJobIcon />;
      if (type === 'Installation') icon = <InstallationJobIcon />;
      if (type === 'Maintenance') icon = <MaintenanceJobIcon />;
      if (type === 'Inspection') icon = <InspectionJobIcon />;

      return {
        type,
        amount,
        count: matchingJobs.length,
        percentage,
        percentageStr: `${percentage.toFixed(1)}%`,
        icon
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [filteredJobs, totalRevenue]);

  // Expenses by Category (Structured Data)
  const categoryDetails = useMemo(() => {
    const map: Record<string, { name: string; amount: number; count: number; chargeable: number }> = {};
    
    filteredExpenses.forEach(exp => {
      const catName = getCategoryName(exp.categoryId);
      if (!map[catName]) {
        map[catName] = { name: catName, amount: 0, count: 0, chargeable: 0 };
      }
      map[catName].amount += exp.amount || 0;
      map[catName].count += 1;
      if (exp.customerChargeable === 'Yes') {
        map[catName].chargeable += exp.amount || 0;
      }
    });

    const colorTokens = [
      { stroke: '#465fff', bg: 'bg-[#465fff]', text: 'text-[#465fff]', light: 'bg-[#ecf3ff]' },
      { stroke: '#F79009', bg: 'bg-[#F79009]', text: 'text-[#F79009]', light: 'bg-[#FEF0C7]' },
      { stroke: '#12B76A', bg: 'bg-[#12B76A]', text: 'text-[#12B76A]', light: 'bg-[#ECFDF3]' },
      { stroke: '#7A5AF8', bg: 'bg-[#7A5AF8]', text: 'text-[#7A5AF8]', light: 'bg-[#F4EBFF]' },
      { stroke: '#F04438', bg: 'bg-[#F04438]', text: 'text-[#F04438]', light: 'bg-[#FEF3F2]' },
      { stroke: '#0BA5EC', bg: 'bg-[#0BA5EC]', text: 'text-[#0BA5EC]', light: 'bg-[#F0F9FF]' }
    ];

    return Object.values(map)
      .sort((a, b) => b.amount - a.amount)
      .map((item, idx) => {
        const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
        return {
          ...item,
          percentage,
          percentageStr: `${percentage.toFixed(1)}%`,
          colors: colorTokens[idx % colorTokens.length]
        };
      });
  }, [filteredExpenses, totalExpenses, getCategoryName]);

  // Expenses by Employee (Structured Data)
  const employeeDetails = useMemo(() => {
    const map: Record<string, { name: string; amount: number; count: number; jobsCount: number }> = {};

    filteredExpenses.forEach(exp => {
      const empName = getEmployeeName(exp.employeeId);
      const key = exp.employeeId || empName;
      if (!map[key]) {
        const assignedJobs = filteredJobs.filter(j => j.assignedEmployeeIds?.includes(exp.employeeId)).length;
        map[key] = { name: empName, amount: 0, count: 0, jobsCount: assignedJobs };
      }
      map[key].amount += exp.amount || 0;
      map[key].count += 1;
    });

    const gradients = [
      'from-[#465fff] to-[#7A5AF8]',
      'from-[#12B76A] to-[#0BA5EC]',
      'from-[#F79009] to-[#F04438]',
      'from-[#6366F1] to-[#A855F7]',
      'from-[#06B6D4] to-[#3B82F6]'
    ];

    return Object.values(map)
      .sort((a, b) => b.amount - a.amount)
      .map((item, idx) => {
        const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
        return {
          ...item,
          percentage,
          percentageStr: `${percentage.toFixed(1)}%`,
          gradient: gradients[idx % gradients.length]
        };
      });
  }, [filteredExpenses, filteredJobs, totalExpenses, getEmployeeName]);

  // 7-Day Chart Data for Financial Overview SVG Chart
  const dailyChartData = useMemo(() => {
    const tzDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const tzDate = new Date(tzDateStr);
    tzDate.setHours(0, 0, 0, 0);

    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(tzDate.getTime() - (6 - i) * 86400000);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const startTs = d.getTime();
      const endTs = startTs + 86400000;

      const dayJobs = filteredJobs.filter(j => {
        const t = j.visitDate ? new Date(j.visitDate).getTime() : 0;
        return t >= startTs && t < endTs;
      });

      const dayExpenses = filteredExpenses.filter(e => {
        const t = e.dateTime ? new Date(e.dateTime).getTime() : 0;
        return t >= startTs && t < endTs;
      });

      const rev = dayJobs.reduce((sum, j) => sum + (j.finalBilledAmount || j.quotedAmount || 0), 0);
      const exp = dayExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const margin = rev - exp;

      return {
        label: `${dayName} ${dateNum} ${monthName}`,
        shortLabel: dayName,
        dateNum,
        monthName,
        revenue: rev,
        expenses: exp,
        margin,
        jobsCount: dayJobs.length,
        expensesCount: dayExpenses.length
      };
    });

    const hasData = buckets.some(b => b.revenue > 0 || b.expenses > 0);
    if (!hasData && (totalRevenue > 0 || totalExpenses > 0)) {
      // Fallback for custom/broad view: group by top categories or service types
      return jobTypeDetails.slice(0, 5).map(item => {
        return {
          label: item.type,
          shortLabel: item.type.slice(0, 4),
          dateNum: 0,
          monthName: '',
          revenue: item.amount,
          expenses: Math.round(item.amount * (totalExpenses / (totalRevenue || 1))),
          margin: Math.round(item.amount * (1 - (totalExpenses / (totalRevenue || 1)))),
          jobsCount: item.count,
          expensesCount: 0
        };
      });
    }

    return buckets;
  }, [filteredJobs, filteredExpenses, totalRevenue, totalExpenses, jobTypeDetails]);

  // Max value calculation for Chart Scaling
  const maxChartVal = useMemo(() => {
    const highestVal = Math.max(
      ...dailyChartData.map(d => Math.max(d.revenue, d.expenses)),
      1000
    );
    return Math.ceil(highestVal / 5000) * 5000;
  }, [dailyChartData]);

  // Export CSV
  const exportCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export for the selected filters.");
      return;
    }

    const headers = [
      "Expense ID", "Job", "Customer", "Employee", "Job Type", "Job Status",
      "Category", "Amount", "Paid By", "Customer Chargeable", "Description",
      "Date/Time", "Expense Status"
    ];

    const rows = filteredExpenses.map(exp => {
      const job = getJob(exp.jobId);
      const customer = job ? getCustomer(job.customerId) : null;
      
      const row = [
        exp.expenseId || "No ID",
        job?.jobId || "Unnamed Job",
        customer?.name || "-",
        getEmployeeName(exp.employeeId),
        job?.jobType || "-",
        job?.status || "-",
        getCategoryName(exp.categoryId),
        exp.amount || 0,
        exp.paidBy || "-",
        exp.customerChargeable || "-",
        (exp.description || "-").replace(/"/g, '""'),
        exp.dateTime ? formatKolkataDateTime(exp.dateTime) : "-",
        exp.status || "-"
      ];
      return `"${row.join('","')}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    let dateStr: string = dateFilter;
    if (dateFilter === 'Custom') dateStr = `${customStartDate}_to_${customEndDate}`;
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_report_${dateStr.replace(/ /g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Financial Report
            </h1>
            <p className="mt-1 text-sm font-normal text-gray-500">
              Track revenue, expenses, contribution, and operational performance.
            </p>
          </div>

          {/* Action Controls: Date Range, Filter, Export */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Picker Button & Popover */}
            <div className="relative" ref={dateMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDateMenuOpen(prev => !prev);
                  setIsFilterMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none cursor-pointer"
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
                        type="button"
                        onClick={() => {
                          setDateFilter(filter);
                          if (filter !== 'Custom') setIsDateMenuOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition cursor-pointer ${
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
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700" 
                        />
                        <input 
                          type="date" 
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700" 
                        />
                        <button
                          type="button"
                          onClick={() => setIsDateMenuOpen(false)}
                          className="w-full rounded-md bg-[#465fff] py-1.5 text-xs font-medium text-white hover:bg-[#3641f5] cursor-pointer"
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
                onClick={() => {
                  setIsFilterMenuOpen(prev => !prev);
                  setIsDateMenuOpen(false);
                }}
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium shadow-sm transition focus:outline-none cursor-pointer ${
                  hasActiveFilters
                    ? 'border-[#465fff]/30 bg-[#ecf3ff] text-[#465fff]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#465fff] text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 sm:w-80 rounded-xl border border-gray-200 bg-white p-3.5 shadow-xl space-y-3.5 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Filter Reports
                    </span>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-xs font-medium text-[#465fff] hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Job Status Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['', 'Open', 'In Progress', 'Completed', 'Cancelled'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setJobStatusFilter(st)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            jobStatusFilter === st
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {st === '' ? 'All' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job Type Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Type</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['', 'Repair', 'Installation', 'Maintenance', 'Inspection', 'Other'] as const).map(jt => (
                        <button
                          key={jt}
                          type="button"
                          onClick={() => setJobTypeFilter(jt)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            jobTypeFilter === jt
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {jt === '' ? 'All Types' : jt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expenses Billing */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Expenses Billing</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: '', label: 'All Expenses' },
                        { id: 'Chargeable', label: 'Chargeable to Customer' },
                        { id: 'Company', label: 'Paid by Company' }
                      ].map(ch => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setChargeableFilter(ch.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            chargeableFilter === ch.id
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expense Category */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Expense Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 px-2.5 text-xs text-gray-700 outline-none focus:border-[#465fff] focus:bg-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Customer Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Customer</label>
                    <select
                      value={customerFilter}
                      onChange={(e) => setCustomerFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 px-2.5 text-xs text-gray-700 outline-none focus:border-[#465fff] focus:bg-white"
                    >
                      <option value="">All Customers</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Employee Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Employee</label>
                    <select
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 px-2.5 text-xs text-gray-700 outline-none focus:border-[#465fff] focus:bg-white"
                    >
                      <option value="">All Employees</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={exportCSV}
              disabled={filteredExpenses.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#465fff] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3641f5] focus:outline-none cursor-pointer disabled:opacity-50"
            >
              <ExportIcon className="h-4 w-4 text-white" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Active Filters State */}
        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-1 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium shrink-0">Active filters:</span>
            <div className="flex flex-wrap items-center gap-2">
              {jobStatusFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Status: {jobStatusFilter}
                  <button onClick={() => setJobStatusFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {jobTypeFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Job Type: {jobTypeFilter}
                  <button onClick={() => setJobTypeFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {chargeableFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Billing: {chargeableFilter === 'Chargeable' ? 'Chargeable' : 'Company Paid'}
                  <button onClick={() => setChargeableFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {categoryFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Category: {getCategoryName(categoryFilter)}
                  <button onClick={() => setCategoryFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {customerFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Customer: {getCustomer(customerFilter)?.name || 'Unknown'}
                  <button onClick={() => setCustomerFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {employeeFilter && (
                <Badge variant="secondary" className="bg-gray-100 border-0 text-gray-700 font-medium px-3 py-1 rounded-full text-xs">
                  Employee: {getEmployeeName(employeeFilter)}
                  <button onClick={() => setEmployeeFilter('')} className="ml-1.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"><X className="w-3 h-3" /></button>
                </Badge>
              )}
              <button 
                onClick={clearAllFilters} 
                className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors ml-1 underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
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
                  ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Billed
                </p>
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
                  <span className="inline-flex items-center gap-0.5 font-medium text-[#F04438]">
                    {costRatio}%
                  </span>
                  <span className="text-gray-500 font-normal">of billed revenue</span>
                </div>
              </div>
              <div className="text-[#F04438]">
                <RefundIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                  ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredExpenses.length} Claims Logged
                </p>
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
                    {marginPercent}%
                  </span>
                  <span className="text-gray-500 font-normal">net margin</span>
                </div>
              </div>
              <div className="text-[#0BA5EC]">
                <ExchangeIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                  ₹{estimatedContribution.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Revenue − Operational Expenses
                </p>
              </div>
              <div>
                <SparklineBlue />
              </div>
            </div>
          </div>

          {/* Card 4: Operating Health */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-semibold text-gray-700">Completed Jobs</span>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-0.5 font-medium text-[#7A5AF8]">
                    ₹{avgJobRevenue}
                  </span>
                  <span className="text-gray-500 font-normal">avg revenue/job</span>
                </div>
              </div>
              <div className="text-[#7A5AF8]">
                <PackageIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="text-3xl font-semibold tracking-tight text-gray-800">
                  {completedJobsCount}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  of {filteredJobs.length} active jobs
                </p>
              </div>
              <div>
                <SparklinePurple />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Section: Financial Overview (TailAdmin Style Chart & Performance Balance) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Financial Overview
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Comparative breakdown of revenue, operational expenses, and net operating margin
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Tabs */}
            <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setOverviewTab('overview')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  overviewTab === 'overview'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Comparison
              </button>
              <button
                type="button"
                onClick={() => setOverviewTab('daily')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  overviewTab === 'daily'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Daily Trends
              </button>
              <button
                type="button"
                onClick={() => setOverviewTab('margins')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  overviewTab === 'margins'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Efficiency
              </button>
            </div>

            {/* Menu */}
            <div className="relative" ref={overviewMenuRef}>
              <button
                type="button"
                onClick={() => setIsOverviewMenuOpen(prev => !prev)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <ThreeDotsVerticalIcon className="h-4 w-4" />
              </button>
              {isOverviewMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg space-y-1">
                  <button
                    onClick={() => { exportCSV(); setIsOverviewMenuOpen(false); }}
                    className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Export Overview Data
                  </button>
                  <button
                    onClick={() => { setOverviewTab('overview'); setIsOverviewMenuOpen(false); }}
                    className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Reset Visual View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Summary Stat Strips */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#12B76A]" /> Total Revenue
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {filteredJobs.length} Jobs
              </span>
            </div>
            <div className="mt-1.5 text-xl font-bold text-gray-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F04438]" /> Operational Expenses
              </span>
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                {filteredExpenses.length} Records
              </span>
            </div>
            <div className="mt-1.5 text-xl font-bold text-gray-900">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0BA5EC]" /> Net Contribution
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {marginPercent}% Margin
              </span>
            </div>
            <div className="mt-1.5 text-xl font-bold text-gray-900">
              ₹{estimatedContribution.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Tab 1: SVG Grouped Bar Chart View */}
        {overviewTab === 'overview' && (
          <div className="space-y-6">
            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 text-xs">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#12B76A]" />
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#F04438]" />
                  <span>Expenses</span>
                </div>
              </div>
              <div className="text-gray-500 text-xs font-normal">
                {hoveredDayIdx !== null ? (
                  <span className="font-semibold text-gray-900">
                    {dailyChartData[hoveredDayIdx].label}: Revenue ₹{dailyChartData[hoveredDayIdx].revenue.toLocaleString('en-IN')} • Expenses ₹{dailyChartData[hoveredDayIdx].expenses.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span>Hover over any bar to inspect daily financial totals</span>
                )}
              </div>
            </div>

            {/* SVG Comparison Chart */}
            <div className="w-full overflow-x-auto">
              <svg 
                viewBox="0 0 600 210" 
                className="w-full h-56 sm:h-64 select-none min-w-[500px]"
              >
                {/* Horizontal Grid lines */}
                {[0, 1, 2, 3, 4].map((step) => {
                  const y = 30 + step * 35; // 30, 65, 100, 135, 170
                  const tickVal = Math.round(maxChartVal * (1 - step / 4));
                  return (
                    <g key={step}>
                      <line
                        x1="55"
                        y1={y}
                        x2="590"
                        y2={y}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                        strokeDasharray={step === 4 ? "0" : "4 4"}
                      />
                      <text
                        x="48"
                        y={y + 3.5}
                        fontSize="10"
                        fill="#94A3B8"
                        textAnchor="end"
                        fontFamily="sans-serif"
                      >
                        ₹{tickVal >= 1000 ? `${(tickVal / 1000).toFixed(0)}k` : tickVal}
                      </text>
                    </g>
                  );
                })}

                {/* Bars for Each Day */}
                {dailyChartData.map((data, idx) => {
                  const totalBars = dailyChartData.length;
                  const colWidth = (590 - 55) / totalBars;
                  const centerX = 55 + idx * colWidth + colWidth / 2;
                  
                  const barWidth = 14;
                  const gap = 3;
                  const revX = centerX - barWidth - gap / 2;
                  const expX = centerX + gap / 2;

                  const revHeight = maxChartVal > 0 ? (data.revenue / maxChartVal) * 140 : 0;
                  const expHeight = maxChartVal > 0 ? (data.expenses / maxChartVal) * 140 : 0;
                  
                  const revY = 170 - revHeight;
                  const expY = 170 - expHeight;

                  const isHovered = hoveredDayIdx === idx;

                  return (
                    <g 
                      key={idx}
                      onMouseEnter={() => setHoveredDayIdx(idx)}
                      onMouseLeave={() => setHoveredDayIdx(null)}
                      className="cursor-pointer group"
                    >
                      {/* Hover column background tint */}
                      <rect
                        x={centerX - colWidth / 2 + 4}
                        y="20"
                        width={colWidth - 8}
                        height="150"
                        fill={isHovered ? "#F8FAFC" : "transparent"}
                        rx="6"
                      />

                      {/* Revenue Bar (Green) */}
                      <rect
                        x={revX}
                        y={revY}
                        width={barWidth}
                        height={Math.max(revHeight, 2)}
                        fill="#12B76A"
                        rx="3"
                        className="transition-all duration-300"
                        opacity={isHovered ? 1 : 0.9}
                      />

                      {/* Expense Bar (Red) */}
                      <rect
                        x={expX}
                        y={expY}
                        width={barWidth}
                        height={Math.max(expHeight, 2)}
                        fill="#F04438"
                        rx="3"
                        className="transition-all duration-300"
                        opacity={isHovered ? 1 : 0.9}
                      />

                      {/* X Axis Label */}
                      <text
                        x={centerX}
                        y="192"
                        fontSize="11"
                        fill={isHovered ? "#0F172A" : "#64748B"}
                        fontWeight={isHovered ? "600" : "500"}
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {data.shortLabel}
                      </text>
                      {data.dateNum > 0 && (
                        <text
                          x={centerX}
                          y="204"
                          fontSize="9"
                          fill="#94A3B8"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {data.dateNum}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Financial Multi-Segment Allocation Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs mb-2 font-medium">
                <span className="text-gray-700">Financial Revenue Allocation</span>
                <span className="text-gray-500">
                  {marginPercent}% Contribution • {costRatio}% Operational Cost
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
                <div 
                  className="bg-[#12B76A] h-full transition-all duration-700" 
                  style={{ width: `${Math.max(Number(marginPercent), 0)}%` }}
                  title={`Net Margin: ${marginPercent}%`}
                />
                <div 
                  className="bg-[#F04438] h-full transition-all duration-700" 
                  style={{ width: `${Math.max(Number(costRatio), 0)}%` }}
                  title={`Expenses: ${costRatio}%`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Ledger View */}
        {overviewTab === 'daily' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Jobs</th>
                  <th className="py-2.5 px-3">Revenue</th>
                  <th className="py-2.5 px-3">Expenses</th>
                  <th className="py-2.5 px-3">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyChartData.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-medium text-gray-800">{d.label}</td>
                    <td className="py-3 px-3 text-gray-500">{d.jobsCount} {d.jobsCount === 1 ? 'job' : 'jobs'}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">₹{d.revenue.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">₹{d.expenses.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      <span className={d.margin >= 0 ? 'text-gray-900' : 'text-rose-600'}>
                        ₹{d.margin.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Margins & Efficiency View */}
        {overviewTab === 'margins' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/60">
              <span className="text-xs font-medium text-gray-500">Gross Margin Efficiency</span>
              <div className="mt-2 text-2xl font-bold text-gray-900">{marginPercent}%</div>
              <p className="mt-1 text-xs text-emerald-600 font-medium">Strong positive yield on billed services</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/60">
              <span className="text-xs font-medium text-gray-500">Cost-to-Income Ratio</span>
              <div className="mt-2 text-2xl font-bold text-gray-900">{costRatio}%</div>
              <p className="mt-1 text-xs text-gray-500">Proportion of revenue consumed by field costs</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/60">
              <span className="text-xs font-medium text-gray-500">Average Revenue / Job</span>
              <div className="mt-2 text-2xl font-bold text-gray-900">₹{avgJobRevenue}</div>
              <p className="mt-1 text-xs text-blue-600 font-medium">Average ticket size across active work orders</p>
            </div>
          </div>
        )}

        {/* Key Performance Ratios Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-gray-500">Profit Margin</div>
              <div className="font-bold text-gray-900 text-sm">{marginPercent}% Contribution</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-gray-500">Operating Overhead</div>
              <div className="font-bold text-gray-900 text-sm">{costRatio}% of Revenue</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-gray-500">Average Job Value</div>
              <div className="font-bold text-gray-900 text-sm">₹{avgJobRevenue} per order</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 3-Column Grid: Revenue by Job Type, Expenses by Category, Expenses by Employee */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Card 1: Revenue by Job Type */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Revenue by Job Type
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Service revenue distribution across work orders
                </p>
              </div>

              <div className="relative" ref={jobTypeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsJobTypeMenuOpen(prev => !prev)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <ThreeDotsVerticalIcon className="h-5 w-5" />
                </button>
                {isJobTypeMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 w-36 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <Link
                      href="/admin/jobs"
                      className="block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View All Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 border-y border-gray-100">
              {jobTypeDetails.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3.5">
                    {item.icon}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.count} {item.count === 1 ? 'job completed' : 'jobs completed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[155px] items-center gap-2.5">
                    <div className="relative block h-2 w-full max-w-[85px] rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="bg-[#465fff] absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {item.percentageStr}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {jobTypeDetails.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No job types recorded for this filter
                </div>
              )}
            </div>

            {/* Spotlight Banner */}
            {jobTypeDetails.length > 0 && jobTypeDetails[0].amount > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
                <span>Top Driver: <strong className="text-gray-900">{jobTypeDetails[0].type}</strong></span>
                <span className="font-semibold text-[#465fff]">{jobTypeDetails[0].percentageStr} of total</span>
              </div>
            )}
          </div>

          <Link
            href="/admin/jobs"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            View All Jobs
          </Link>
        </div>

        {/* Card 2: Expenses by Category */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Expenses by Category
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Distribution of operational spending
                </p>
              </div>

              <div className="relative" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(prev => !prev)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <ThreeDotsVerticalIcon className="h-5 w-5" />
                </button>
                {isCategoryMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 w-36 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <Link
                      href="/admin/expenses"
                      className="block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View All Expenses
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 border-y border-gray-100">
              {categoryDetails.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${item.colors.light} ${item.colors.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.count} {item.count === 1 ? 'record' : 'records'}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[155px] items-center gap-2.5">
                    <div className="relative block h-2 w-full max-w-[85px] rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`${item.colors.bg} absolute top-0 left-0 h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {item.percentageStr}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {categoryDetails.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No expense categories recorded for this filter
                </div>
              )}
            </div>

            {/* Billing Split Banner */}
            <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
              <span>Client Chargeable: <strong className="text-gray-900">₹{chargeableTotal.toLocaleString('en-IN')}</strong></span>
              <span>Paid by Company: <strong className="text-gray-900">₹{companyPaidTotal.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          <Link
            href="/admin/expenses"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            View All Expenses
          </Link>
        </div>

        {/* Card 3: Expenses by Employee */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Expenses by Employee
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Disbursements and field spending tracked by team
                </p>
              </div>

              <div className="relative" ref={employeeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsEmployeeMenuOpen(prev => !prev)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <ThreeDotsVerticalIcon className="h-5 w-5" />
                </button>
                {isEmployeeMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 w-36 space-y-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <Link
                      href="/admin/expenses"
                      className="block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Filter Claims
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 border-y border-gray-100">
              {employeeDetails.map((emp, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${emp.gradient} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {emp.count} {emp.count === 1 ? 'claim' : 'claims'} filed
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[155px] items-center gap-2.5">
                    <div className="relative block h-2 w-full max-w-[85px] rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="bg-[#12B76A] absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ width: `${emp.percentage}%` }}
                      />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900">
                        ₹{emp.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {emp.percentageStr}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {employeeDetails.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No employee claims recorded for this filter
                </div>
              )}
            </div>

            {/* Team Summary Banner */}
            <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
              <span>Active Field Crew</span>
              <span className="font-semibold text-gray-900">{employeeDetails.length} members logged</span>
            </div>
          </div>

          <Link
            href="/admin/expenses"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            View All Expenses
          </Link>
        </div>

      </div>
    </div>
  );
}
