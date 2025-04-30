import { compare } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import {
  getUtilisateurByID,
  getUtilisateurByCourriel,
} from "./model/utilisateur.js";

// Configuration générale de la stratégie.
const config = {
  usernameField: "courriel",
  passwordField: "mot_de_passe",
};

passport.use(
  new Strategy(config, async (courriel, mot_de_passe, done) => {
    try {
      // On va chercher l'utilisateur dans la base
      // de données avec son courriel
      const utilisateur = await getUtilisateurByCourriel(courriel);

      // Si on ne trouve pas l'utilisateur, on  retourne que l'authentification a échoué
      if (!utilisateur) {
        return done(null, false, { erreur: "Mauvais Courriel" });
      }

      // Si on a trouvé l'utilisateur, on compare son mot de passe dans la base de données
      // on utilise compare car le mot de passe de la base de donne il est hasher
      const valide = await compare(mot_de_passe, utilisateur.mot_de_passe);

      if (!valide) {
        // si le mot de passe incorrect, on retourne le message
        return done(null, false, { erreur: "mauvais mot de passe" });
      }

      //mot de passe correct, on retourne les information d'utilisateur
      return done(null, utilisateur);
    } catch (erreur) {
      //si il y a une erreur de connexion a la base de donnée
      return done(erreur);
    }
  })
);

passport.serializeUser((utilisateur, done) => {
  // On mets uniquement l'id utilisateur dans la session
  done(null, utilisateur.id_utilisateur);
});

passport.deserializeUser(async (idUtilisateur, done) => {
  try {
    const utilisateur = await getUtilisateurByID(idUtilisateur);
    done(null, utilisateur);
  } catch (erreur) {
    done(erreur);
  }
});
