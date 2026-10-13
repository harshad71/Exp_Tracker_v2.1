'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Job, Customer, Employee } from '@/types';
import { adminAddJob } from '@/actions/admin';
import { formatKolkataDate } from '@/lib/dateUtils';
import { useRouter } from 'next/navigation';
import { Plus, X, Briefcase, Users, IndianRupee, FileText, CheckCircle2, AlertCircle, Clock, XCircle, Search, Calendar, ChevronDown } from 'lucide-react';
import { CalendarIcon, FilterIcon } from '@/app/admin/TailAdminIcons';
import { toast } from 'sonner';

type DateFilter = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';

export default function JobsClient({
  initialJobs,
  customers,
  employees,
}: {
  initialJobs: Job[];
  customers: Customer[];
  employees: Employee[];
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  // Filters
  const [customerFilter, setCustomerFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('This Week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dateMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Job Form State
  const [formData, setFormData] = useState({
    customerId: '',
    jobType: 'Repair' as Job['jobType'],
    visitDate: '',
    employeeIds: [] as string[],
    quotedAmount: '' as string | number,
    finalBilledAmount: '' as string | number,
    customerNotes: '',
  });

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown Customer';
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown Employee';

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

  const activeFilterCount = (statusFilter ? 1 : 0) + (jobTypeFilter ? 1 : 0) + (customerFilter ? 1 : 0) + (employeeFilter ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    setStatusFilter('');
    setJobTypeFilter('');
    setCustomerFilter('');
    setEmployeeFilter('');
  };

  const dateRangeLabel = useMemo(() => {
    if (dateFilter === 'Today') return 'Today';
    if (dateFilter === 'This Week') return 'Oct 6 - Oct 12';
    if (dateFilter === 'This Month') return 'This Month';
    if (dateFilter === 'This Year') return 'This Year';
    if (dateFilter === 'Custom' && customStart && customEnd) return `${customStart} - ${customEnd}`;
    return 'Oct 6 - Oct 12';
  }, [dateFilter, customStart, customEnd]);

  const filteredJobs = useMemo(() => {
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

    return jobs.filter(j => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const custName = getCustomerName(j.customerId).toLowerCase();
        const empNames = j.assignedEmployeeIds.map(getEmployeeName).join(' ').toLowerCase();
        const jobMatch = (j.id || '').toLowerCase().includes(query) ||
          (j.jobId || '').toLowerCase().includes(query) ||
          (j.jobType || '').toLowerCase().includes(query) ||
          custName.includes(query) ||
          empNames.includes(query) ||
          (j.customerNotes || '').toLowerCase().includes(query);
        if (!jobMatch) return false;
      }
      if (customerFilter && j.customerId !== customerFilter) return false;
      if (employeeFilter && !j.assignedEmployeeIds.includes(employeeFilter)) return false;
      if (jobTypeFilter && j.jobType !== jobTypeFilter) return false;
      if (statusFilter && j.status !== statusFilter) return false;
      
      const t = j.visitDate ? new Date(j.visitDate).getTime() : 0;
      if (t < start || t >= end) return false;

      return true;
    });
  }, [jobs, customerFilter, employeeFilter, jobTypeFilter, statusFilter, dateFilter, customStart, customEnd, searchQuery, customers, employees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      toast.error('Customer is required');
      return;
    }
    if (formData.employeeIds.length === 0) {
      toast.error('At least one employee must be assigned');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedQuoted = formData.quotedAmount === '' ? undefined : Number(formData.quotedAmount);
      const parsedFinal = formData.finalBilledAmount === '' ? undefined : Number(formData.finalBilledAmount);

      if (parsedQuoted !== undefined && (isNaN(parsedQuoted) || parsedQuoted < 0)) {
        toast.error('Quoted Amount must be a valid positive number');
        setIsSubmitting(false);
        return;
      }
      if (parsedFinal !== undefined && (isNaN(parsedFinal) || parsedFinal < 0)) {
        toast.error('Final Billed Amount must be a valid positive number');
        setIsSubmitting(false);
        return;
      }

      const newJob = await adminAddJob({
        ...formData,
        quotedAmount: parsedQuoted,
        finalBilledAmount: parsedFinal,
      });
      setJobs(prev => [newJob, ...prev]);
      setIsModalOpen(false);
      setFormData({
        customerId: '',
        jobType: 'Repair',
        visitDate: '',
        employeeIds: [],
        quotedAmount: '',
        finalBilledAmount: '',
        customerNotes: '',
      });
      toast.success('Job created successfully');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmployee = (empId: string) => {
    setFormData(prev => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(empId)
        ? prev.employeeIds.filter(id => id !== empId)
        : [...prev.employeeIds, empId]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Clock className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'Open':
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"><AlertCircle className="w-3.5 h-3.5" /> Open</span>;
    }
  };

return (
    <div className="space-y-6">
      {/* Page Header: Job Management */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Job Management
          </h1>
          <p className="mt-1 text-sm font-normal text-gray-500">
            Manage and track all customer service and maintenance operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#465fff] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3641f5] focus:outline-none cursor-pointer"
        >
          <Plus className="h-4 w-4 text-white" />
          <span>New Job</span>
        </button>
      </div>

      {/* Recent Jobs Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
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
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#465fff] text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-3.5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Filter Jobs
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

                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['', 'Open', 'In Progress', 'Completed', 'Cancelled'] as const).map(st => (
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
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Assigned Employee</label>
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
          </div>
        </div>

      {filteredJobs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <FileText className="w-8 h-8 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Job Details</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Schedule & Assignees</th>
                <th className="py-3.5 px-6 text-right">Financials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 py-4 px-6">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{job.jobType}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{job.jobId || 'No ID'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">
                      {getCustomerName(job.customerId)}
                    </div>
                    {job.customerNotes && (
                      <div className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                        <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                        <span className="truncate max-w-[180px]" title={job.customerNotes}>{job.customerNotes}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      job.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {job.status || 'Open'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{job.visitDate ? formatKolkataDate(job.visitDate) : <span className="italic">Unscheduled</span>}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {job.assignedEmployeeIds && job.assignedEmployeeIds.length > 0 
                            ? job.assignedEmployeeIds.map(id => getEmployeeName(id)).join(', ')
                            : <span className="italic">Unassigned</span>}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-slate-500 mr-2 text-xs">Final:</span>
                      <span className="font-bold text-slate-900">
                        {job.finalBilledAmount != null ? `₹${Number(job.finalBilledAmount).toLocaleString('en-IN')}` : '-'}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 mr-2">Quote:</span>
                      <span className="text-slate-600 font-medium">
                        {job.quotedAmount != null ? `₹${Number(job.quotedAmount).toLocaleString('en-IN')}` : '-'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* New Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Create New Job
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="new-job-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.customerId}
                        onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="">Select a customer...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={formData.jobType}
                        onChange={(e) => setFormData({...formData, jobType: e.target.value as Job['jobType']})}
                        className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow appearance-none"
                      >
                        <option value="Repair">Repair</option>
                        <option value="Installation">Installation</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Visit Date</label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Employees <span className="text-red-500">*</span></label>
                    <div className="border border-slate-300 rounded-xl p-3 max-h-[140px] overflow-y-auto space-y-2 bg-slate-50 shadow-sm custom-scrollbar">
                      {employees.map(emp => (
                        <label key={emp.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                          <input 
                            type="checkbox" 
                            checked={formData.employeeIds.includes(emp.id)}
                            onChange={() => toggleEmployee(emp.id)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <span className="text-sm font-medium text-slate-700">{emp.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Quoted Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={formData.quotedAmount}
                        onChange={(e) => setFormData({...formData, quotedAmount: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Final Billed Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={formData.finalBilledAmount}
                        onChange={(e) => setFormData({...formData, finalBilledAmount: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Notes</label>
                  <textarea
                    value={formData.customerNotes}
                    onChange={(e) => setFormData({...formData, customerNotes: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] bg-white shadow-sm text-sm transition-shadow resize-y"
                    placeholder="Enter any specific instructions or requirements..."
                  />
                </div>
              </form>
            </div>
              
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl shrink-0 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
              <button
                form="new-job-form"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
