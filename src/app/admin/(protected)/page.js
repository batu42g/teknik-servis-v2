import prisma from '../../../lib/prisma';
import { Users, ShoppingCart, Calendar, Package, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

function StatCard({ title, value, icon, link, linkText }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <Link href={link} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          {linkText} →
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  const appointmentCount = await prisma.appointment.count({
    where: { status: 'PENDING' },
  });
  const pendingOrderCount = await prisma.order.count({
    where: { status: 'PENDING' },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Kullanıcı" 
          value={userCount} 
          icon={<Users className="w-6 h-6" />}
          link="/admin/users"
          linkText="Kullanıcıları Yönet"
        />
        <StatCard 
          title="Toplam Sipariş" 
          value={orderCount} 
          icon={<ShoppingCart className="w-6 h-6" />}
          link="/admin/orders"
          linkText="Siparişleri Görüntüle"
        />
        <StatCard 
          title="Bekleyen Randevular" 
          value={appointmentCount} 
          icon={<Calendar className="w-6 h-6" />}
          link="/admin/appointments"
          linkText="Randevuları Yönet"
        />
         <StatCard 
          title="Onay Bekleyen Siparişler" 
          value={pendingOrderCount} 
          icon={<ShoppingCart className="w-6 h-6 text-yellow-300" />}
          link="/admin/orders"
          linkText="Siparişleri Yönet"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Hızlı Eylemler</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            <Package className="w-4 h-4 inline mr-2" />
            Ürün Yönetimi
          </Link>
          <Link href="/admin/services" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            <LayoutTemplate className="w-4 h-4 inline mr-2" />
            Hizmet Yönetimi
          </Link>
          <Link href="/admin/slider" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            <LayoutTemplate className="w-4 h-4 inline mr-2" />
            Slider Yönetimi
          </Link>
          <Link href="/admin/appointments" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            Randevuları Kontrol Et
          </Link>
        </div>
      </div>
    </div>
  );
} 