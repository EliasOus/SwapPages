import { connexion } from "../db/db.js";
import axios from "axios";

/**
 * Fonction pour afficher toutes les echange qui se trouvent dans le site (base de données).
 * @returns
 */

export async function getEchanges() {
  const echange = await connexion.all(`
    SELECT e.id_echange, u.id_utilisateur, e.nom_echange, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur
    FROM echange e
    JOIN utilisateur u ON e.id_utilisateur = u.id_utilisateur;
    `);
  return echange;
}

/**
 * Fonction pour afficher toutes les echange pour chaque utilisateur
 * @param {*} id_utilisateur
 * @returns
 */
export async function getEchangeUtilisateur(id_utilisateur) {
  const echangesUtilisateur = await connexion.all(
    `SELECT e.id_echange, u.id_utilisateur, e.nom_echange, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur
    FROM echange e
    JOIN utilisateur u ON e.id_utilisateur = u.id_utilisateur
    WHERE u.id_utilisateur = ?;`,
    [id_utilisateur]
  );

  return echangesUtilisateur;
}

/**
 * Fonction pour supprimer un echange et supprimer aussi l'élément dans la table echange_brique.
 * Il faut également supprimer toutes les propositions qui appartiennent à cet échange.
 * @param {*} id_echange
 */
export async function deleteEchangeUtilisateur(id_echange) {
  await connexion.run(
    `DELETE 
    FROM echange
    WHERE id_echange = ?;`,
    [id_echange]
  );

  await connexion.run(
    `DELETE
    FROM echange_brique
    WHERE id_echange = ?;`,
    [id_echange]
  );

  await connexion.run(
    `DELETE
    FROM proposition_brique
    WHERE id_proposition IN (
    SELECT id_proposition
    FROM proposition
    WHERE id_echange = ? );`,
    [id_echange]
  );

  await connexion.run(
    `DELETE 
    FROM proposition
    WHERE id_echange = ?;`,
    [id_echange]
  );
}

/**
 * Fonction pour afficher toutes les livres
 * @returns
 */
export async function getBriques(titre) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${titre}&maxResults=40`
    );

    const livres = response.data.items.map((livre) => ({
      id_brique: livre.id,
      nom_brique: livre.volumeInfo.title,
      couleur: "noir_test",
      valeur: 5,
      image: livre.volumeInfo.imageLinks?.thumbnail || null,
      language: livre.volumeInfo.language,
      authors: livre.volumeInfo.authors?.[0] || null,
    }));

    return livres;
  } catch (error) {
    // En cas d’erreur (ex: ID invalide)
    console.error(
      `Erreur lors de la récupération du livre ${livre.id_brique}:`,
      error.message
    );
  }
}

/**
 * Fonction pour créer un échange dans la table echange.
 * Retourne l'id de l'échange pour l'utiliser dans la création d'une echange_brique
 * @param {*} id_utilisateur
 * @param {*} nom_echange
 * @returns
 */
async function creeEchange(id_utilisateur, nom_echange) {
  const resltatEchange = await connexion.run(
    `INSERT INTO echange (id_utilisateur, nom_echange)
        VALUES (?,?);`,
    [id_utilisateur, nom_echange]
  );
  return resltatEchange.lastID;
}

/**
 * Fonction pour ajouter les briques et la quantité de chaque brique dans un echange.
 * @param {*} id_utilisateur
 * @param {*} nom_echange
 * @param {*} id_brique
 * @param {*} quantite
 * @returns
 */
export async function creeEchangeBrique(
  id_utilisateur,
  nom_echange,
  id_briques,
  quantites
) {
  const idEchange = await creeEchange(id_utilisateur, nom_echange);

  for (let i = 0; i < id_briques.length; i++) {
    const idEchangeBrique = await connexion.run(
      `INSERT INTO echange_brique (id_echange, id_brique, quantite) 
        VALUES (?, ?, ?);`,
      [idEchange, id_briques[i], quantites[i]]
    );
  }

  return idEchange;
}

/**
 * Fonction pour afficher toutes les briques qui se trouvent dans une echange.
 * @param {*} id_echange
 * @returns
 */
export async function getEchange(id_echange) {
  const resultat = await connexion.all(
    `SELECT
        e.id_echange,
        id_brique,
        e.id_utilisateur,
        e.nom_echange,
        u.nom AS nom_utilisateur,
        quantite
      FROM echange e
      JOIN utilisateur u
        ON e.id_utilisateur = u.id_utilisateur
      JOIN echange_brique eb
        ON e.id_echange = eb.id_echange
      WHERE e.id_echange = ?;`,
    [id_echange]
  );

  const livres = await Promise.all(
    resultat.map(async (livre) => {
      try {
        const datas = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${livre.id_brique}`
        );

        const info = datas.data.volumeInfo;

        return {
          ...livre,
          nom_brique: info.title || null,
          image: info.imageLinks?.thumbnail || null,
          language: info.language || null,
          authors: info.authors?.[0] || null,
        };
      } catch (error) {
        // En cas d’erreur (ex: ID invalide)
        console.error(
          `Erreur lors de la récupération du livre ${livre.id_brique}:`,
          error.message
        );
        return {
          ...livre,
          nom_brique: null,
          image: null,
          language: null,
          authors: null,
        };
      }
    })
  );

  return livres;
}

/**
 * function pour afficher les informqtion sur un utilisateur
 * @param {Number} id_utilisateur
 * @returns
 */
export async function getNomUtilisateur(id_utilisateur) {
  const nomUtilisateur = await connexion.get(
    `SELECT nom AS nom_utilisateur, prenom AS prenom_utilisateur
    FROM utilisateur
    WHERE id_utilisateur = ?;`,
    [id_utilisateur]
  );
  return nomUtilisateur;
}

/**
 * function pour afficher toutes les briques qui se trouvent dans une proposition.
 * @param {Number} id_proposition
 * @returns
 */
export async function getProposition(id_proposition) {
  const resultat = await connexion.all(
    `SELECT
          p.id_proposition,
          e.id_echange,
          e.id_utilisateur AS id_utilisateur_echange,
          p.id_utilisateur AS id_utilisateur_proposition,
          id_brique,
          e.nom_echange,
          u.nom AS nom_utilisateur_proposition,
          u.prenom AS prenom_utilisateur_proposition,
          quantite
        FROM proposition_brique pb
        JOIN proposition p
        ON pb.id_proposition = p.id_proposition
        JOIN echange e
        ON p.id_echange = e.id_echange
        JOIN utilisateur u 
        ON p.id_utilisateur = u.id_utilisateur
        WHERE p.id_proposition = ?;`,
    [id_proposition]
  );

  const livres = await Promise.all(
    resultat.map(async (livre) => {
      try {
        const datas = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${livre.id_brique}`
        );

        const info = datas.data.volumeInfo;

        return {
          ...livre,
          nom_brique: info.title || null,
          image: info.imageLinks?.thumbnail || null,
          language: info.language || null,
          authors: info.authors?.[0] || null,
        };
      } catch (error) {
        // En cas d’erreur (ex: ID invalide)
        console.error(
          `Erreur lors de la récupération du livre ${livre.id_brique}:`,
          error.message
        );
        return {
          ...livre,
          nom_brique: null,
          image: null,
          language: null,
          authors: null,
        };
      }
    })
  );
  return livres;
}

/**
 * function pour afficher tou les propositions
 * @param {Number} id_echange
 * @returns
 */
export async function getPropositions(id_echange) {
  const resultat = await connexion.all(
    `
    SELECT 
      p.id_proposition,
      p.id_echange,
      p.id_utilisateur AS id_utilisateur_proposition,
      e.id_utilisateur AS id_utilisateur_echange,
      u.nom AS nom_utilisateur_proposition,
      u.prenom AS prenom_utilisateur_proposition
    FROM proposition p 
    JOIN utilisateur u
    ON u.id_utilisateur = p.id_utilisateur
    JOIN echange e 
    ON p.id_echange = e.id_echange
    WHERE p.id_echange = ?;`,
    [id_echange]
  );

  return resultat;
}

/**
 * Fonction pour créer une proposition dans la table proposition.
 * Retourne l'id de la proposition pour l'utiliser dans la création d'une proposition_brique.
 * @param {Number} id_echange
 * @param {Number} id_utilisateur
 * @returns
 */
async function creeProposition(id_echange, id_utilisateur) {
  const resltat = await connexion.run(
    `INSERT INTO proposition (id_echange, id_utilisateur)
    VALUES (?,?);`,
    [id_echange, id_utilisateur]
  );
  return resltat.lastID;
}

/**
 * Fonction pour ajouter les briques et la quantité de chaque brique dans une proposition.
 * @param {Number} id_utilisateur
 * @param {Number} id_echange
 * @param {Array} id_briques
 * @param {Array} quantites
 * @returns
 */
export async function creePropositionBrique(
  id_utilisateur,
  id_echange,
  id_briques,
  quantites
) {
  const idProposition = await creeProposition(id_echange, id_utilisateur);

  for (let i = 0; i < id_briques.length; i++) {
    const resultat = await connexion.run(
      `INSERT INTO proposition_brique (id_proposition, id_brique, quantite)
      VALUES (?,?,?);`,
      [idProposition, id_briques[i], quantites[i]]
    );
  }
  return idProposition;
}
