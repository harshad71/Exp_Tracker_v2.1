import { getCustomers } from '@/lib/airtable';
import CustomersClient from './CustomersClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  
  return (
    <div className="space-y-6">
      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
