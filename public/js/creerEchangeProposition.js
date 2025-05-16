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

let id_livres = [];
let quantites = [];
let titreLivres = [];
let authors = [];
let languages = [];
let lienImages = [];
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

/**
 * function pour verifier la quentite des livres cote client
 * @returns
 */
export function verifierQuantite(livres, erreurMessage = true) {
  //initialisation des variable et les tableaux
  quantiteValide = true;
  validationQuantites = [];

  // Parcourir les livres et vérifier si les quantités sont valides.
  livres.forEach((livre) => {
    if (Number(livre.value) !== 0) {
      // On ajoute toutes les quantités différentes de 0 dans un tableau validationQuantite.
      validationQuantites.push(livre);
    }
    // Vérifier si la quantité n'est pas dans l'intervalle [1, 200].
    // Si la quantité n'est pas dans l'intervalle, on met la variable quantiteValide à false et on quitte la boucle.
    if (!validerQuantite(Number(livre.value)) && Number(livre.value) !== 0) {
      quantiteValide = false;
      return;
    }
  });

  // Vérifier si quantiteValide est false pour afficher le message d'erreur.
  // Si quantiteValide est true, on ajoute les quantités dans le tableau quantites et
  // les id_livre dans le tableau id_livres pour les utiliser dans les données du fetch.
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
      // Récupérer l'ID du livre depuis l'attribut data-id
      const idValidationLivre = validationQuantite.getAttribute("data-id");

      // Ajouter les données aux tableaux
      id_livres.push(idValidationLivre);
      quantites.push(Number(validationQuantite.value));

      // Récupérer le div parent correspondant
      const div = validationQuantite.closest(".livre-item");

      titreLivres.push(div.querySelector('.description-item h1').textContent)
      authors.push(div.querySelector('.description-item h2').textContent)
      languages.push(div.querySelector('.langue span').textContent)
      lienImages.push(div.querySelector('.livre-image img').getAttribute('src'))

    });
  }
  return true;
}

/**
 * function pour creer un echange et ajouter des livres dans l'echange
 * @param {Event} event
 */
async function creerEchangeServer(event) {
  event.preventDefault();

  const nomEchange = document.getElementById("nom-echange");
  const livres = document.querySelectorAll(
    '#livres-selection input[type="number"]'
  );

  //appele la function pour verifier le nom d'echange est ce que il est valide.
  const ISnomValide = verifierNomEchange(nomEchange);
  const ISquantiteValide = verifierQuantite(livres);

  if (ISnomValide && ISquantiteValide) {
    // Envoi des données à l'API
    const data = {
      nom_echange: nomEchange.value,
      id_livres: id_livres,
      quantites: quantites,
      titre_livres: titreLivres,
      authors: authors,
      languages: languages,
      lien_images: lienImages,
    };

    const response = await fetch("/api/echange_livre", {
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

  const livres = document.querySelectorAll(
    '#livres-selection input[type="number"]'
  );

  //appele la function pour verifier la quantite est ce que il est valide.
  const ISquantiteValide = verifierQuantite(livres);

  // Récupérer id_echange depuis sessionStorage
  const idEchange = sessionStorage.getItem("id_echange");

  if (ISquantiteValide) {
    // Envoi des données à l'API
    const data = {
      id_echange: Number(idEchange),
      id_livres: id_livres,
      quantites: quantites,
      titre_livres: titreLivres,
      authors: authors,
      languages: languages,
      lien_images: lienImages,
    };

    const response = await fetch("/api/proposition_livre", {
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
    const livres = document.querySelectorAll(
      '#livres-selection input[type="number"]'
    );
    verifierQuantite(livres, false);

    const container = document.getElementById("livres-selection");

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
