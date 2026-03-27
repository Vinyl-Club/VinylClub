'use client';

import styles from './Select.module.css';
import { ChevronDown } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  id: string;
  name: string;
  options: Option[];
  placeholder?: string;
  error?: string;
};

export default function Select({
    label,
    id,
    name,
    options,
    placeholder,
    error,
}: Props) {
    return(
        <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.selectWrapper}>
        <select id={id} name={name} className={styles.select}>
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className={styles.chevron} />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
    );
}