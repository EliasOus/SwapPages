import { connexion } from "../db/db.js";
import axios from "axios";

/**
 * Fonction pour afficher toutes les echange qui se trouvent dans le site (base de données).
 * @returns
 */

export async function getEchanges() {
  const echange = await connexion.all(`
    SELECT e.id_echange, u.id_utilisateur, eb.id_livre, e.nom_echange, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur, eb.lien_image
    FROM echange_livre eb
    JOIN echange e
    ON eb.id_echange = e.id_echange
    JOIN utilisateur u 
    ON e.id_utilisateur = u.id_utilisateur;
    `);

  // Regroupe les échanges par id_echange et rassemble les id_livre en tableau.
  const map = new Map();
  for (const item of echange) {
    const existing = map.get(item.id_echange);
    if (existing) {
      existing.id_livre.push(item.id_livre);
      existing.lien_image.push(item.lien_image);
    } else {
      map.set(item.id_echange, {
        id_echange: item.id_echange,
        id_utilisateur: item.id_utilisateur,
        nom_echange: item.nom_echange,
        nom_utilisateur: item.nom_utilisateur,
        prenom_utilisateur: item.prenom_utilisateur,
        id_livre: [item.id_livre],
        lien_image: [item.lien_image],
      });
    }
  }

  const echangesTableau = Array.from(map.values());

  return echangesTableau;
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
 * Fonction pour supprimer un echange et supprimer aussi l'élément dans la table echange_livre.
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
    FROM echange_livre
    WHERE id_echange = ?;`,
    [id_echange]
  );

  await connexion.run(
    `DELETE
    FROM proposition_livre
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
export async function getlivres(titre) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${titre}&maxResults=40`
    );

    const livres = response.data.items.map((livre) => ({
      id_livre: livre.id,
      nom_livre: livre.volumeInfo.title,
      image: livre.volumeInfo.imageLinks?.thumbnail || null,
      language: livre.volumeInfo.language,
      authors: livre.volumeInfo.authors?.[0] || null,
    }));

    return livres;
  } catch (error) {
    // En cas d’erreur (ex: ID invalide)
    console.error(`Erreur lors de la récupération du livre:`, error.message);
  }
}

/**
 * Fonction pour créer un échange dans la table echange.
 * Retourne l'id de l'échange pour l'utiliser dans la création d'une echange_livre
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
 * Fonction pour ajouter les livres et la quantité de chaque livre dans un echange.
 * @param {*} id_utilisateur
 * @param {*} nom_echange
 * @param {*} id_livre
 * @param {*} quantite
 * @returns
 */
export async function creeEchangelivre(
  id_utilisateur,
  nom_echange,
  id_livres,
  quantites,
  titre_livre,
  authors,
  language,
  lien_image
) {
  const idEchange = await creeEchange(id_utilisateur, nom_echange);

  for (let i = 0; i < id_livres.length; i++) {
    const idEchangelivre = await connexion.run(
      `INSERT INTO echange_livre (id_echange, id_livre, quantite, titre_livre, authors, language, lien_image ) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        idEchange,
        id_livres[i],
        quantites[i],
        titre_livre[i],
        authors[i],
        language[i],
        lien_image[i],
      ]
    );
  }

  return idEchange;
}

/**
 * Fonction pour afficher toutes les livres qui se trouvent dans une echange.
 * @param {*} id_echange
 * @returns
 */
export async function getEchange(id_echange) {
  const resultat = await connexion.all(
    `SELECT
        e.id_echange,
        eb.id_livre,
        e.id_utilisateur,
        e.nom_echange,
        u.nom AS nom_utilisateur,
        eb.quantite,
        eb.titre_livre,
        eb.authors,
        eb.language,
        eb.lien_image
      FROM echange e
      JOIN utilisateur u
        ON e.id_utilisateur = u.id_utilisateur
      JOIN echange_livre eb
        ON e.id_echange = eb.id_echange
      WHERE e.id_echange = ?;`,
    [id_echange]
  );
  return resultat;
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
 * function pour afficher toutes les livres qui se trouvent dans une proposition.
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
          pb.id_livre,
          e.nom_echange,
          u.nom AS nom_utilisateur_proposition,
          u.prenom AS prenom_utilisateur_proposition,
          pb.quantite,
          pb.titre_livre,
          pb.authors,
          pb.language,
          pb.lien_image
        FROM proposition_livre pb
        JOIN proposition p
        ON pb.id_proposition = p.id_proposition
        JOIN echange e
        ON p.id_echange = e.id_echange
        JOIN utilisateur u 
        ON p.id_utilisateur = u.id_utilisateur
        WHERE p.id_proposition = ?;`,
    [id_proposition]
  );
  return resultat;
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
 * Retourne l'id de la proposition pour l'utiliser dans la création d'une proposition_livre.
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
 * Fonction pour ajouter les livres et la quantité de chaque livre dans une proposition.
 * @param {Number} id_utilisateur
 * @param {Number} id_echange
 * @param {Array} id_livres
 * @param {Array} quantites
 * @returns
 */
export async function creePropositionlivre(
  id_utilisateur,
  id_echange,
  id_livres,
  quantites,
  titre_livres,
  authors,
  languages,
  lien_images
) {
  const idProposition = await creeProposition(id_echange, id_utilisateur);

  for (let i = 0; i < id_livres.length; i++) {
    const resultat = await connexion.run(
      `INSERT INTO proposition_livre (id_proposition, id_livre, quantite, titre_livre, authors, language, lien_image)
      VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        idProposition,
        id_livres[i],
        quantites[i],
        titre_livres[i],
        authors[i],
        languages[i],
        lien_images[i],
      ]
    );
  }
  return idProposition;
}
