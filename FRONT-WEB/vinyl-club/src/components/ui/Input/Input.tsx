'use client';

import styles from './Input.module.css';
import { InputHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  id: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  id,
  error,
  ...props
}: InputProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <input
        id={id}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        {...props}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}