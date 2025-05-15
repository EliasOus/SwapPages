const erreurQuantite = document.querySelector(".erreur-quantite");
const erreurNomEchange = document.querySelector(".erreur-nom-echange");
const livresSelection = document.getElementById("livres-selection");
const nomEchangeInput = document.getElementById("nom-echange");
const erreurRecherche = document.getElementById("erreur-recherche");

/**
 * function pour ajouter la coleur pour nom invalide
 */
export function afficherNomInvalide() {
  // Afficher le message d'erreur
  erreurNomEchange.style.color = "#FF0000";
  erreurNomEchange.style.fontSize = ".8rem";
  erreurNomEchange.innerText =
    "Veuillez saisir un nom d'échange valide (entre 5 et 75 caractères).";
  nomEchangeInput.style.border = "2px solid #FF0000";
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
  livresSelection.style.border = "2px solid #FF0000";
  erreurQuantite.style.color = "#FF0000";
  erreurQuantite.style.fontSize = ".8rem";
  erreurQuantite.style.marginTop = "10px";
  erreurQuantite.style.height = "auto";
  erreurQuantite.innerText =
    "Veuillez saisir une quantité valide (entre 1 et 200).";
}

/**
 * function pour enlever la coleur pour quantite valide
 */
export function afficherQuantiteValide() {
  // Retirer le message d'erreur
  erreurQuantite.innerText = "";
  livresSelection.style.border = "none";
}

/**
 * function pour ajouter la coleur pour recherche invalide
 */
export function afficherRechercheInvalide() {
  // Afficher le message d'erreur quantité
  erreurRecherche.style.display = "block";
  erreurRecherche.style.color = "#FF0000";
  erreurRecherche.style.fontSize = ".8rem";
  erreurRecherche.style.height = "auto";
  erreurRecherche.innerText = "Veuillez saisir un titre valide";
}
/**
 * function pour enlever la coleur pour recherche valide
 */
export function afficherRechercheValide() {
  // Afficher le message d'erreur quantité
  erreurRecherche.style.display = "none";
}
