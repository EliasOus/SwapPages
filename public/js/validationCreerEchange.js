/**
 * function qui valider le nom d'echange cote client
 * @param {string} nomEchange
 * @returns
 */
export function validerNomEchange(nomEchange) {
  if (String(nomEchange).length >= 5 && String(nomEchange).length <= 75) {
    return true;
  } else {
    return false;
  }
}

/**
 * function qui valider le nom d'echange cote client
 * @param {string} rechercheText
 * @returns
 */
export function validerRechercheText(rechercheText) {
  if (String(rechercheText).length >= 2 && String(rechercheText).length <= 30 && rechercheText) {
    return true;
  } else {
    return false;
  }
}

/**
 * function pourvalide la quantite cote client
 * @param {Number} quantite
 * @returns
 */
export function validerQuantite(quantite) {
  if (quantite > 0 && quantite <= 200) {
    return true;
  } else {
    return false;
  }
}

