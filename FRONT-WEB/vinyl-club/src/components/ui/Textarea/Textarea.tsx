'use client';

import { useRef, useState } from 'react';
import styles from './Textarea.module.css';

type Props = {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  error?: string;
  labelClassName?: string;
};

export default function Textarea({
  label,
  id,
  name,
  placeholder,
  error,
  labelClassName,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [count, setCount] = useState(0);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;

    // Auto-grow the field while preserving the layout.
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    setCount(e.currentTarget.value.length);
  };

  return (
    <div className={styles['textarea-field']}>
      <label
        htmlFor={id}
        className={[styles['textarea-field__label'], labelClassName ?? ''].filter(Boolean).join(' ')}
      >
        {label}
      </label>

      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        className={styles['textarea-field__control']}
        rows={3}
        maxLength={500}
        onInput={handleInput}
      />

      <div className={styles['textarea-field__footer']}>
        {error && <p className={styles['textarea-field__error']}>{error}</p>}
        <span className={styles['textarea-field__counter']}>{count}/500</span>
      </div>
    </div>
  );
}
