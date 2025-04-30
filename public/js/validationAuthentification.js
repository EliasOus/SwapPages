const erreurCourriel = document.getElementById("erreur-courriel");
const erreurNom = document.getElementById("erreur-nom");
const erreurPrenom = document.getElementById("erreur-prenom");
const erreurMotDePasse = document.getElementById("erreur-mot-de-passe");

/**
 * function pour validation courriel cote client
 * @param {Object} inputCourriel 
 * @returns 
 */
export function validationCourriel(inputCourriel){
    if(inputCourriel.validity.valid){
        erreurCourriel.innerText = "";
        return true;
    }
    else if(inputCourriel.validity.valueMissing){
        erreurCourriel.innerText = "Courriel est obligatoire. Veuillez le remplir.";
        erreurCourriel.classList.add("erreur-auth");
        return false;
    }
    else if(inputCourriel.validity.typeMismatch){
        erreurCourriel.innerText = "Veuillez entrer une adresse courriel valide.";
        erreurCourriel.classList.add("erreur-auth");
        return false;
    }
    else if(inputCourriel.validity.tooShort){
        erreurCourriel.innerText = "Le Courriel est trop courte. Elle doit contenir au moins 6 caractères.";
        erreurCourriel.classList.add("erreur-auth");
        return false;
    }
    else if(inputCourriel.validity.toolong){
        erreurCourriel.innerText = "Le Courriel est trop longue. Elle ne doit pas dépasser 20 caractères.";
        erreurCourriel.classList.add("erreur-auth");
        return false;
    }
}

/**
 * function pour verifier le nom cote client
 * @param {object} inputNom 
 * @returns 
 */
export function validationNom(inputNom){
    if(inputNom.validity.valid){
        erreurNom.innerText = "";
        return true;
    }
    else if(inputNom.validity.valueMissing){
        erreurNom.innerText = "le Nom est obligatoire. Veuillez le remplir.";
        erreurNom.classList.add("erreur-auth");
        return false;
    }
    else if(inputNom.validity.tooShort){
        erreurNom.innerText = "Le Nom est trop courte. Elle doit contenir au moins 3 caractères.";
        erreurNom.classList.add("erreur-auth");
        return false;
    }
    else if(inputNom.validity.toolong){
        erreurNom.innerText = "Le Nom est trop longue. Elle ne doit pas dépasser 10 caractères.";
        erreurNom.classList.add("erreur-auth");
        return false;
    }
}

/**
 * function pour verifier le prenom cote client
 * @param {object} inputprenom 
 * @returns 
 */
export function validationPrenom(inputprenom){
    if(inputprenom.validity.valid){
        erreurPrenom.innerText = "";
        return true;
    }
    else if(inputprenom.validity.valueMissing){
        erreurPrenom.innerText = "le Prenom est obligatoire. Veuillez le remplir.";
        erreurPrenom.classList.add("erreur-auth");
        return false;
    }
    else if(inputprenom.validity.tooShort){
        erreurPrenom.innerText = "Le Prenom est trop courte. Elle doit contenir au moins 3 caractères.";
        erreurPrenom.classList.add("erreur-auth");
        return false;
    }
    else if(inputprenom.validity.toolong){
        erreurPrenom.innerText = "Le Prenom est trop longue. Elle ne doit pas dépasser 10 caractères.";
        erreurPrenom.classList.add("erreur-auth");
        return false;
    }
}

/**
 * function pour verifier mot de passe cote client 
 * @param {object} inputMotDePasse 
 * @returns 
 */
export function validationMotDePasse(inputMotDePasse){
    if(inputMotDePasse.validity.valid){
        erreurMotDePasse.innerText = "";
        return true;
    }
    else if(inputMotDePasse.validity.valueMissing){
        erreurMotDePasse.innerText = "Mot De Passe est obligatoire. Veuillez le remplir.";
        erreurMotDePasse.classList.add("erreur-auth");
        return false;
    }
    else if(inputMotDePasse.validity.tooShort){
        erreurMotDePasse.innerText = "Le Mot De Passe est trop courte. Elle doit contenir au moins 6 caractères.";
        erreurMotDePasse.classList.add("erreur-auth");
        return false;
    }
    else if(inputMotDePasse.validity.toolong){
        erreurMotDePasse.innerText = "Le Mot De Passe est trop longue. Elle ne doit pas dépasser 20 caractères.";
        erreurMotDePasse.classList.add("erreur-auth");
        return false;
    }
}