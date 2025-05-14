/**
 * function pour supprime un echange
 * @param {Event} event
 */
async function deleteEchangeUtilisateur(event) {
  //empeche l'actualisation de la page
  event.preventDefault();

  //recuperer la <DIV> de echange souhaiter suprime avec id_echange
  const indexSuprime = Number(event.currentTarget.dataset.idEchange);
  const echangeSuprime = document.querySelector(
    `li[data-index="${indexSuprime}"]`
  );

  //recuperer data
  const data = {
    id_echange: Number(event.currentTarget.dataset.idEchange),
  };

  //envoyer la requete HTTP pour suprime une echange
  const resltat = await fetch("/api/delete_echange", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  //traitement des données
  if (resltat.ok) {
    // suprime le <div> de l'echange dans Linterface
    echangeSuprime.remove();
  }
}

//selectionne tout les element avec la class bouton-supprimer
const btnSupprimers = document.getElementsByClassName("bouton-supprimer");

// boucle la collection des icons et ajouter a chaque element un evenement de click
for (let btnSupprimer of btnSupprimers) {
  btnSupprimer.addEventListener("click", deleteEchangeUtilisateur);
}
