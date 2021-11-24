// Importation des dossiers et des modules indispensables pour l'utilisation de notre contrôleur 'like'.
let models   = require('../models');
let jwtUtils = require('../utils/jwt.utils');
let asyncLib = require('async');


// Création des constantes pour nos fonctions.
const DISLIKED = 0;
const LIKED    = 1;

// Logique métier de nos routes "like" et "dislike".

// Fonction qui permet de liker un message.
module.exports ={
  likePost: function (req, res) {
    // On identifie notre utilisateur.
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);
    // Paramêtre(s) utilisé(s) par nos fonctions.
    // On récupère ici l'identifiant du message concerné.
    let messageId = parseInt(req.params.messageId);
    // On détermine si l'identifiant du message est valide ou non.
    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
    models.Message.findOne({
      // Paramêtre de recherche (identifiant du message que l'on a saisi dans l'URL).
      where: { id: messageId }
    })
    .then(function(messageFound) {
      let usersLiked = JSON.parse(messageFound.usersLiked) || [];
      let usersDisliked = JSON.parse(messageFound.usersDisliked) || [];
      if (!usersLiked.includes(userId)) {
        let disLikes = usersDisliked.includes(userId) ? messageFound.disLikes - 1 : messageFound.disLikes;
        usersLiked.push(userId);
        usersDisliked = usersDisliked.filter(id => id !== userId);
        models.Message
        .update(
            {
              usersLiked: JSON.stringify(usersLiked),
              usersDisliked: JSON.stringify(usersDisliked),
              likes: messageFound.likes + 1,
              disLikes: disLikes
            },
            { where: { id: messageFound.id} }
        ) 
        .then(() => res.status(200).json({"code": "likeMessage", 'message': 'like message' })
        )
        .catch(err => res.status(500).json(err))
      } else {
        usersLiked = usersLiked.filter(id => id !== userId);
        models.Message
        .update(
            {
              usersLiked: JSON.stringify(usersLiked),
              likes: messageFound.likes - 1
            },
            { where: { id: messageFound.id} }
        ) 
        .then(() => res.status(200).json({"code": "noLikeMessage", 'message': 'no like message' })
        )
        .catch(err => res.status(500).json(err))
      }
    })
    .catch(function(err) {
      return res.status(500).json({ 'error': 'unable to verify message' });
    });
  },
  // Fonction qui permet de Disliker un message. La logique métier est la même, sauf qu'on va faire -1 au lieu de +1.
  dislikePost : function (req, res) {
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);
    let messageId = parseInt(req.params.messageId);
    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
    models.Message.findOne({
      // Paramêtre de recherche (identifiant du message que l'on a saisi dans l'URL).
      where: { id: messageId }
    })
    .then(function(messageFound) {
      let usersLiked = JSON.parse(messageFound.usersLiked) || [];
      let usersDisliked = JSON.parse(messageFound.usersDisliked) || [];
      if (!usersDisliked.includes(userId)) {
        usersDisliked.push(userId);
        let likes = usersLiked.includes(userId) ? messageFound.likes - 1 : messageFound.likes;
        usersLiked = usersLiked.filter(id => id !== userId);
        models.Message
        .update(
            {
              usersLiked: JSON.stringify(usersLiked),
              usersDisliked: JSON.stringify(usersDisliked),
              disLikes: messageFound.disLikes + 1,
              likes: likes
            },
            { where: { id: messageFound.id} }
        ) 
        .then(() => res.status(200).json({"code": "disLikeMessage", 'message': 'dislike message' })
        )
        .catch(err => res.status(500).json(err))
      } else {
        usersDisliked = usersDisliked.filter(id => id !== userId);
        models.Message
        .update(
            {
              usersDisliked: JSON.stringify(usersDisliked),
              disLikes: messageFound.disLikes - 1
            },
            { where: { id: messageFound.id} }
        ) 
        .then(() => res.status(200).json({"code": "noDislikeMessage", 'message': 'no dislike message' })
        )
        .catch(err => res.status(500).json(err))
      }
    })
    .catch(function(err) {
      return res.status(500).json({ 'error': 'unable to verify message' });
    });
  },
}
