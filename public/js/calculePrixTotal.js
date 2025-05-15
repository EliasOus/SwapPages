/**
 * function pour calculer le prix total des livres pour echange et propositions
 * @param {Array} echangeProposition
 * @returns
 */
export function calculePrixTotal(echangeProposition) {
  let prixTotal = 0;
  let total = 0;

  for (let i = 0; i < echangeProposition.length; i++) {
    total = echangeProposition[i].prix_livre * echangeProposition[i].quantite;
    prixTotal += total;
  }

  // Arrondir prixTotal à 2 décimales après la virgule
  prixTotal = parseFloat(prixTotal.toFixed(2));

  return prixTotal;
}
