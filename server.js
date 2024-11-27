// Importation du framework Express, qui est utilisé pour créer et gérer un serveur web.
const express = require("express");

// Importation de la fonction `exec` du module `child_process`, utilisée pour exécuter des commandes système.
const { exec } = require("child_process");

// Importation de `cors` (Cross-Origin Resource Sharing), qui permet de gérer les requêtes venant d'autres origines.
const cors = require("cors");

// Création d'une application Express.
const app = express();

// Activation de CORS pour permettre à des clients (frontend) d'autres domaines de communiquer avec le serveur.
app.use(cors());

// Configuration pour que le serveur puisse lire le corps des requêtes au format JSON.
app.use(express.json());

// Définition d'une route POST à "/download", qui gère les requêtes pour télécharger une playlist.
app.post("/download", (req, res) => {
  // Extraction de l'URL de la playlist depuis le corps de la requête.
  const { url } = req.body;

  // Vérification que l'URL de la playlist est fournie. Si ce n'est pas le cas, retourner une erreur 400.
  if (!url) {
    return res.status(400).send("URL de playlist manquante !");
  }

  // Construction de la commande `yt-dlp` pour télécharger la playlist avec le format vidéo de meilleure qualité.
  const command = `yt-dlp -f best -o "%(title)s.%(ext)s" "${url}"`;

  // Exécution de la commande `yt-dlp` dans un processus enfant.
  exec(command, (error, stdout, stderr) => {
    // Si une erreur survient pendant l'exécution, l'afficher dans la console et retourner une erreur 500 au client.
    if (error) {
      console.error(`Erreur : ${stderr}`);
      return res.status(500).send("Erreur lors du téléchargement !");
    }

    // Si le téléchargement réussit, afficher la sortie de la commande dans la console et retourner un succès.
    console.log(`Sortie : ${stdout}`);
    res.status(200).send("Téléchargement terminé avec succès !");
  });
});

// Définition du port sur lequel le serveur va écouter les requêtes.
const PORT = 5000;

// Lancement du serveur Express sur le port spécifié.
app.listen(PORT, () => {
  // Message affiché dans la console lorsque le serveur démarre avec succès.
  console.log(`Serveur lancé sur le port ${PORT}`);
});
