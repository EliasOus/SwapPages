const btnCreerProposition = document.getElementById("btnCreerProposition");

if (document.getElementById("btnCreerProposition")) {
  btnCreerProposition.addEventListener("click", (event) => {
    const idEchange = event.currentTarget.dataset.idEchange;

    // Stocker l'id_echange dans sessionStorage
    sessionStorage.setItem("id_echange", idEchange);
    
    // Rediriger vers la page pour creer proposition
    location.href = "/creerProposition";
  });
}
