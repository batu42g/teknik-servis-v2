import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Navbar from '../components/Navbar';
import Providers from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

export const metadata = {
  title: 'Efe Bilgisayar ve Güvenlik Sistemleri',
  description: 'Bilgisayar tamiri, güvenlik kamerası sistemleri ve teknik servis hizmetleri',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body>
        <Providers session={session}>
          {/* STATİK NAVBAR KALDIRILDI, BİLEŞEN KULLANILIYOR */}
          <Navbar />
          <main className="container py-4">
            {children}
          </main>
          <footer className="bg-dark text-light py-4 mt-auto">
            <div className="container text-center">
              <p>&copy; 2025 Efe Bilgisayar ve Güvenlik Sistemleri. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 