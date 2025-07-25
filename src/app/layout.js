import './globals.css';
import Navbar from '../components/Navbar';
import Providers from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Efe Bilgisayar ve Güvenlik Sistemleri',
  description: 'Bilgisayar tamiri, güvenlik kamerası sistemleri ve teknik servis hizmetleri',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers session={session}>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Efe Bilgisayar ve Güvenlik Sistemleri. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 