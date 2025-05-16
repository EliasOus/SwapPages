import { existsSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const IS_NEW = !existsSync(process.env.DB_FILE);

async function createDatabase(connexion) {
  await connexion.exec(
    `
        CREATE TABLE utilisateur (
            id_utilisateur INTEGER PRIMARY KEY,
            courriel TEXT UNIQUE NOT NULL,
            nom TEXT,
            prenom TEXT,
            mot_de_passe TEXT NOT NULL,
            acces INTEGER
        );
        
        CREATE TABLE echange (
            id_echange INTEGER PRIMARY KEY,
            id_utilisateur INTEGER NOT NULL,
            id_proposition_accepte INTEGER,
            nom_echange TEXT,
            FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur),
            FOREIGN KEY(id_proposition_accepte) REFERENCES proposition(id_proposition)
        );
        
        CREATE TABLE proposition (
            id_proposition INTEGER PRIMARY KEY,
            id_echange INTEGER NOT NULL,
            id_utilisateur INTEGER NOT NULL,
            FOREIGN KEY(id_echange) REFERENCES echange(id_echange),
            FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
        );
        
        CREATE TABLE echange_livre (
            id_echange INTEGER,
            id_livre TEXT,
            quantite INTEGER NOT NULL,
            titre_livre TEXT,
            authors TEXT,
            language Text,
            lien_image TEXT,
            PRIMARY KEY(id_echange, id_livre), 
            FOREIGN KEY(id_echange) REFERENCES echange(id_echange)
        );
        
        CREATE TABLE proposition_livre (
            id_proposition INTEGER,
            id_livre TEXT,
            titre_livre TEXT,
            authors TEXT,
            language Text,
            lien_image TEXT,
            quantite INTEGER NOT NULL,
            PRIMARY KEY(id_proposition, id_livre), 
            FOREIGN KEY(id_proposition) REFERENCES proposition(id_proposition)
        );
   
`
  );

  return connexion;
}

let connexion = await open({
  filename: process.env.DB_FILE,
  driver: sqlite3.Database,
});

if (IS_NEW) {
  connexion = await createDatabase(connexion);
}

export { connexion };


// CREATE TABLE echange_livre (
//   id_echange INTEGER,
//   id_livre TEXT,
//   quantite INTEGER NOT NULL,
//   PRIMARY KEY(id_echange, id_livre), 
//   FOREIGN KEY(id_echange) REFERENCES echange(id_echange)
// );