const erreurQuantite = document.querySelector(".erreur-quantite");
const erreurNomEchange = document.querySelector(".erreur-nom-echange");
const briquesSelection = document.getElementById("briques-selection");
const nomEchangeInput = document.getElementById("nom-echange");

/**
 * function pour ajouter la coleur pour nom invalide
 */
export function afficherNomInvalide() {
  // Afficher le message d'erreur
  erreurNomEchange.style.color = "#FF0000";
  erreurNomEchange.style.fontSize = "1rem";
  erreurNomEchange.innerText =
    "Veuillez saisir un nom d'échange valide (entre 5 et 75 caractères).";
  nomEchangeInput.style.outline = "none";
  nomEchangeInput.style.border = "2px solid #FF0000";
  nomEchangeInput.focus();
}

/**
 * function pour enlever la coleur pour nom valide
 */
export function afficherNomValide() {
  // Retirer le message d'erreur nom de l'échange
  erreurNomEchange.innerText = "";
  nomEchangeInput.style.border = "1px solid #000000";
}

/**
 * function pour ajouter la coleur pour quantite invalide
 */
export function afficherQuantiteInvalide() {
  // Afficher le message d'erreur quantité

  briquesSelection.style.border = "2px solid #FF0000";
  briquesSelection.style.borderRadius = "5px";
  erreurQuantite.style.color = "#FF0000";
  erreurQuantite.style.fontSize = "1rem";
  erreurQuantite.innerText =
    "Veuillez saisir une quantité valide (entre 1 et 200).";
}

/**
 * function pour enlever la coleur pour quantite valide
 */
export function afficherQuantiteValide() {
  // Retirer le message d'erreur
  erreurQuantite.innerText = "";
  briquesSelection.style.border = "none";
}
