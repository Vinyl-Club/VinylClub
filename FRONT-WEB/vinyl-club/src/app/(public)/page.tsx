import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/catalog');
  redirect('/login');
  redirect('/register');
}

