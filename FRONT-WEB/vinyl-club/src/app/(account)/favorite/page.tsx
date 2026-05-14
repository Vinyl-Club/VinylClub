import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth.Server';
import { getCurrentUser } from '@/features/auth/api';
import { getFavoritesPageData } from '@/features/favorites/api';
import FavoritesPage from '@/features/favorites/view/FavoritesPage';

export default async function Page() {
  await requireAuth();

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect('/login');
  }

  const favoritesData = await getFavoritesPageData();

  return <FavoritesPage pageData={favoritesData} />;
}
