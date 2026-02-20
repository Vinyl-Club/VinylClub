package com.vinylclub.gateway.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

/**
 * Centralise les règles de sécurité de la Gateway.
 *
 * Objectif :
 * - Définir quelles routes sont PUBLIC / AUTH / ADMIN
 * - Lire les règles depuis application.properties (vinyl.security.rules[n])
 * - Éviter une méthode isPublic() avec 40 if
 *
 * Exemple de règle :
 *   PUBLIC|GET|/api/ad/**,/api/products/**
 */
@Component
public class SecurityRules {

    /**
     * Types d'accès possibles pour une route
     *
     * PUBLIC : pas de JWT requis
     * AUTH   : JWT requis (cas par défaut)
     * ADMIN  : JWT requis + rôle ADMIN
     */
    public enum Access {
        PUBLIC,
        AUTH,
        ADMIN
    }

    /**
     * Représente UNE règle de sécurité.
     *
     * access   : niveau d'accès (PUBLIC / AUTH / ADMIN)
     * method   : méthode HTTP concernée (GET, POST, PUT, DELETE, *, OPTIONS)
     * patterns : liste de chemins (supporte /**)
     */
    public record Rule(Access access, String method, List<String> patterns) {}

    /** Liste de toutes les règles chargées depuis la configuration */
    private final List<Rule> rules = new ArrayList<>();

    /** Utilitaire Spring pour matcher /api/** avec des wildcards */
    private final AntPathMatcher matcher = new AntPathMatcher();

    /** Règle par défaut si aucune règle ne matche */
    private final Access defaultAccess;

    /**
     * Constructeur :
     * - Lit les règles depuis application.properties
     * - Construit la liste de Rule une seule fois au démarrage
     */
    public SecurityRules(Environment env) {

        // Lecture de la règle par défaut
        // Si aucune règle ne correspond -> AUTH
        String def = env
                .getProperty("vinyl.security.default", "AUTH")
                .trim()
                .toUpperCase();

        this.defaultAccess = Access.valueOf(def);

        /**
         * Chargement dynamique des règles :
         * vinyl.security.rules[0]
         * vinyl.security.rules[1]
         * vinyl.security.rules[2]
         * ...
         */
        for (int i = 0; ; i++) {
            String raw = env.getProperty("vinyl.security.rules[" + i + "]");
            if (raw == null) {
                break; // plus de règles
            }

            /*
             * Format attendu :
             * ACCESS|METHOD|/path/**,/other/path/**
             */
            String[] parts = raw.split("\\|");
            if (parts.length != 3) {
                continue; // règle invalide, on l’ignore
            }

            // Niveau d’accès (PUBLIC / AUTH / ADMIN)
            Access access = Access.valueOf(parts[0].trim().toUpperCase());

            // Méthode HTTP (GET, POST, *, OPTIONS, ...)
            String method = parts[1].trim().toUpperCase();

            // Liste de patterns (séparés par des virgules)
            List<String> patterns = List.of(parts[2].split(","));

            // Ajout de la règle
            rules.add(new Rule(access, method, patterns));
        }
    }

    /**
     * Détermine le niveau d'accès requis pour une requête.
     *
     * @param path       chemin de la requête (ex: /api/ad/12)
     * @param httpMethod méthode HTTP (GET, POST, ...)
     * @return Access correspondant (PUBLIC / AUTH / ADMIN)
     */
    public Access match(String path, HttpMethod httpMethod) {

        // Nom de la méthode HTTP (ex: GET)
        String method = httpMethod == null ? "" : httpMethod.name();

        // Parcours de toutes les règles dans l'ordre
        for (Rule r : rules) {

            // Vérifie si la méthode HTTP correspond
            boolean methodOk =
                    r.method().equals("*")
                    || r.method().equalsIgnoreCase(method);

            if (!methodOk) {
                continue;
            }

            // Vérifie si un des patterns matche le path
            for (String p : r.patterns()) {
                String pattern = p.trim();

                if (matcher.match(pattern, path)) {
                    // Première règle correspondante => gagnante
                    return r.access();
                }
            }
        }

        // Aucune règle trouvée => règle par défaut
        return defaultAccess;
    }
}
