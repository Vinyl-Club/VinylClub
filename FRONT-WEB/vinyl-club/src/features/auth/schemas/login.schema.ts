import * as z from "zod";

const loginSchema = z.object({
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
    .trim()
    .min(1, "Mot de passe obligatoire.")
    .max(72, "72 caractères maximum."),
});

export default loginSchema;