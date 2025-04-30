import {
  validationCourriel,
  validationMotDePasse,
} from "./validationAuthentification.js";

const inputCourriel = document.getElementById("input-courriel");
const inputMotDePasse = document.getElementById("input-motdepasse");

const btnSubmit = document.getElementById("form-auth");

const erreurAuthentification = document.getElementById("erreur-auth");

/**
 * function  gère la soumission du formulaire de connexion
 * @param {event} event 
 */
async function connexionServer(event) {
  event.preventDefault();

  const data = {
    courriel: inputCourriel.value,
    mot_de_passe: inputMotDePasse.value,
  };

  //validation le courriel et le mot de passe cote client
  const IScouriel = validationCourriel(inputCourriel);
  const ISmotdepass = validationMotDePasse(inputMotDePasse);

  if (IScouriel && ISmotdepass) {
    const response = await fetch("/api/connexion", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      location.href = "/";
    } else if (response.status === 401) {
      const ErreurMessage = await response.json();
      if (ErreurMessage.erreur === "Mauvais Courriel") {
        erreurAuthentification.classList.add("erreur-auth");
        erreurAuthentification.innerText = "le courriel est Invalide";
      } else if (ErreurMessage.erreur === "mauvais mot de passe") {
        erreurAuthentification.classList.add("erreur-auth");
        erreurAuthentification.innerText = "Le mot de passe est Invalide.";
      }
    }
  }
}

btnSubmit.addEventListener("submit", connexionServer);
