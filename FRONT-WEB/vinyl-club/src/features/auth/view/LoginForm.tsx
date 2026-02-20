'use client';
import Input from '@/components/ui/Input/Input';
import styles from './LoginForm.module.css';
import Link from 'next/link';

export default function LoginForm() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bienvenue sur
        <span>Vinyl.Club</span>
      </h1>

      <form className={styles.containerForm}>
        <Input 
          label="Email"
          id="email"
          type="email"
          placeholder="Email@.fr"
          required
          autoComplete="email"
        />

        <Input
          label="Mot de passe"
          id="password"
          type="password"
          placeholder="Mot de passe"
          required
          autoComplete="current-password"
        />

        <div className={styles.containerLinks}>
          <Link href='/register'>S&apos;inscrire</Link>
          <Link href=''>Mot de passe oublié</Link>
        </div>
        
      </form>

    </div>
  );
}