'use client';

import styles from './Input.module.css';
import { InputHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  id: string;
  error?: string;
  labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  id,
  error,
  labelClassName,
  ...props
}: InputProps) {
  return (
    <div className={styles['input-field']}>
      <label
        htmlFor={id}
        className={[styles['input-field__label'], labelClassName ?? ''].filter(Boolean).join(' ')}
      >
        {label}
      </label>

      <input
        id={id}
        className={[
          styles['input-field__control'],
          error ? styles['input-field__control--error'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {error && <p className={styles['input-field__error']}>{error}</p>}
    </div>
  );
}
