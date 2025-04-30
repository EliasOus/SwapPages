import {
  validationCourriel,
  validationNom,
  validationPrenom,
  validationMotDePasse,
} from "./validationAuthentification.js";

const inputNom = document.getElementById("input-nom");
const inputPrenom = document.getElementById("input-prenom");
const inputCourriel = document.getElementById("input-courriel");
const inputMotDePasse = document.getElementById("input-motdepasse");

const btnSubmit = document.getElementById("form-auth");

const erreurAuthentification = document.getElementById("erreur-auth");

/**
 * function  gère la soumission du formulaire d'inscription
 * @param {event} event
 */
async function inscriptionServer(event) {
  event.preventDefault();

  //recuperation des données
  const data = {
    courriel: inputCourriel.value,
    nom: inputNom.value,
    prenom: inputPrenom.value,
    mot_de_passe: inputMotDePasse.value,
    acces: 1,
  };

  //validation les input cote client
  const IScouriel = validationCourriel(inputCourriel);
  const ISnom = validationNom(inputNom);
  const ISprenom = validationPrenom(inputPrenom);
  const ISmotdepass = validationMotDePasse(inputMotDePasse);

  if (IScouriel && ISnom && ISprenom && ISmotdepass) {
    const response = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      location.href = "/connexion";
    } else if (response.status === 409) {
      erreurAuthentification.classList.add("erreur-auth");
      erreurAuthentification.innerText =
        "Un compte associé à cette adresse courriel existe déjà.";
    }
  }
}

btnSubmit.addEventListener("submit", inscriptionServer);
