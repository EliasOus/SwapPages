// Charger les configurations du projet
import "dotenv/config";

import https from "https";
import { readFile } from "fs/promises";
import express, { json, request, response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { engine } from "express-handlebars";
import session from "express-session";
import memorystrore from "memorystore";
import passport from "passport";

import {
  getEchanges,
  getEchangeUtilisateur,
  deleteEchangeUtilisateur,
  getlivres,
  creeEchangelivre,
  getEchange,
  getProposition,
  getPropositions,
  creePropositionlivre,
} from "./model/livre.js";
import { calculePrixTotal } from "./public/js/calculePrixTotal.js";
import {
  validerIdlivre,
  validerIdEchange,
  validerIdUtilisateur,
  validerNomEchange,
  validerQuantite,
  validerIdProposition,
  validerCourriel,
  validerMotDePasse,
  validerNomPrenom,
  validerAcces,
  validerNomAuteurTitre,
} from "./validationServer.js";

import {
  creerUtilisateur,
  getUtilisateurByCourriel,
  getUtilisateurByID,
} from "./model/utilisateur.js";

import "./authentification.js";
import { title } from "process";

// Créer le serveur
const app = express();

// initialisation et creation de la base de donne session
const MemoryStore = memorystrore(session);

//ajouter des engines
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Ajout de middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());

// configuration de la politique CSP pour afficher les src image extrene
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", "http://books.google.com"],
    },
  })
);
//configuration session
app.use(
  session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
//configuration de base de l'authentification
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

// Création de middlewares pour API

//middlewares pour verififer est ce que l'utilisateur est connecte
function utilisateurConnecte(request, response, next) {
  if (!request.user) {
    response.status(401).end();
    return;
  }

  next();
}
//middlewares pour verififer est ce que l'utilisateur n'est pas connecte
function utilisateurPasConnecte(request, response, next) {
  if (request.user) {
    response.status(401).end();
    return;
  }

  next();
}

// Création de middlewares pour handlebars

//middlewares pour verififer est ce que l'utilisateur est connecte cote client
function utilisateurConnecteClient(request, response, next) {
  if (!request.user) {
    response.redirect("/");
    return;
  }

  next();
}

//middlewares pour verififer est ce que l'utilisateur n'est pas connecte cote client
function utilisateurPasConnecteClient(request, response, next) {
  if (request.user) {
    response.redirect("/");
    return;
  }

  next();
}

// Programmation des pages handlebars

/**
 * Page handlebars accueil
 */
app.get("/", async (request, response) => {
  const dbEchanges = await getEchanges();

  response.render("echanges", {
    titre: "livre | Accueil",
    styles: ["/css/echanges.css"],
    dbEchanges: dbEchanges,

    //variable pour gerer les utilisateur
    utilisateur: request.user,
  });
});

/**
 * Page handlebars utilisateur
 */
app.get(
  "/utilisateur",
  utilisateurConnecteClient,
  async (request, response) => {
    const id_utilisateur = request.user.id_utilisateur;
    const dbUtilisateur = await getEchangeUtilisateur(id_utilisateur);

    response.render("utilisateur", {
      titre: "Utilisateur",
      styles: ["/css/utilisateur.css"],
      scripts: ["/js/utilisateur.js"],
      dbUtilisateur: dbUtilisateur,

      //variable pour gerer les utilisateur
      utilisateur: request.user,
    });
  }
);

/**
 * Page handlebars a propos
 */
app.get("/apropos", (request, response) => {
  response.render("apropos", {
    titre: "livre | À propos",
    styles: ["/css/a-propos.css"],

    //variable pour gerer les utilisateur
    utilisateur: request.user,
  });
});

/**
 * handlebars pour page de connexion
 */
app.get("/connexion", utilisateurPasConnecteClient, (request, response) => {
  response.render("authentification", {
    titre: "livre | Connexion",
    styles: ["/css/authentification.css"],
    scripts: ["/js/connexion.js"],
    type: "connexion",
    btnType: "Se Connecter",
    // Variable pour changer le type de texte dans le bouton qui alterne entre connexion et inscription
    btnswitch: "inscription",
    btnTitre: "S'inscrire",
    paragraphe: "Vous n’avez pas de compte ?",

    //variable pour gerer les utilisateur
    utilisateur: request.user,
  });
});

/**
 * handlebars pour page d'inscription
 */
app.get("/inscription", utilisateurPasConnecteClient, (request, response) => {
  response.render("authentification", {
    titre: "livre | Inscription",
    styles: ["/css/authentification.css"],
    scripts: ["/js/inscription.js"],
    type: "inscription",
    btnType: "S’inscrire",
    // Variable pour changer le type de texte dans le bouton qui alterne entre connexion et inscription
    btnswitch: "Connexion",
    btnTitre: "Se connecter",
    paragraphe: "Vous avez un compte ?",
    //ajouter cette variable pour afficher ou supprime les input nom et prenom
    inscription: true,

    //variable pour gerer les utilisateur
    utilisateur: request.user,
  });
});

/**
 * handlebars pour la page creer proposition
 */
app.get(
  "/creerProposition",
  utilisateurConnecteClient,
  async (request, response) => {
    const titre = "management";
    const dblivres = await getlivres(titre);

    response.render("creerEchangeProposition", {
      titre: "livre | Creer Proposition",
      styles: ["/css/creerEchangeProposition.css"],
      scripts: [
        "/js/creerEchangeProposition.js",
        "/js/validationCreerEchange.js",
        "/js/afficherMessageErreur.js",
      ],
      dblivres: dblivres,
      type: "proposition",
      btnType: "Creer Proposition",
      paragraphe: "Creer Proposition : ",

      //variable pour gerer les utilisateur
      utilisateur: request.user,
    });
  }
);

/**
 * Page handlebars creer echange
 */
app.get(
  "/creerEchange",
  utilisateurConnecteClient,
  async (request, response) => {
    const titre = "management";
    const dblivres = await getlivres(titre);

    response.render("creerEchangeProposition", {
      titre: "livre | Creer Echange",
      styles: ["/css/creerEchangeProposition.css"],
      scripts: [
        "/js/creerEchangeProposition.js",
        "/js/validationCreerEchange.js",
        "/js/afficherMessageErreur.js",
      ],
      dblivres: dblivres,
      type: "echange",
      btnType: "Creer Echange",
      creerEchange: true,
      paragraphe: "Creer l'Echange : ",

      //variable pour gerer les utilisateur
      utilisateur: request.user,
    });
  }
);

/**
 * Page handlebars Recherche
 */
app.get(
  "/resultatRecherche",
  utilisateurConnecteClient,
  async (request, response) => {
    const titre = request.query.titre;
    const dblivres = await getlivres(titre);

    response.render(
      "partials/resultatRecherche",
      {
        layout: false,
        styles: ["/css/creerEchangeProposition.css"],
        scripts: [
          "/js/creerEchangeProposition.js",
          "/js/validationCreerEchange.js",
          "/js/afficherMessageErreur.js",
        ],
        dblivres: dblivres,
      },
      (err, html) => {
        if (err) {
          return response.status(500).send("erreru du rendu");
        }
        response.send(html);
      }
    );
  }
);

/**
 * Page handlebars pour la page proposition
 * la page pour afficher les livres pour chaque proposition
 */
app.get(
  "/proposition",
  utilisateurConnecteClient,
  async (request, response) => {
    if (validerIdProposition(parseInt(request.query.id_proposition))) {
      const dbProposition = await getProposition(request.query.id_proposition);

      if (dbProposition.length > 0) {
        // Vérification si l'utilisateur qui a créé l'échange est le même que celui actuellement connecté.
        if (
          dbProposition[0].id_utilisateur_echange !==
          request.user.id_utilisateur
        ) {
          response.redirect("/");
          return;
        }

        //calculer le prix total des livres
        const prixTotal = calculePrixTotal(dbProposition);

        response.render("echangeProposition", {
          titre: "livre | Proposition",
          styles: ["/css/echange.css"],
          // scripts: ["/js/echange.js"],
          dbEchangeProposition: dbProposition,
          prixTotal: prixTotal,

          // Récupère le premier proposition et le stocke dans dbNomEchange.
          // Ensuite, on peut accéder à le nom echange à travers dbNomEchange.nom_echange.
          // et on peut acceder aussi à les information de l'utilisateur qui a creer proposition
          dbInfo: dbProposition[0],
          type: "proposition",

          //variable pour gerer les utilisateur
          utilisateur: request.user,
        });
      } else {
        response.status(404).end();
      }
    } else {
      response.status(400).end();
    }
  }
);

//Page handlebars Echange
app.get("/echange", async (request, response) => {
  if (validerIdEchange(parseInt(request.query.id_echange))) {
    const dbEchange = await getEchange(request.query.id_echange);
    const dbProposition = await getPropositions(request.query.id_echange);

    if (dbEchange.length > 0) {
      //verification est ce que l'utilisateur est connecte
      //et si l’échange n’a pas été créé par l’utilisateur lui-meme
      //pour afficher ou masque le button et la liste des propositions
      let ISeligiblebtn = false;
      let ISeligibleliste = false;
      if (request.user) {
        if (request.user.id_utilisateur !== dbEchange[0].id_utilisateur) {
          ISeligiblebtn = true;
        } else {
          ISeligibleliste = true;
        }
      }

      //calculer le prix total des livres
      const prixTotal = calculePrixTotal(dbEchange);

      response.render("echangeProposition", {
        titre: "livre | Echange",
        styles: ["/css/echange.css"],
        scripts: ["/js/echangeProposition.js"],
        dbEchangeProposition: dbEchange,
        prixTotal: prixTotal,
        id_echange: request.query.id_echange,

        // Récupère le premier échange et le stocke dans dbInfo.
        // Ensuite, on peut accéder à son nom à travers dbInfo.nom_echange.
        dbInfo: dbEchange[0],
        type: "echange",
        echange: true,
        //variable pour afficher la liste des propositions d'un echange
        dbProposition: dbProposition,

        //variable pour gerer les utilisateur
        utilisateur: request.user,

        ISeligiblebtn: ISeligiblebtn,
        ISeligibleliste: ISeligibleliste,
      });
    } else {
      response.status(404).end();
    }
  } else {
    response.status(400).end();
  }
});

// Programmation des routes

/**
 * API pour supprimer une echange
 */
app.delete(
  "/api/delete_echange",
  utilisateurConnecte,
  async (request, response) => {
    const id_echange = request.body.id_echange;

    //verification d'id_echange
    if (validerIdEchange(id_echange)) {
      const resultat = await getEchange(id_echange);

      if (resultat.length > 0) {
        //verifier est ce que l'utilisateur connecter c'est lui qui a creer echange
        if (resultat[0].id_utilisateur !== request.user.id_utilisateur) {
          response.status(401).end();
          return;
        }

        //supprimer un echange et supprimer aussi l'élément dans la table echange_livre.
        //Il faut également supprimer toutes les propositions qui appartiennent à cet échange.
        const index = await deleteEchangeUtilisateur(id_echange);
        response.status(200).end();
      } else {
        return response.status(404).end();
      }
    } else {
      return response.status(400).end();
    }
  }
);

/**
 * API pour cree une echange et ajouter des livre dans l'echange
 */
app.post(
  "/api/echange_livre",
  utilisateurConnecte,
  async (request, response) => {
    //l'utilisateur connecter c'est le meme qui va creer echange
    const id_utilisateur = request.user.id_utilisateur;
    const nom_echange = request.body.nom_echange;
    const id_livres = request.body.id_livres;
    const quantites = request.body.quantites;

    // verifier la Validation de l'id_utilisateru et id_livre et nom echange et quantites
    if (
      validerIdUtilisateur(id_utilisateur) &&
      validerIdlivre(id_livres) &&
      validerNomEchange(nom_echange) &&
      validerQuantite(quantites)
    ) {
      const resltat = await creeEchangelivre(
        id_utilisateur,
        nom_echange,
        id_livres,
        quantites
      );
      response.status(201).json({ id_echange: resltat });
    } else {
      response.status(400).end();
    }
  }
);

/**
 * creer une proposition pour un echange
 */
app.post(
  "/api/proposition_livre",
  utilisateurConnecte,
  async (request, response) => {
    //l'utilisateur connecter est le même utilisateur qui va creer proposition
    const id_utilisateur = request.user.id_utilisateur;
    const id_echange = request.body.id_echange;
    const id_livres = request.body.id_livres;
    const quantites = request.body.quantites;

    // verifier la Validation de l'id_utilisateru er id_livre et quantites
    if (
      validerIdUtilisateur(id_utilisateur) &&
      validerIdEchange(id_echange) &&
      validerIdlivre(id_livres) &&
      validerQuantite(quantites)
    ) {
      // appele la function pour rescuper un echange avec un id_echange
      //pour recuperer l'id_utilisateur de l'echange
      const echange = await getEchange(id_echange);
      //erififer est ce que l'id_echange il existe ou non
      if (echange.length === 0) {
        response.status(404).end();
        return;
      }

      //verification est ce que l'utilisateur connecter pas le meme qui a creer echange
      if (request.user.id_utilisateur === echange[0].id_utilisateur) {
        response.status(401).end();
        return;
      }

      const resltat = await creePropositionlivre(
        id_utilisateur,
        id_echange,
        id_livres,
        quantites
      );
      response.status(201).json({ id_proposition: resltat });
    } else {
      response.status(400).end();
    }
  }
);

/**
 * API pour inscription
 */
app.post(
  "/api/inscription",
  utilisateurPasConnecte,
  async (request, response, next) => {
    if (
      validerCourriel(request.body.courriel) &&
      validerNomPrenom(request.body.nom, request.body.prenom) &&
      validerMotDePasse(request.body.mot_de_passe) &&
      validerAcces(request.body.acces)
    ) {
      try {
        await creerUtilisateur(
          request.body.courriel,
          request.body.nom,
          request.body.prenom,
          request.body.mot_de_passe,
          request.body.acces
        );

        response.status(201).end();
      } catch (erreur) {
        if (erreur.code === "SQLITE_CONSTRAINT") {
          response.status(409).end();
        } else {
          next(erreur);
        }
      }
    } else {
      response.status(400).end();
    }
  }
);

/**
 * Api pour Connexion
 */
app.post(
  "/api/connexion",
  utilisateurPasConnecte,
  (request, response, next) => {
    if (
      validerCourriel(request.body.courriel) &&
      validerMotDePasse(request.body.mot_de_passe)
    ) {
      passport.authenticate("local", (erreur, utilisateur, info) => {
        if (erreur) {
          next(erreur);
        } else if (!utilisateur) {
          response.status(401).json(info);
        } else {
          request.logIn(utilisateur, (erreur) => {
            if (erreur) {
              next(erreur);
            }

            response.status(200).end();
          });
        }
      })(request, response, next);
    } else {
      response.status(400).end();
    }
  }
);

/**
 * Api pour Deconnexion
 */
app.post("/api/deconnexion", utilisateurConnecte, (request, response, next) => {
  request.logOut((erreur) => {
    if (erreur) {
      next(erreur);
    }
    response.redirect("/");
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Api pour recuperer tout les livre dans openlibrary
 */

app.get("/api/livres", async (request, response) => {
  try {
    // if (validerNomAuteurTitre(request.query.nom_auteur)) {
    const titre = request.query.titre;

    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(titre)}`
    );

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }

    const datas = await res.json();

    const livres = datas.docs.map((livre) => ({
      id: livre.key,
      titre: livre.title,
      auteur: livre.author_name ? livre.author_name.join(", ") : "Inconnu",
      cover_url: livre.cover_i
        ? `https://covers.openlibrary.org/b/id/${livre.cover_i}-L.jpg`
        : null,
      langue: livre.language,
    }));

    response.status(200).json(livres);
    // } else {
    //   response.status(400).end();
    // }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Erreur lors de la récupération des livres." });
  }
});

// Démarrer le serveur
if (process.env.NODE_ENV === "production") {
  console.log("Serveur démarré:");
  console.log("http://localhost:" + process.env.PORT);
  app.listen(process.env.PORT);
} else {
  const credentials = {
    cert: await readFile("./security/localhost.cert"),
    key: await readFile("./security/localhost.key"),
  };

  console.log("Serveur démarré:");
  console.log("https://localhost:" + process.env.PORT);
  https.createServer(credentials, app).listen(process.env.PORT);
}
