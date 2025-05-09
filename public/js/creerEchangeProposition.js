import {
  validerNomEchange,
  validerQuantite,
  validerRechercheText,
} from "./validationCreerEchange.js";
import {
  afficherNomInvalide,
  afficherNomValide,
  afficherQuantiteInvalide,
  afficherQuantiteValide,
  afficherRechercheInvalide,
  afficherRechercheValide,
} from "./afficherMessageErreur.js";

let id_briques = [];
let quantites = [];
let validationQuantites = [];
let nomEchangeValide;
let quantiteValide;

/**
 * function pour verifier les champs d'entrer dans la page creer echanges
 */
function verifierNomEchange(nomEchange) {
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

// id_briques = [];
// quantites = [];
/**
 * function pour verifier la quentite des briques cote client
 * @returns
 */
export function verifierQuantite(briques, erreurMessage = true) {
  //initialisation des variable et les tableaux
  quantiteValide = true;
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
  if (
    !quantiteValide ||
    (validationQuantites.length === 0 && quantites.length === 0)
  ) {
    if (erreurMessage) {
      afficherQuantiteInvalide();
    }
    return false;
  } else {
    validationQuantites.forEach((validationQuantite) => {
      // Ajouter les données aux tableaux
      id_briques.push(validationQuantite.getAttribute("data-id"));
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

  const nomEchange = document.getElementById("nom-echange");
  const briques = document.querySelectorAll(
    '#briques-selection input[type="number"]'
  );

  //appele la function pour verifier le nom d'echange est ce que il est valide.
  const ISnomValide = verifierNomEchange(nomEchange);
  const ISquantiteValide = verifierQuantite(briques);

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
      window.location.replace(`/echange?id_echange=${idEchange.id_echange}`);
    }
  } else {
    verifierNomEchange(nomEchange);
  }
}

/**
 * function pour creer proposition cote serveur
 * @param {Event} event
 */
async function creerPropositionServer(event) {
  event.preventDefault();

  const briques = document.querySelectorAll(
    '#briques-selection input[type="number"]'
  );

  //appele la function pour verifier la quantite est ce que il est valide.
  const ISquantiteValide = verifierQuantite(briques);

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
  // nomEchange.addEventListener("input", verifierNomEchange);
}

/**
 * Vérifie si la page "Créer Proposition" est exécutée et non la page "Créer Échange".
 */
if (document.getElementById("form-creer-proposition")) {
  // // Ajouter l'écouteur d'événement pour le formulaire dans la page creer proposition
  const form = document.getElementById("form-creer-proposition");
  form.addEventListener("submit", creerPropositionServer);
}
const liversTotal = [];

function addLivres() {}

/**
 * Ajout d'un événement au clic sur le bouton de recherche
 */
const rechercheText = document.getElementById("recherche");
const rechercheBtn = document.getElementById("rechercheBtn");
rechercheBtn.addEventListener("click", () => {
  if (validerRechercheText(rechercheText.value)) {
    const briques = document.querySelectorAll(
      '#briques-selection input[type="number"]'
    );
    verifierQuantite(briques, false);

    const container = document.getElementById("briques-selection");

    fetch(`/resultatRecherche?titre=${rechercheText.value}`)
      .then((res) => res.text())
      .then((html) => {
        afficherRechercheValide();
        afficherNomValide();
        afficherQuantiteValide();
        rechercheText.value = ""; //initialisation champs de recherche
        // Vider le contenu
        container.innerHTML = "";
        container.innerHTML = html;
      });
  } else {
    afficherRechercheInvalide();
  }
});

rechercheText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Empêche un éventuel comportement par défaut
    rechercheBtn.click(); // Simule le clic sur le bouton
  }
});
