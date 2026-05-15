import * as z from "zod"; 

const  registerSchema =  z.object({
    email: z
        .email({
          pattern: z.regexes.email,
          error: (iss) => {
            if (iss.input === "") return "Email obligatoire.";
            return "Email invalide.";
          },
        })
        .max(200, "200 caractères maximum."),
    password: z
      .string()
      .min(1, "Mot de passe obligatoire.")
      .min(12, "12 caractères minimum.")
      .max(72, "72 caractères maximum.")
      .regex(/[A-Z]/, "Vous devez avoir au moins une majuscule.")
      .regex(/[a-z]/, "Vous devez avoir au moins une minuscule.")
      .regex(/\d/, "Vous devez avoir au moins un chiffre.")
      .regex(/[^A-Za-z\d]/, "Vous devez avoir au moins un caractère spécial."),

    confirmPassword: z
      .string()
      .min(12, 'Confirmation du mot de passe obligatoire.'),
    lastName: z
      .string()
      .min(1, "Nom obligatoire.")
      .min(3, "3 caractères minimum.")
      .max(50, "50 caractères maximum.")
      .regex(/^[\p{L}]+(?:[\p{L} '\-]*[\p{L}])?$/u,
        "Lettres, espaces, tirets et apostrophes uniquement."
      ),
    firstName: z
      .string()
      .min(1, "Prénom obligatoire.")
      .min(3, "3 caractères minimum.")
      .max(50, "50 caractères maximum.")
      .regex(/^[\p{L}]+(?:[\p{L} '\-]*[\p{L}])?$/u,
        "Lettres, espaces, tirets et apostrophes uniquement."
      ),
    city: z
      .string()
      .min(1, "Ville obligatoire.")
      .max(70, "70 caractères maximum.")
      .regex(/^[\p{L}]+(?:[\p{L} '\-]*[\p{L}])?$/u,
        "Lettres, espaces, tirets et apostrophes uniquement."
      ),
  })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe sont différents.',
        path: ['confirmPassword'],
});

export default registerSchema;

