import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainShell from '@/components/layout/MainShell';
import '@/styles/global.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">  {/* classe globale */}
      <Header />
      <MainShell>{children}</MainShell>
      <Footer />
    </div>
  );
}

