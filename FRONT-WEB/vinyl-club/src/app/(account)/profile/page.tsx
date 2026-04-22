import { requireAuth } from '@/lib/auth.Server';
import { getCurrentUser } from '@/features/auth/api';
import { getCatalog } from '@/features/catalog/api';
import ProfilPage from '@/features/profil/view/ProfilPage';

function getUserDisplayName(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
) {
  if (!user) return null;

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || user.email?.trim() || (user.id ? `Utilisateur #${user.id}` : null);
}

export default async function Page() {
  await requireAuth();

  const [catalogResult, currentUser] = await Promise.all([getCatalog(), getCurrentUser()]);
  const greetingName = getUserDisplayName(currentUser);
  const greeting = greetingName ? `Bonjour : ${greetingName} !` : 'Bonjour !';

  return (
    <ProfilPage
      greeting={greeting}
      items={catalogResult.items}
      catalogError={catalogResult.error}
    />
  );
}
