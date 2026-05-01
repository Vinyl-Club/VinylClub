import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/global.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">  {/* classe globale */}
      <Header />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
}

