'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/types';
import { adminAddCustomer } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import { Search, Plus, X, Building2, Phone, MapPin, Users, FileText, User } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    address: '',
    notes: '',
  });

  const filteredCustomers = customers.filter(c => {
    const search = searchTerm.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(search) ||
      (c.company || '').toLowerCase().includes(search) ||
      (c.phone || '').toLowerCase().includes(search) ||
      (c.customerId || '').toLowerCase().includes(search)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newCustomer = await adminAddCustomer(formData);
      setCustomers(prev => [...prev, newCustomer]);
      setIsModalOpen(false);
      setFormData({ name: '', company: '', phone: '', address: '', notes: '' });
      toast.success('Customer added successfully');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'C';
  };

return (
    <div className="space-y-6">
      {/* Page Header: Customer Directory */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Customer Directory
          </h1>
          <p className="mt-1 text-sm font-normal text-gray-500">
            Manage your client relationships and company details.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#465fff] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3641f5] focus:outline-none cursor-pointer"
        >
          <Plus className="h-4 w-4 text-white" />
          <span>New Customer</span>
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <h2 className="text-lg font-bold text-gray-900">All Customers</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#465fff] focus:bg-white"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Users className="w-8 h-8 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No customers found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              {searchTerm ? 'We couldn\'t find any customers matching your search criteria.' : 'Get started by adding your first customer to the directory.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-1/4">Customer</th>
                  <th className="py-3.5 px-6 w-1/4">Company</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Location & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 py-4 px-6">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{customer.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{customer.customerId || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.company ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{customer.company}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">No company</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">No phone</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        {customer.address ? (
                          <div className="flex items-start gap-2 text-sm text-slate-700">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span className="truncate max-w-[200px]" title={customer.address}>{customer.address}</span>
                          </div>
                        ) : null}
                        {customer.notes ? (
                          <div className="flex items-start gap-2 text-sm text-slate-500">
                            <FileText className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                            <span className="truncate max-w-[200px]" title={customer.notes}>{customer.notes}</span>
                          </div>
                        ) : null}
                        {!customer.address && !customer.notes && (
                           <span className="text-sm text-slate-400 italic">No additional details</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Add New Customer
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="new-customer-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-shadow"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    placeholder="Enter complete address..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] bg-white shadow-sm text-sm transition-shadow resize-y"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    placeholder="Any specific details about this customer..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] bg-white shadow-sm text-sm transition-shadow resize-y"
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
                form="new-customer-form"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm bg-[#465fff] text-white rounded-xl hover:bg-[#3641f5] transition-colors shadow-sm font-medium disabled:opacity-50 flex items-center cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
