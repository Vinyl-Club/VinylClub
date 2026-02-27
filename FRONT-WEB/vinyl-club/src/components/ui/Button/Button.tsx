'use client';
import styles from './Button.module.css'
import type {ButtonHTMLAttributes, ReactNode} from 'react';

type Variant = "primary" | "secondary";

type Props = {
    children: ReactNode;
    variant: Variant;
    fullWidth: boolean;
    isLoading: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant,
    fullWidth,
    isLoading,
    disabled,
    type = 'button',
    ...props
}: Props) {
    return (
        <button
            type={type}
            className={[
                styles.button,
                styles[variant],
                fullWidth ? styles.fullWidth :'',
                isLoading ? styles.loading : '',
            ].join(' ')}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...props}
        >
            {isLoading ? 'Chargement' : children}
        </button>
    );
}