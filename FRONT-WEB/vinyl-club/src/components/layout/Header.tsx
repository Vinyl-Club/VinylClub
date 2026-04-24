import TopBar from '../ui/Header/TopBar';
import FilterBar from '../ui/Header/FilterBar';
import { getCurrentUser } from '@/features/auth/api';

export default async function Header() {
  const currentUser = await getCurrentUser();

  return (
    <header>
      <TopBar currentUser={currentUser} />
      <FilterBar />
    </header>
  );
}
