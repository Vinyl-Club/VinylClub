import AdFormPage from "@/features/adCreation/view/AdFormPage";
import { requireAuth } from '@/lib/auth.Server';

export default async function Page() {
  await requireAuth();
  return <AdFormPage />;
}