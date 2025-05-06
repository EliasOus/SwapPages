/**
 * function pour valide id echange cote serveur
 * @param {number} id_echange
 * @returns
 */
export function validerIdEchange(id_echange) {
  if (
    typeof id_echange !== "number" ||
    id_echange <= 0 ||
    !Number.isInteger(id_echange)
  ) {
    return false;
  } else {
    return true;
  }
}
export function validerIdProposition(id_proposition) {
  if (
    typeof id_proposition !== "number" ||
    id_proposition <= 0 ||
    !Number.isInteger(id_proposition)
  ) {
    return false;
  } else {
    return true;
  }
}

/**
 * function pour valide id utilisateur cote serveur
 * @param {number} id_utilisateur
 * @returns
 */
export function validerIdUtilisateur(id_utilisateur) {
  if (
    typeof id_utilisateur !== "number" ||
    id_utilisateur <= 0 ||
    !Number.isInteger(id_utilisateur)
  ) {
    return false;
  } else {
    return true;
  }
}

/**
 * function pour valide id brique cote serveur
 * @param {Array} id_brique
 * @returns
 */
export function validerIdBrique(id_brique) {
  if (!Array.isArray(id_brique)) {
    return false;
  }
  for (let id of id_brique) {
    if (typeof id !== "string" || id.trim() === "") {
      return false;
    }
  }
  return true;
}

/**
 * function pour valide quntite cote serveur
 * @param {Array} quantite
 * @returns
 */
export function validerQuantite(quantite) {
  if (!Array.isArray(quantite)) {
    return false;
  }
  for (let q of quantite) {
    if (typeof q !== "number" || q < 0 || q > 200) {
      return false;
    }
  }
  return true;
}

/**
 * function pour valide nome echange cote serveur
 * @param {string} nomEchange
 * @returns
 */
export function validerNomEchange(nomEchange) {
  if (
    String(nomEchange).length >= 5 &&
    nomEchange &&
    String(nomEchange).length <= 75
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * function pour valide l'email cote serveur
 * @param {string} courriel
 * @returns
 */
export function validerCourriel(courriel) {
  if (
    typeof courriel === "string" &&
    courriel &&
    courriel.length >= 6 &&
    courriel.length <= 30 &&
    courriel.match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * function pour valide le mot de passe cote serveur
 * @param {string} motDePasse
 * @returns
 */
export function validerMotDePasse(motDePasse) {
  if (
    typeof motDePasse === "string" &&
    motDePasse &&
    motDePasse.length >= 6 &&
    motDePasse.length <= 30
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * function pour valide le nom et le prenom cote serveur
 * @param {string} nom
 * @param {string} prenom
 * @returns
 */
export function validerNomPrenom(nom, prenom) {
  if (
    String(nom).length >= 3 &&
    nom &&
    String(nom).length <= 20 &&
    String(prenom).length >= 3 &&
    prenom &&
    String(prenom).length <= 20
  ) {
    return true;
  } else {
    return false;
  }
}

export function validerAcces(acces) {
  if (
    typeof acces === "number" &&
    !Number.isNaN(acces) &&
    Number.isFinite(acces) &&
    acces > 0
  ) {
    return true;
  } else {
    return false;
  }
}

/////////////////////////////////////
/**
 * function pour valide le nom author ou titre de livre cote serveur
 * @param {string} nom_auteur_titre
 * @returns
 */
export function validerNomAuteurTitre(nom_auteur_titre) {
  if (
    String(nom_auteur).length >= 3 &&
    nom_auteur &&
    String(nom_auteur).length <= 20
  ) {
    return true;
  } else {
    return false;
  }
}
