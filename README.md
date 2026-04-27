# Bistro du Quai

Site ergonomique pour un restaurant imaginaire avec systeme de reservation base sur une base de donnees SQLite.

## Structure du projet

- `public/index.html` : page du site
- `public/styles.css` : styles et mise en page
- `public/script.js` : logique du formulaire de reservation cote client
- `public/reservations.html` : espace de gestion des reservations
- `public/reservations.js` : affichage, recherche et suppression des reservations
- `server.js` : backend Express qui gere les reservations et la protection de l'espace gerant
- `package.json` : dependances et script de demarrage

## Installation

1. Ouvrez un terminal dans `c:\Users\Ndute\Documents\PlatformIO\Projects\restaurant-website`
2. Definissez des identifiants gerant avant le lancement :

```powershell
$env:MANAGER_USERNAME="gerant"
$env:MANAGER_PASSWORD="MotDePasseFort"
```

3. Lancez le serveur :

```bash
npm start
```

4. Ouvrez `http://localhost:3000` dans votre navigateur.

## Fonctionnalites

- Page responsive pour un restaurant
- Formulaire de reservation connecte a une base de donnees SQLite
- Blocage des dates de reservation anterieures a la date actuelle
- API REST pour enregistrer les reservations (`POST /api/reservations`)
- Espace gerant protege par authentification HTTP Basic pour consulter et supprimer les reservations
- Suppression d'une reservation via `DELETE /api/reservations/:id`

## Notes

- La base de donnees `reservations.db` est creee automatiquement a la premiere reservation.
- Sans variables d'environnement, l'application utilise temporairement `manager` / `ChangeMeNow!` pour l'acces gerant.
- Si vous souhaitez personnaliser le restaurant, modifiez `public/index.html` et `public/styles.css`.
