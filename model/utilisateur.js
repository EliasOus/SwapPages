import { Router } from "express";
import { connexion } from "../db/db.js";
import {hash} from "bcrypt";

export async function getUtilisateurByID(id_utilisateur) {

    const utilisateur = await connexion.get(`
        SELECT *
        FROM utilisateur
        WHERE id_utilisateur = ?`,
    [id_utilisateur]);

    return utilisateur;
}

export async function getUtilisateurByCourriel(courriel) {

    const utilisateur = await connexion.get(
        `SELECT * 
        FROM utilisateur
        WHERE courriel = ?`,
    [courriel]);
    return utilisateur;
}

export async function creerUtilisateur(courriel, nom, prenom, mot_de_passe, acces) {
    const motDePasseHash = await hash(mot_de_passe, 10);

    const resultat = await connexion.run(
        `INSERT INTO utilisateur (courriel, nom, prenom, mot_de_passe, acces)
        VALUES (?,?,?,?,?)`,
    [courriel, nom, prenom, motDePasseHash,acces]);

    return resultat.lastID;
}