import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  if (cookieStore.get('employeeId')?.value) {
    redirect('/employee');
  }

  if (cookieStore.get('adminSession')?.value !== 'true') {
    redirect('/admin-login');
  }

  return <AdminShell>{children}</AdminShell>;
}
