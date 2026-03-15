'use client';

import { useEffect, useState } from 'react';
import { getCategories } from './api';
import type { Category } from './types.ts';

export function useAdForm() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur chargement catégories', error);
      }
    }

    loadCategories();
  }, []);

  return {
    categories,
  };
}