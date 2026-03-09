'use client';

import { useRef, useState } from "react";
import styles from "./Textarea.module.css";

type Props = {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  error?: string;
};

export default function Textarea({
  label,
  id,
  name,
  placeholder,
  error,
}: Props) {

  const ref = useRef<HTMLTextAreaElement>(null);
  const [count, setCount] = useState(0);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;

    // auto-grow
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";

    setCount(e.currentTarget.value.length);
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        className={styles.textarea}
        rows={3}
        maxLength={500}
        onInput={handleInput}
      />

      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <span className={styles.counter}>{count}/500</span>
      </div>
    </div>
  );
}