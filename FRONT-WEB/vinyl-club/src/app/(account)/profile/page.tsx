import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth.Server';
import { getCurrentUser } from '@/features/auth/api';
import { getProfilePageData } from '@/features/profil/api';
import ProfilPage from '@/features/profil/view/ProfilPage';
import type { ProfileTab } from '@/features/profil/types';

type ProfilePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeTab(value: string | string[] | undefined): ProfileTab {
  const tab = Array.isArray(value) ? value[0] : value;
  return tab === 'ads' ? 'ads' : 'profile';
}

export default async function Page({ searchParams }: ProfilePageProps) {
  await requireAuth();

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect('/login');
  }

  const params = searchParams ? await searchParams : {};
  const activeTab = normalizeTab(params.tab);
  const profileData = await getProfilePageData(activeTab);

  return <ProfilPage activeTab={activeTab} profileData={profileData} />;
}
