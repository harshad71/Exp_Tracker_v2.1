import { Employee, Customer, Job, Expense, ExpenseCategory } from '../types';

// Ensure this file is only used on the server
import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPlaceholder = (val: string | undefined) => !val || val.includes('your_') || val === 'placeholder' || val === 'pat';

const mockStore: any = {
  Employees: [
    { id: 'recE1', fields: { 'Employee ID': 'EMP-001', 'Name': 'Mock Admin', 'Role': 'admin', 'PIN/Auth identifier': '1234', 'Active': true } },
    { id: 'recE2', fields: { 'Employee ID': 'EMP-002', 'Name': 'Nitin Sharma', 'Role': 'employee', 'PIN/Auth identifier': '0000', 'Active': true } },
    { id: 'recE3', fields: { 'Employee ID': 'EMP-003', 'Name': 'Het Patel', 'Role': 'employee', 'PIN/Auth identifier': '1111', 'Active': true } },
    { id: 'recE4', fields: { 'Employee ID': 'EMP-004', 'Name': 'Yash Verma', 'Role': 'employee', 'PIN/Auth identifier': '2222', 'Active': true } },
    { id: 'recE5', fields: { 'Employee ID': 'EMP-005', 'Name': 'Pooja Nair', 'Role': 'employee', 'PIN/Auth identifier': '3333', 'Active': true } },
    { id: 'recE6', fields: { 'Employee ID': 'EMP-006', 'Name': 'Vikram Rathore', 'Role': 'employee', 'PIN/Auth identifier': '4444', 'Active': true } }
  ],
  Customers: [
    { id: 'recC1', fields: { 'Customer ID': 'CUST-1001', 'Name': 'Apex Technologies', 'Company': 'Apex Technologies Pvt Ltd', 'Phone': '+91 98765 43210', 'Address': '42 Cyber City, Gurgaon' } },
    { id: 'recC2', fields: { 'Customer ID': 'CUST-1002', 'Name': 'Tata Motors', 'Company': 'Tata Motors Ltd', 'Phone': '+91 98111 22334', 'Address': 'Plot 15, Industrial Area, Pune' } },
    { id: 'recC3', fields: { 'Customer ID': 'CUST-1003', 'Name': 'Reliance Retail Hub', 'Company': 'Reliance Retail Ltd', 'Phone': '+91 99223 34455', 'Address': 'Block B, BKC, Mumbai' } },
    { id: 'recC4', fields: { 'Customer ID': 'CUST-1004', 'Name': 'BlueDart Express', 'Company': 'BlueDart Logistics Ltd', 'Phone': '+91 97334 45566', 'Address': 'Airport Cargo Terminal, Delhi' } },
    { id: 'recC5', fields: { 'Customer ID': 'CUST-1005', 'Name': 'Infosys Campus DC-4', 'Company': 'Infosys Limited', 'Phone': '+91 96445 56677', 'Address': 'Electronic City, Bengaluru' } },
    { id: 'recC6', fields: { 'Customer ID': 'CUST-1006', 'Name': 'Apollo Hospitals', 'Company': 'Apollo Health Group', 'Phone': '+91 95556 67788', 'Address': 'Greams Road, Chennai' } },
    { id: 'recC7', fields: { 'Customer ID': 'CUST-1007', 'Name': 'DLF Cyber Park', 'Company': 'DLF Commercial Facilities', 'Phone': '+91 94445 66778', 'Address': 'Phase 2, Sector 24, Gurugram' } },
    { id: 'recC8', fields: { 'Customer ID': 'CUST-1008', 'Name': 'ITC Grand Central', 'Company': 'ITC Hotels Ltd', 'Phone': '+91 93334 55667', 'Address': 'Parel, Mumbai' } }
  ],
  Jobs: [
    {
      id: 'recJ1',
      createdTime: '2026-10-12T04:30:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1012',
        'Customer': ['recC1'],
        'Job Type': 'Installation',
        'Status': 'In Progress',
        'Visit Date': '2026-10-12T10:30:00.000Z',
        'Assigned Employees': ['recE2', 'recE3'],
        'Quoted/Agreed Amount': 25000,
        'Final Billed Amount': 25000,
        'Customer Notes': 'Server room UPS unit wiring & secondary panel installation'
      }
    },
    {
      id: 'recJ2',
      createdTime: '2026-10-11T08:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1011',
        'Customer': ['recC2'],
        'Job Type': 'Repair',
        'Status': 'Completed',
        'Visit Date': '2026-10-11T14:00:00.000Z',
        'Assigned Employees': ['recE2'],
        'Quoted/Agreed Amount': 14500,
        'Final Billed Amount': 14500,
        'Customer Notes': 'Hydraulic compressor sensor fault replaced and calibrated'
      }
    },
    {
      id: 'recJ3',
      createdTime: '2026-10-10T05:30:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1010',
        'Customer': ['recC3'],
        'Job Type': 'Maintenance',
        'Status': 'Completed',
        'Visit Date': '2026-10-10T11:00:00.000Z',
        'Assigned Employees': ['recE4'],
        'Quoted/Agreed Amount': 8200,
        'Final Billed Amount': 8200,
        'Customer Notes': 'Quarterly chiller compressor preventive maintenance'
      }
    },
    {
      id: 'recJ4',
      createdTime: '2026-10-09T09:15:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1009',
        'Customer': ['recC4'],
        'Job Type': 'Inspection',
        'Status': 'Completed',
        'Visit Date': '2026-10-09T16:15:00.000Z',
        'Assigned Employees': ['recE5'],
        'Quoted/Agreed Amount': 5000,
        'Final Billed Amount': 5000,
        'Customer Notes': 'Annual safety inspection of backup diesel generator'
      }
    },
    {
      id: 'recJ5',
      createdTime: '2026-10-08T03:30:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1008',
        'Customer': ['recC5'],
        'Job Type': 'Installation',
        'Status': 'Completed',
        'Visit Date': '2026-10-08T09:00:00.000Z',
        'Assigned Employees': ['recE2', 'recE6'],
        'Quoted/Agreed Amount': 38000,
        'Final Billed Amount': 42000,
        'Customer Notes': 'Dual-bus transformer integration with SCADA monitor'
      }
    },
    {
      id: 'recJ6',
      createdTime: '2026-10-07T07:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1007',
        'Customer': ['recC6'],
        'Job Type': 'Repair',
        'Status': 'In Progress',
        'Visit Date': '2026-10-07T13:30:00.000Z',
        'Assigned Employees': ['recE3'],
        'Quoted/Agreed Amount': 18500,
        'Customer Notes': 'Emergency ICU auxiliary power line short circuit diagnostics'
      }
    },
    {
      id: 'recJ7',
      createdTime: '2026-10-06T10:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1006',
        'Customer': ['recC7'],
        'Job Type': 'Maintenance',
        'Status': 'Completed',
        'Visit Date': '2026-10-06T15:45:00.000Z',
        'Assigned Employees': ['recE2'],
        'Quoted/Agreed Amount': 12000,
        'Final Billed Amount': 12000,
        'Customer Notes': 'Building B elevator power filtration capacitor bank overhaul'
      }
    },
    {
      id: 'recJ8',
      createdTime: '2026-10-05T04:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1005',
        'Customer': ['recC8'],
        'Job Type': 'Inspection',
        'Status': 'Open',
        'Visit Date': '2026-10-14T10:00:00.000Z',
        'Assigned Employees': ['recE4', 'recE5'],
        'Quoted/Agreed Amount': 6500,
        'Customer Notes': 'Pre-monsoon electrical audit and grounding resistance test'
      }
    },
    {
      id: 'recJ9',
      createdTime: '2026-10-04T05:30:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1004',
        'Customer': ['recC1'],
        'Job Type': 'Other',
        'Status': 'Open',
        'Visit Date': '2026-10-15T11:30:00.000Z',
        'Assigned Employees': ['recE6'],
        'Quoted/Agreed Amount': 9500,
        'Customer Notes': 'Energy audit consultancy & harmonic filter recommendation'
      }
    },
    {
      id: 'recJ10',
      createdTime: '2026-10-03T06:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1003',
        'Customer': ['recC3'],
        'Job Type': 'Repair',
        'Status': 'Cancelled',
        'Visit Date': '2026-10-04T12:00:00.000Z',
        'Assigned Employees': ['recE2'],
        'Quoted/Agreed Amount': 7000,
        'Customer Notes': 'Cancelled by customer due to internal facility schedule conflict'
      }
    },
    {
      id: 'recJ11',
      createdTime: '2026-10-02T08:30:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1002',
        'Customer': ['recC2'],
        'Job Type': 'Maintenance',
        'Status': 'Completed',
        'Visit Date': '2026-10-02T14:30:00.000Z',
        'Assigned Employees': ['recE3'],
        'Quoted/Agreed Amount': 16000,
        'Final Billed Amount': 16000,
        'Customer Notes': 'Assembly line conveyor VFD drive firmware flash & lube'
      }
    },
    {
      id: 'recJ12',
      createdTime: '2026-09-27T03:00:00.000Z',
      fields: {
        'Job ID': 'JOB-2026-1001',
        'Customer': ['recC5'],
        'Job Type': 'Installation',
        'Status': 'Completed',
        'Visit Date': '2026-09-28T09:30:00.000Z',
        'Assigned Employees': ['recE2', 'recE4'],
        'Quoted/Agreed Amount': 32000,
        'Final Billed Amount': 32000,
        'Customer Notes': 'Solar rooftop inverters tie-in with grid synchronizer'
      }
    }
  ],
  'Expense Categories': [
    { id: 'recEC1', fields: { 'Name': 'Travel', 'Active': true, 'Sort Order': 1 } },
    { id: 'recEC2', fields: { 'Name': 'Materials', 'Active': true, 'Sort Order': 2 } },
    { id: 'recEC3', fields: { 'Name': 'Food', 'Active': true, 'Sort Order': 3 } },
    { id: 'recEC4', fields: { 'Name': 'Tools & Equipment', 'Active': true, 'Sort Order': 4 } },
    { id: 'recEC5', fields: { 'Name': 'Safety Gear', 'Active': true, 'Sort Order': 5 } },
    { id: 'recEC6', fields: { 'Name': 'Miscellaneous', 'Active': true, 'Sort Order': 6 } }
  ],
  Expenses: [
    {
      id: 'recExp1',
      createdTime: '2026-10-12T06:00:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1012',
        'Job': ['recJ1'],
        'Employee': ['recE2'],
        'Category': ['recEC1'],
        'Amount': 1200,
        'Description': 'Fuel & highway toll charges for Apex installation visit',
        'Paid By': 'Employee',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-12T11:45:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp2',
      createdTime: '2026-10-11T09:30:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1011',
        'Job': ['recJ2'],
        'Employee': ['recE2'],
        'Category': ['recEC2'],
        'Amount': 4850,
        'Description': 'High-pressure hydraulic seal kit replacement',
        'Paid By': 'Company',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-11T15:20:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp3',
      createdTime: '2026-10-10T07:15:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1010',
        'Job': ['recJ3'],
        'Employee': ['recE4'],
        'Category': ['recEC3'],
        'Amount': 650,
        'Description': 'Team refreshments during chiller maintenance work',
        'Paid By': 'Employee',
        'Customer Chargeable': 'No',
        'Date/Time': '2026-10-10T13:10:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp4',
      createdTime: '2026-10-09T10:45:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1009',
        'Job': ['recJ4'],
        'Employee': ['recE5'],
        'Category': ['recEC4'],
        'Amount': 1500,
        'Description': 'Digital multimeter probe replacement',
        'Paid By': 'Company',
        'Customer Chargeable': 'No',
        'Date/Time': '2026-10-09T16:30:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp5',
      createdTime: '2026-10-08T05:00:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1008',
        'Job': ['recJ5'],
        'Employee': ['recE2'],
        'Category': ['recEC2'],
        'Amount': 7200,
        'Description': 'Heavy-duty copper lugs & busbar fasteners',
        'Paid By': 'Company',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-08T11:00:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp6',
      createdTime: '2026-10-07T08:30:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1007',
        'Job': ['recJ6'],
        'Employee': ['recE3'],
        'Category': ['recEC3'],
        'Amount': 1680,
        'Description': 'Emergency field dinner & energy beverages for ICU crew',
        'Paid By': 'Employee',
        'Customer Chargeable': 'No',
        'Date/Time': '2026-10-07T23:29:00.000Z',
        'Status': 'Pending'
      }
    },
    {
      id: 'recExp7',
      createdTime: '2026-10-06T11:00:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1006',
        'Job': ['recJ7'],
        'Employee': ['recE2'],
        'Category': ['recEC1'],
        'Amount': 1400,
        'Description': 'Cab transit to DLF Cyber Park substation',
        'Paid By': 'Employee',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-06T14:15:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp8',
      createdTime: '2026-10-05T06:20:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1005',
        'Job': ['recJ8'],
        'Employee': ['recE5'],
        'Category': ['recEC5'],
        'Amount': 950,
        'Description': 'High-voltage insulated safety gloves & eye protection',
        'Paid By': 'Company',
        'Customer Chargeable': 'No',
        'Date/Time': '2026-10-05T12:00:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp9',
      createdTime: '2026-10-04T07:45:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1004',
        'Job': ['recJ9'],
        'Employee': ['recE6'],
        'Category': ['recEC4'],
        'Amount': 2100,
        'Description': 'Power quality harmonics analyzer calibration kit',
        'Paid By': 'Company',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-04T15:30:00.000Z',
        'Status': 'Pending'
      }
    },
    {
      id: 'recExp10',
      createdTime: '2026-10-03T09:10:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1003',
        'Job': ['recJ10'],
        'Employee': ['recE2'],
        'Category': ['recEC1'],
        'Amount': 450,
        'Description': 'Site parking ticket for cancelled retail hub job',
        'Paid By': 'Employee',
        'Customer Chargeable': 'No',
        'Date/Time': '2026-10-03T11:20:00.000Z',
        'Status': 'Rejected'
      }
    },
    {
      id: 'recExp11',
      createdTime: '2026-10-02T10:00:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1002',
        'Job': ['recJ11'],
        'Employee': ['recE3'],
        'Category': ['recEC2'],
        'Amount': 3400,
        'Description': 'Synthetic industrial gearbox lubricant 5L',
        'Paid By': 'Company',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-10-02T16:00:00.000Z',
        'Status': 'Approved'
      }
    },
    {
      id: 'recExp12',
      createdTime: '2026-09-28T04:30:00.000Z',
      fields: {
        'Expense ID': 'EXP-2026-1001',
        'Job': ['recJ12'],
        'Employee': ['recE2'],
        'Category': ['recEC2'],
        'Amount': 8500,
        'Description': 'Solar MC4 branch connectors & UV conduit piping',
        'Paid By': 'Company',
        'Customer Chargeable': 'Yes',
        'Date/Time': '2026-09-28T11:15:00.000Z',
        'Status': 'Approved'
      }
    }
  ]
};


async function fetchAirtable(table: string, options: RequestInit = {}) {
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (isPlaceholder(API_KEY) || isPlaceholder(BASE_ID)) {
    console.warn(`⚠️ Airtable credentials missing or placeholder. Using local mock data for table: ${table}`);
    
    // Fallback Mock Logic
    const method = options.method || 'GET';
    if (method === 'GET') {
      return { records: mockStore[table] || [] };
    } else if (method === 'POST') {
      const body = JSON.parse(options.body as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newRecords = body.records.map((r: any, i: number) => ({
        id: `mockRec${Date.now()}${i}`,
        createdTime: new Date().toISOString(),
        fields: r.fields
      }));
      if (mockStore[table]) {
        mockStore[table].push(...newRecords);
      }
      return { records: newRecords };
    } else if (method === 'PATCH') {
      const body = JSON.parse(options.body as string);
      return { records: body.records };
    }
    return { records: [] };
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`;
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

// 1. Employees
export async function getEmployees(): Promise<Employee[]> {
  const data = await fetchAirtable('Employees');
  return data.records
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((record: any) => Object.keys(record.fields).length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((record: any) => ({
      id: record.id,
      employeeId: record.fields['Employee ID'],
      name: record.fields.Name || '',
      mobile: record.fields.Mobile,
      role: record.fields.Role || 'employee',
      pin: record.fields['PIN/Auth identifier'],
      active: record.fields.Active ?? true,
    }));
}

// 2. Customers
export async function getCustomers(): Promise<Customer[]> {
  const data = await fetchAirtable('Customers');
  const customersToUpdate: { id: string, customerId: string }[] = [];

  const customers = data.records
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((record: any) => Object.keys(record.fields).length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((record: any) => {
      let customerId = record.fields['Customer ID'];
      if (!customerId) {
        const year = record.createdTime ? new Date(record.createdTime).getFullYear() : new Date().getFullYear();
        const suffix = Math.floor(10000 + Math.random() * 90000);
        customerId = `CUST-${year}-${suffix}`;
        customersToUpdate.push({ id: record.id, customerId });
      }
      return {
        id: record.id,
        customerId,
        name: record.fields.Name || '',
        company: record.fields.Company,
        phone: record.fields.Phone,
        address: record.fields.Address,
        notes: record.fields.Notes,
      };
    });

  if (customersToUpdate.length > 0) {
    for (let i = 0; i < customersToUpdate.length; i += 10) {
      const chunk = customersToUpdate.slice(i, i + 10);
      const payload = {
        records: chunk.map(c => ({
          id: c.id,
          fields: {
            'Customer ID': c.customerId
          }
        }))
      };
      await fetchAirtable('Customers', { method: 'PATCH', body: JSON.stringify(payload) }).catch(e => console.error('Failed to backfill Customer IDs', e));
    }
  }
  
  return customers;
}

// 3. Jobs
export async function getJobs(): Promise<Job[]> {
  const data = await fetchAirtable('Jobs');
  const jobsToUpdate: { id: string, jobId: string }[] = [];

  const jobs = data.records
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((record: any) => record.fields.Customer && record.fields.Customer.length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((record: any) => {
      let jobId = record.fields['Job ID'];
      if (!jobId) {
        const year = record.createdTime ? new Date(record.createdTime).getFullYear() : new Date().getFullYear();
        const suffix = Math.floor(10000 + Math.random() * 90000);
        jobId = `JOB-${year}-${suffix}`;
        jobsToUpdate.push({ id: record.id, jobId });
      }
      return {
        id: record.id,
        jobId,
        customerId: record.fields.Customer[0],
        jobType: record.fields['Job Type'] || 'Other',
        status: record.fields.Status || 'Open',
        visitDate: record.fields['Visit Date'],
        assignedEmployeeIds: record.fields['Assigned Employees'] || [],
        quotedAmount: record.fields['Quoted/Agreed Amount'],
        finalBilledAmount: record.fields['Final Billed Amount'],
        customerNotes: record.fields['Customer Notes'],
        createdBy: record.fields['Created By'],
      };
    });

  if (jobsToUpdate.length > 0) {
    // Airtable allows up to 10 records per request
    for (let i = 0; i < jobsToUpdate.length; i += 10) {
      const chunk = jobsToUpdate.slice(i, i + 10);
      const payload = {
        records: chunk.map(j => ({
          id: j.id,
          fields: {
            'Job ID': j.jobId
          }
        }))
      };
      // Fire and forget or await
      await fetchAirtable('Jobs', { method: 'PATCH', body: JSON.stringify(payload) }).catch(e => console.error('Failed to backfill Job IDs', e));
    }
  }

  return jobs;
}

// 4. Expense Categories
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const data = await fetchAirtable('Expense Categories');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.records.map((record: any) => ({
    id: record.id,
    name: record.fields.Name || '',
    active: record.fields.Active ?? true,
    sortOrder: record.fields['Sort Order'] || 0,
  }));
}

// 5. Expenses
export async function getExpenses(): Promise<Expense[]> {
  const data = await fetchAirtable('Expenses');
  const expensesToUpdate: { id: string, expenseId: string }[] = [];

  const expenses = data.records
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((record: any) => record.fields.Job && record.fields.Job.length > 0 && record.fields.Employee && record.fields.Employee.length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((record: any) => {
      let expenseId = record.fields['Expense ID'];
      if (!expenseId) {
        const year = record.createdTime ? new Date(record.createdTime).getFullYear() : new Date().getFullYear();
        const suffix = Math.floor(10000 + Math.random() * 90000);
        expenseId = `EXP-${year}-${suffix}`;
        expensesToUpdate.push({ id: record.id, expenseId });
      }
      return {
        id: record.id,
        expenseId,
        jobId: record.fields.Job[0],
        employeeId: record.fields.Employee[0],
        categoryId: record.fields.Category ? record.fields.Category[0] : '',
        amount: record.fields.Amount || 0,
        description: record.fields.Description,
        paidBy: record.fields['Paid By'] || 'Employee',
        customerChargeable: record.fields['Customer Chargeable'] || 'Unknown',
        receiptUrl: record.fields.Receipt && record.fields.Receipt.length > 0 ? record.fields.Receipt[0].url : undefined,
        dateTime: record.fields['Date/Time'] || '',
        status: record.fields.Status || 'Submitted',
      };
    });

  if (expensesToUpdate.length > 0) {
    for (let i = 0; i < expensesToUpdate.length; i += 10) {
      const chunk = expensesToUpdate.slice(i, i + 10);
      const payload = {
        records: chunk.map(e => ({
          id: e.id,
          fields: {
            'Expense ID': e.expenseId
          }
        }))
      };
      await fetchAirtable('Expenses', { method: 'PATCH', body: JSON.stringify(payload) }).catch(err => console.error('Failed to backfill Expense IDs', err));
    }
  }

  return expenses;
}

export async function createExpense(expenseData: Omit<Expense, 'id' | 'expenseId' | 'status'> & { receiptBase64?: string, receiptFileName?: string }): Promise<Expense> {
  // Validation
  if (!expenseData.employeeId) {
    throw new Error('Employee ID is required');
  }
  if (!expenseData.jobId) {
    throw new Error('Job ID is required');
  }
  if (!expenseData.categoryId) {
    throw new Error('Category ID is required');
  }
  if (expenseData.amount <= 0) {
    throw new Error('Expense amount must be a positive INR amount');
  }

  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  const generatedExpenseId = `EXP-${year}-${suffix}`;

  const payload = {
    records: [
      {
        fields: {
          'Expense ID': generatedExpenseId,
          'Job': [expenseData.jobId],
          'Employee': [expenseData.employeeId],
          'Category': [expenseData.categoryId],
          'Amount': expenseData.amount,
          'Description': expenseData.description || '',
          'Paid By': expenseData.paidBy,
          'Customer Chargeable': expenseData.customerChargeable,
          'Date/Time': expenseData.dateTime,
          'Status': 'Submitted',
        }
      }
    ]
  };

  const response = await fetchAirtable('Expenses', {
    method: 'POST',

    body: JSON.stringify(payload),
  });

  const record = response.records[0];

  // Upload receipt attachment if provided
  if (expenseData.receiptBase64 && expenseData.receiptFileName) {
    const API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const match = expenseData.receiptBase64.match(/^data:(.+);base64,(.*)$/);
    if (match && !isPlaceholder(API_KEY) && !isPlaceholder(BASE_ID)) {
      const contentType = match[1];
      const base64Data = match[2];
      const uploadUrl = `https://content.airtable.com/v0/${BASE_ID}/${record.id}/Receipt/uploadAttachment`;

      try {
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contentType,
            file: base64Data,
            filename: expenseData.receiptFileName
          })
        });

        if (!uploadRes.ok) {
          console.error("Failed to upload attachment:", await uploadRes.text());
        }
      } catch (err) {
        console.error("Error uploading attachment:", err);
      }
    }
  }

  return {
    id: record.id,
    expenseId: record.fields['Expense ID'] || generatedExpenseId,
    jobId: expenseData.jobId,
    employeeId: expenseData.employeeId,
    categoryId: expenseData.categoryId,
    amount: expenseData.amount,
    description: expenseData.description,
    paidBy: expenseData.paidBy,
    customerChargeable: expenseData.customerChargeable,
    dateTime: expenseData.dateTime,
    status: 'Submitted',
    receiptUrl: undefined, // Usually fetched on reload
  };
}

export async function createCustomer(data: { name: string; company?: string; phone?: string; address?: string; notes?: string }): Promise<Customer> {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  const generatedCustomerId = `CUST-${year}-${suffix}`;

  const payload = {
    records: [{
      fields: {
        'Customer ID': generatedCustomerId,
        'Name': data.name,
        'Company': data.company || '',
        'Phone': data.phone || '',
        'Address': data.address || '',
        'Notes': data.notes || '',
      }
    }]
  };
  const response = await fetchAirtable('Customers', { method: 'POST', body: JSON.stringify(payload) });
  const record = response.records[0];
  return {
    id: record.id,
    customerId: record.fields['Customer ID'] || generatedCustomerId,
    name: record.fields.Name || '',
    company: record.fields.Company,
    phone: record.fields.Phone,
    address: record.fields.Address,
    notes: record.fields.Notes,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createJob(data: { customerId: string; jobType: any; visitDate?: string; employeeIds: string[]; customerNotes?: string; quotedAmount?: number; finalBilledAmount?: number; }): Promise<Job> {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  const jobId = `JOB-${year}-${suffix}`;

  const payload = {
    records: [{
      fields: {
        'Job ID': jobId,
        'Customer': [data.customerId],
        'Job Type': data.jobType,
        'Visit Date': data.visitDate || '',
        'Assigned Employees': data.employeeIds,
        'Customer Notes': data.customerNotes || '',
        'Status': 'Open',
        ...(data.quotedAmount !== undefined ? { 'Quoted/Agreed Amount': data.quotedAmount } : {}),
        ...(data.finalBilledAmount !== undefined ? { 'Final Billed Amount': data.finalBilledAmount } : {}),
      }
    }]
  };
  const response = await fetchAirtable('Jobs', { method: 'POST', body: JSON.stringify(payload) });
  const record = response.records[0];
  return {
    id: record.id,
    jobId: record.fields['Job ID'] || jobId,
    customerId: data.customerId,
    jobType: data.jobType,
    status: 'Open',
    visitDate: data.visitDate,
    assignedEmployeeIds: data.employeeIds,
    customerNotes: data.customerNotes,
    quotedAmount: data.quotedAmount,
    finalBilledAmount: data.finalBilledAmount,
  };
}

