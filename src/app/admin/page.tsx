import { getCustomers, getEmployees, getExpenseCategories, getExpenses, getJobs } from "@/lib/airtable";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const [jobs, expenses, customers, employees, categories] = await Promise.all([
    getJobs(),
    getExpenses(),
    getCustomers(),
    getEmployees(),
    getExpenseCategories(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardClient 
        jobs={jobs} 
        expenses={expenses} 
        customers={customers} 
        employees={employees} 
        categories={categories} 
      />
    </div>
  );
}
