'use client';

import { useState } from 'react';
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
  labelClassName?: string;
};

export default function Select({
  label,
  id,
  name,
  options,
  placeholder,
  error,
  labelClassName,
}: Props) {
  const [value, setValue] = useState('');

  return (
    <div className={styles['select-field']}>
      <label
        htmlFor={id}
        className={[styles['select-field__label'], labelClassName ?? ''].filter(Boolean).join(' ')}
      >
        {label}
      </label>

      <div className={styles['select-field__control-wrap']}>
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={[
            styles['select-field__control'],
            value === ''
              ? styles['select-field__control--placeholder']
              : styles['select-field__control--selected'],
            error ? styles['select-field__control--error'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {placeholder && <option value="">{placeholder}</option>}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className={styles['select-field__chevron']} />
      </div>

      {error && <p className={styles['select-field__error']}>{error}</p>}
    </div>
  );
}
