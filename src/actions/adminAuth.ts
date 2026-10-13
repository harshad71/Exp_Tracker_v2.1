'use server';

import { cookies } from 'next/headers';

export async function adminLoginAction(password: string) {
  let adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.includes('your_')) {
    console.warn('⚠️ Server configuration warning: ADMIN_PASSWORD is not set or is a placeholder. Using local mock/fallback password "admin123".');
    adminPassword = 'admin123';
  }
  
  if (password === adminPassword) {
    (await cookies()).set('adminSession', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });
    return { success: true };
  }
  
  return { success: false, error: 'Invalid admin password' };
}

export async function adminLogoutAction() {
  (await cookies()).delete('adminSession');
}
