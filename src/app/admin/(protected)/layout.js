'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Package,
  Calendar,
  MessageSquare,
  LayoutTemplate,
  LogOut,
  ShoppingCart,
  Contact,
  Star
} from 'lucide-react';
import AdminLogoutButton from '../../../components/AdminLogoutButton';

const NavLink = ({ href, children, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-900 text-white' : ''}`}>
      <Icon className="w-5 h-5 mr-3" />
      <span>{children}</span>
    </Link>
  );
};

export default function ProtectedAdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
          Admin Paneli
        </div>
        <nav className="flex flex-col space-y-2">
          <NavLink href="/admin" icon={Home}>Dashboard</NavLink>
          <NavLink href="/admin/users" icon={Users}>Kullanıcılar</NavLink>
          <NavLink href="/admin/orders" icon={ShoppingCart}>Siparişler</NavLink>
          <NavLink href="/admin/appointments" icon={Calendar}>Randevular</NavLink>
          <NavLink href="/admin/contact" icon={Contact}>İletişim Mesajları</NavLink>
          <NavLink href="/admin/slider" icon={LayoutTemplate}>Slider Yönetimi</NavLink>
          <NavLink href="/admin/products" icon={Package}>Ürün Yönetimi</NavLink>
        </nav>
        <div className="mt-auto">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
} 