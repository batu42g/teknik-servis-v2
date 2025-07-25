'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-900 hover:text-red-200 rounded-md transition-colors duration-200"
    >
      <LogOut className="w-5 h-5 mr-3" />
      <span>Çıkış Yap</span>
    </button>
  );
} 