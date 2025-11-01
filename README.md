 # BotCMD

 BotCMD est un bot Discord de modération et d'utilitaires, adapté aux serveurs GTA/NoLimit.
 Ce dépôt contient le code source du bot, un exemple de configuration et la documentation pour l'exécuter et y contribuer.

 [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

 ## Fonctionnalités

 - Attribution de rôle automatique à l'arrivée d'un membre
 - Attribution de rôle promo basée sur le statut personnalisé (presence)
 - Commandes de modération : ban, kick, mute, warn, clear
 - Utilitaires : giveaways, statistiques du serveur, suivi des votes

 ## Démarrage rapide

 1. Installer les dépendances

 ```bash
 npm install
 ```

 2. Créer la configuration

 ```bash
 cp config/config.example.js config/config.js
 # Modifier `config/config.js` et ajouter votre token et les IDs
 ```

 3. Lancer le bot

 ```bash
 node index.js
 # ou avec PM2 : pm2 start index.js --name BotCMD
 ```

 4. (Optionnel) Activer les logs de debug pour la gestion des présences

 ```bash
 DEBUG_PRESENCE=1 node index.js
 ```

 ## Bonnes pratiques avant publication sur GitHub

 1. Vérifier que `config/config.js` n'est pas suivi par git. Si c'est le cas, le retirer et ajouter dans l'historique si nécessaire.

 ```bash
 git rm --cached config/config.js || true
 git add .gitignore config/config.example.js README.md
 git commit -m "Préparer le dépôt pour publication : example config et README"
 ```

 2. Créer le dépôt distant et pousser

 ```bash
 # Avec l'outil GitHub CLI (recommandé) :
 gh repo create vgtray/BotCMD --public --source=. --remote=origin
 git branch -M main
 git push -u origin main
 ```

 **Important :** si vous avez accidentellement poussé un token, révoquez-le immédiatement dans le portail développeur Discord et créez-en un nouveau.

 ## Structure recommandée

 - `config/config.example.js` — modèle de configuration (NE PAS COMMITER vos tokens)
 - `events/`, `commands/` — comportements et commandes du bot
 - `services/` — services utilitaires (logger, blacklist, backups)
 - `data/` — données runtime (ignorées par git)

 ## Développement & contribution

 Voir `CONTRIBUTING.md` pour les règles de contribution, le style de code et le workflow de PR.

 ### Règles rapides

 - Faites des commits petits et lisibles
 - Testez localement avant d'ouvrir une PR
 - Ne commitez jamais de secrets

 ## Dépannage

 - Le bot n'arrive pas à ajouter/retraiter un rôle : vérifiez que le rôle du bot est au-dessus du rôle ciblé et qu'il a la permission `Manage Roles`.
 - Si vous observez des événements `presenceUpdate` répétés qui provoquent des logs duplicats : activez `DEBUG_PRESENCE` pour diagnostiquer et ouvrez une issue avec un screenshot.

 ## Licence

 Ce projet est sous licence MIT — voir le fichier `LICENSE`.

 ## Contact

 Pour de l'aide, ouvrez une issue ou contactez les mainteneurs listés dans `config/config.example.js`.
