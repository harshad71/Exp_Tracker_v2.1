'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Expense, Job, Employee, Customer, ExpenseCategory } from '@/types';
import { adminAddExpense } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import { formatKolkataDateTime } from '@/lib/dateUtils';
import { CalendarIcon, FilterIcon } from '@/app/admin/TailAdminIcons';
import { 
  Search, 
  Plus, 
  X, 
  Receipt, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Upload, 
  IndianRupee, 
  Briefcase, 
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';

type DateFilter = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';

export default function ExpensesClient({
  initialExpenses,
  jobs,
  employees,
  categories,
  customers,
}: {
  initialExpenses: Expense[];
  jobs: Job[];
  employees: Employee[];
  categories: ExpenseCategory[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('This Week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [customerFilter, setCustomerFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [chargeableFilter, setChargeableFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const dateMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Expense Form State
  const [formData, setFormData] = useState({
    jobId: '',
    employeeId: '',
    categoryId: '',
    amount: '',
    description: '',
    paidBy: 'Employee' as 'Employee' | 'Company',
    customerChargeable: 'Unknown' as 'Yes' | 'No' | 'Unknown',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Helpers
  const getJob = (id: string) => jobs.find(j => j.id === id);
  const getCustomer = (id: string) => customers.find(c => c.id === id);
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) {
        setIsDateMenuOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = 
    (categoryFilter ? 1 : 0) + 
    (chargeableFilter ? 1 : 0) + 
    (statusFilter ? 1 : 0) + 
    (employeeFilter ? 1 : 0) + 
    (customerFilter ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    setCategoryFilter('');
    setChargeableFilter('');
    setStatusFilter('');
    setEmployeeFilter('');
    setCustomerFilter('');
  };

  const dateRangeLabel = useMemo(() => {
    if (dateFilter === 'Today') return 'Today';
    if (dateFilter === 'This Week') return 'Oct 6 - Oct 12';
    if (dateFilter === 'This Month') return 'This Month';
    if (dateFilter === 'This Year') return 'This Year';
    if (dateFilter === 'Custom' && customStart && customEnd) return `${customStart} - ${customEnd}`;
    return 'Oct 6 - Oct 12';
  }, [dateFilter, customStart, customEnd]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobId || !formData.employeeId || !formData.categoryId) {
      toast.error('Job, Employee, and Category are required');
      return;
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    setIsSubmitting(true);

    try {
      let receiptBase64 = undefined;
      let receiptFileName = undefined;
      
      if (receiptFile) {
        receiptBase64 = await toBase64(receiptFile);
        receiptFileName = receiptFile.name;
      }

      const newExpense = await adminAddExpense({
        jobId: formData.jobId,
        employeeId: formData.employeeId,
        categoryId: formData.categoryId,
        amount: amt,
        description: formData.description,
        paidBy: formData.paidBy,
        customerChargeable: formData.customerChargeable,
        dateTime: new Date().toISOString(),
        receiptBase64,
        receiptFileName,
      });

      setExpenses(prev => [newExpense, ...prev]);
      setIsModalOpen(false);
      setFormData({
        jobId: '',
        employeeId: '',
        categoryId: '',
        amount: '',
        description: '',
        paidBy: 'Employee',
        customerChargeable: 'Unknown',
      });
      setReceiptFile(null);
      toast.success('Expense added successfully');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Logic
  const filteredExpenses = useMemo(() => {
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
    } else if (dateFilter === 'Custom' && customStart && customEnd) {
      start = new Date(customStart).getTime();
      end = new Date(customEnd).getTime() + 86400000;
    }

    return expenses.filter(exp => {
      const job = getJob(exp.jobId);
      const customer = job ? getCustomer(job.customerId) : null;
      const empName = getEmployeeName(exp.employeeId);
      const catName = getCategoryName(exp.categoryId);

      // 1. Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          (exp.expenseId || '').toLowerCase().includes(query) ||
          (job?.jobId || '').toLowerCase().includes(query) ||
          empName.toLowerCase().includes(query) ||
          catName.toLowerCase().includes(query) ||
          (exp.description || '').toLowerCase().includes(query) ||
          (customer?.name || '').toLowerCase().includes(query);
        
        if (!matches) return false;
      }

      // 2. Date Filter
      const t = exp.dateTime ? new Date(exp.dateTime).getTime() : 0;
      if (t < start || t >= end) return false;

      // 3. Customer Filter
      if (customerFilter && customer?.id !== customerFilter) return false;

      // 4. Employee Filter
      if (employeeFilter && exp.employeeId !== employeeFilter) return false;

      // 5. Category Filter
      if (categoryFilter && exp.categoryId !== categoryFilter) return false;

      // 6. Status Filter
      if (statusFilter && (exp.status || 'Pending') !== statusFilter) return false;

      // 7. Chargeable / Paid By Filter
      if (chargeableFilter) {
        if (chargeableFilter === 'Chargeable' && exp.customerChargeable !== 'Yes') return false;
        if (chargeableFilter === 'Company' && exp.paidBy !== 'Company') return false;
      }

      return true;
    });
  }, [
    expenses, 
    searchQuery, 
    dateFilter, 
    customStart, 
    customEnd, 
    customerFilter, 
    employeeFilter, 
    categoryFilter, 
    statusFilter, 
    chargeableFilter, 
    jobs, 
    customers, 
    employees, 
    categories
  ]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [filteredExpenses]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header: Expense Management */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Expense Management
          </h1>
          <p className="mt-1 text-sm font-normal text-gray-500">
            Manage and track all company and job-related expenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2">
            <span className="text-xs font-medium text-gray-500 mr-2">Filtered Total:</span>
            <span className="text-sm font-bold text-gray-900">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#465fff] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3641f5] focus:outline-none cursor-pointer"
          >
            <Plus className="h-4 w-4 text-white" />
            <span>New Expense</span>
          </button>
        </div>
      </div>

      {/* Recent Expenses Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Expenses</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expenses..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#465fff] focus:bg-white"
              />
            </div>

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
                          type="button"
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
                <FilterIcon className="h-4 w-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#465fff] text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filters</span>
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

                  {/* Category Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCategoryFilter('')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                          categoryFilter === ''
                            ? 'bg-[#465fff] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCategoryFilter(c.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            categoryFilter === c.id
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Billing / Chargeable Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Type & Billing</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['', 'Chargeable', 'Company'] as const).map(ch => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setChargeableFilter(ch)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            chargeableFilter === ch
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {ch === '' ? 'All Types' : ch === 'Chargeable' ? 'Customer Chargeable' : 'Paid by Company'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['', 'Approved', 'Pending', 'Rejected'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            statusFilter === st
                              ? 'bg-[#465fff] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {st === '' ? 'All' : st}
                        </button>
                      ))}
                    </div>
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
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Receipt className="w-8 h-8 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No expenses found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              We couldn&apos;t find any expenses matching your current filters or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Expense Details</th>
                  <th className="py-3.5 px-6">Employee & Job</th>
                  <th className="py-3.5 px-6">Type & Billing</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                  <th className="py-3.5 px-6">Status & Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map(exp => {
                  const job = getJob(exp.jobId);
                  const customer = job ? getCustomer(job.customerId) : null;
                  const dateStr = formatKolkataDateTime(exp.dateTime);
                  
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/50 py-4 px-6">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">{getCategoryName(exp.categoryId)}</span>
                          <span className="text-xs text-slate-500 mt-1">{dateStr}</span>
                          <span className="text-xs text-slate-400 font-mono mt-1">{exp.expenseId || 'No ID'}</span>
                          {exp.description && (
                            <div className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                              <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                              <span className="truncate max-w-[200px]" title={exp.description}>{exp.description}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-800">{getEmployeeName(exp.employeeId)}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md w-fit">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{job?.jobId || 'Unnamed Job'}</span>
                          </div>
                          {customer && (
                            <div className="text-xs text-slate-500 truncate max-w-[180px]">
                              {customer.name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-slate-500 mr-2 text-xs">Paid By:</span>
                            <span className={`font-medium ${exp.paidBy === 'Company' ? 'text-blue-600' : 'text-slate-700'}`}>{exp.paidBy}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-slate-500 mr-2 text-xs">Chargeable:</span>
                            {exp.customerChargeable === 'Yes' ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">YES</span>
                            ) : exp.customerChargeable === 'No' ? (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">NO</span>
                            ) : (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">UNKNOWN</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-base font-bold text-slate-900">
                          ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          <div>
                            {getStatusBadge(exp.status || 'Pending')}
                          </div>
                          {exp.receiptUrl ? (
                            <a 
                              href={exp.receiptUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded-md transition-colors w-fit"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              View Receipt
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1 w-fit">
                              <Receipt className="w-3.5 h-3.5 opacity-50" />
                              No Receipt
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Log New Expense
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer">
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="new-expense-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Job <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.jobId}
                        onChange={(e) => setFormData({...formData, jobId: e.target.value})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="">Select a job...</option>
                        {jobs.map(j => {
                          const cName = getCustomer(j.customerId)?.name || 'Unknown';
                          return <option key={j.id} value={j.id}>{j.jobId || 'No ID'} - {cName}</option>
                        })}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="">Select an employee...</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="">Select a category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Who paid for this? <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.paidBy}
                        onChange={(e) => setFormData({...formData, paidBy: e.target.value as 'Employee' | 'Company'})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="Employee">Employee (Reimbursable)</option>
                        <option value="Company">Company (Corporate Card/Account)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Billable to Customer? <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.customerChargeable}
                        onChange={(e) => setFormData({...formData, customerChargeable: e.target.value as 'Yes' | 'No' | 'Unknown'})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="Unknown">Unknown (Decide later)</option>
                        <option value="Yes">Yes, add to invoice</option>
                        <option value="No">No, internal expense</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Receipt / Attachment <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="mb-1 text-sm text-slate-600 font-medium">
                          {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG or PDF</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] bg-white shadow-sm text-sm transition-shadow resize-y"
                    placeholder="Provide details about what was purchased..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl shrink-0 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="new-expense-form"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm bg-[#465fff] text-white rounded-xl hover:bg-[#3641f5] transition-colors font-medium disabled:opacity-50 flex items-center shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
