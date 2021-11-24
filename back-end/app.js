// Import du module "express" grace a NPM. Framework basé sur node
const express = require('express');
// Importation du module Bodyparser. Permet d'extraire l'objet JSON des requêtes POST
const bodyParser = require('body-parser');
// Importation du module qui donne l'accès à notre à fichier (Upload d'images)
const path = require('path');
// Implémentation du système de sécurité
const cors = require('cors'); 
// Limite le nombre de connexion maximale pour eviter les attaques de force brute
const rateLimit = require("express-rate-limit");
// Importation du module permettant le telechargement de fichier (png, jpeg, gif ...)
const fileUpload = require('express-fileupload');
// Importation du module permettant la compression des fichiers en GZIP et augment ainsi la performance du site
const compression = require('compression');
// Importation des module pour protéger l'application des vulnérabilités (requêtes HTTP, DNS navigateur, en-têtes ...)
const helmet = require('helmet');
const session = require('cookie-session');
const nocache = require('nocache');

// Déclaration des routes pour les Utilisateurs, les messages et les likes.
const userRoutes = require('./routes/user.js');
const messageRoutes = require('./routes/message.js');
const likeRoutes = require('./routes/like.js')

// Importation du module 'dotenv'concernant le masquage des informations de connexion à la base de données en utilisant desnvariables d'environnement
require('dotenv').config();

// Création de l'application "Express"
const app = express();

app.use(express.static('images')); //to access the files in public folder

// Utilisation des Cors. Permet aux requêtes AJAX d'ignorer la politique de même origine et d'accéder aux ressources à partir d'hôtes distants.
app.use(cors()) 

// Connection entre le module FileUpload et le server Node.
app.use(fileUpload());

// Utilisatation de la librairie "compression"
app.use(compression());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Cache-Control', 'public, max-age=31557600'); 
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Sécuriser Express en définissant divers en-têtes HTTP. 
app.use(helmet());

// Envoi des données (sous la forme d'un objet de données) au serveur 
// on demande au serveur d'accepter ou de stocker ces données (objet), qui sont incluses dans le corps (req.body) de cette demande.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Désactive la mise en cache du navigateur
app.use(nocache());

// Activation du nombre maximale de requête par minute.
app.use(limiter);

// Middleware
app.use('/images', express.static(path.join(__dirname, 'images')));

// Modèle de route appliqué à la méthode "USE" qui correspond à l'URL demandé par le frontend
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api', likeRoutes);

// Export de l'application express (déclaration dans le serveur)
module.exports = app;