import {
  validerNomEchange,
  validerQuantite,
  validerRechercheText,
} from "./validationCreerEchange.js";
import {
  afficherNomInvalide,
  afficherNomValide,
  afficherQuantiteInvalide,
  afficherRechercheInvalide,
  afficherRechercheValide,
} from "./afficherMessageErreur.js";

const nomEchange = document.getElementById("nom-echange");
const briques = document.querySelectorAll(
  '#briques-selection input[type="number"]'
);

let id_briques = [];
let quantites = [];
let validationQuantites = [];
let nomEchangeValide;
let quantiteValide;

/**
 * function pour verifier les champs d'entrer dans la page creer echanges
 */
function verifierNomEchange() {
  nomEchangeValide = false;
  if (validerNomEchange(nomEchange.value)) {
    // Ajouter la validation du nom de l'échange
    nomEchangeValide = true;
  } else {
    nomEchangeValide = false;
  }

  if (nomEchangeValide) {
    afficherNomValide();
    return true;
  } else {
    afficherNomInvalide();
    return false;
  }
}

/**
 * function pour verifier la quentite des briques cote client
 * @returns
 */
export function verifierQuantite() {
  //initialisation des variable et les tableaux
  quantiteValide = true;
  id_briques = [];
  quantites = [];
  validationQuantites = [];

  // Parcourir les briques et vérifier si les quantités sont valides.
  briques.forEach((brique) => {
    if (Number(brique.value) !== 0) {
      // On ajoute toutes les quantités différentes de 0 dans un tableau validationQuantite.
      validationQuantites.push(brique);
    }
    // Vérifier si la quantité n'est pas dans l'intervalle [1, 200].
    // Si la quantité n'est pas dans l'intervalle, on met la variable quantiteValide à false et on quitte la boucle.
    if (!validerQuantite(Number(brique.value)) && Number(brique.value) !== 0) {
      quantiteValide = false;
      return;
    }
  });

  // Vérifier si quantiteValide est false pour afficher le message d'erreur.
  // Si quantiteValide est true, on ajoute les quantités dans le tableau quantites et
  // les id_brique dans le tableau id_briques pour les utiliser dans les données du fetch.
  if (!quantiteValide || validationQuantites.length === 0) {
    afficherQuantiteInvalide();
    return false;
  } else {
    validationQuantites.forEach((validationQuantite) => {
      // Ajouter les données aux tableaux
      id_briques.push(validationQuantite.getAttribute("data-id"));
      console.log(id_briques.length); /////////////////////
      console.log(id_briques[0]); //////////////////////////
      // id_briques.push(Number(validationQuantite.getAttribute("data-id")));
      quantites.push(Number(validationQuantite.value));
    });
  }
  return true;
}

/**
 * function pour creer un echange et ajouter des briques dans l'echange
 * @param {Event} event
 */
async function creerEchangeServer(event) {
  event.preventDefault();

  //appele la function pour verifier le nom d'echange est ce que il est valide.
  const ISnomValide = verifierNomEchange();
  const ISquantiteValide = verifierQuantite();

  if (ISnomValide && ISquantiteValide) {
    // Envoi des données à l'API
    const data = {
      nom_echange: nomEchange.value,
      id_briques: id_briques,
      quantites: quantites,
    };

    const response = await fetch("/api/echange_brique", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const idEchange = await response.json();
      // Redirige directement vers la page de l'échange qui a été créée.
      window.location.href = `/echange?id_echange=${idEchange.id_echange}`;
    }
  } else {
    verifierNomEchange();
  }
}

/**
 * function pour creer proposition cote serveur
 * @param {Event} event
 */
async function creerPropositionServer(event) {
  event.preventDefault();

  //appele la function pour verifier la quantite est ce que il est valide.
  const ISquantiteValide = verifierQuantite();

  // Récupérer id_echange depuis sessionStorage
  const idEchange = sessionStorage.getItem("id_echange");

  if (ISquantiteValide) {
    // Envoi des données à l'API
    const data = {
      id_echange: Number(idEchange),
      id_briques: id_briques,
      quantites: quantites,
    };

    const response = await fetch("/api/proposition_brique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const idPropositon = await response.json();
      // Redirige directement vers la page de l'échange qui a été créée.
      window.location.href = `/proposition?id_proposition=${idPropositon.id_proposition}`;
    } else {
    }
  }
}

/**
 * Vérifie si la page "Créer Échange" est exécutée et non la page "Créer Proposition".
 */
if (document.getElementById("form-creer-echange")) {
  // Ajouter l'écouteur d'événement pour le formulaire dans la page creer echange
  const form = document.getElementById("form-creer-echange");
  form.addEventListener("submit", creerEchangeServer);

  // Ajouter l'écouteur d'événement pour le champ nom de l'échange
  nomEchange.addEventListener("input", verifierNomEchange);
}

/**
 * Vérifie si la page "Créer Proposition" est exécutée et non la page "Créer Échange".
 */
if (document.getElementById("form-creer-proposition")) {
  // // Ajouter l'écouteur d'événement pour le formulaire dans la page creer proposition
  const form = document.getElementById("form-creer-proposition");
  form.addEventListener("submit", creerPropositionServer);
}

const rechercheText = document.getElementById("recherche");
const rechercheBtn = document.getElementById("rechercheBtn");
rechercheBtn.addEventListener("click", () => {
  if (validerRechercheText(rechercheText.value)) {
    console.log("Bouton recherche cliqué ! " + rechercheText.value);
    afficherRechercheValide();
    rechercheText.value = ""; //initialisation champs de recherche
  } else {
    afficherRechercheInvalide();
  }
});
