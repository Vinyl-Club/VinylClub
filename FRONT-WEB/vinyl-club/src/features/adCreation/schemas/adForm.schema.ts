import * as z from 'zod';

const adFormSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(1, 'Le titre du produit est obligatoire.')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères.'),

  artiste: z
    .string()
    .trim()
    .min(1, "L'artiste est obligatoire.")
    .max(100, "Le nom de l'artiste ne peut pas dépasser 100 caractères."),

  album: z
    .string()
    .trim()
    .min(1, "L'album est obligatoire.")
    .max(100, "Le nom de l'album ne peut pas dépasser 100 caractères."),

  style: z
    .string()
    .trim()
    .min(1, 'La catégorie est obligatoire.'),

  description: z
    .string()
    .trim()
    .min(1, 'La description du produit est obligatoire.')
    .max(500, 'La description ne peut pas dépasser 500 caractères.'),

  etat: z.enum(['TRES_BON_ETAT', 'BON_ETAT', 'MAUVAIS_ETAT'], {
    message: 'État invalide.',
  }),

  prix: z
    .string()
    .trim()
    .min(1, 'Le prix est obligatoire.')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'Le prix doit être un nombre valide.',
    })
    .refine((value) => Number(value) > 0, {
      message: 'Le prix doit être positif.',
    })
    .refine((value) => /^\d{1,8}([.,]\d{1,2})?$/.test(value), {
      message: 'Prix invalide.',
    }),

  format: z.enum(['T33', 'T45', 'T78'], {
    message: 'Format invalide.',
  }),
});

export default adFormSchema;