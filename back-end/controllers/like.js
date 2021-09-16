// Importation des dossiers et des modules indispensables pour l'utilisation de notre contrôleur 'like'.
let models   = require('../models');
let jwtUtils = require('../utils/jwt.utils');
let asyncLib = require('async');

// Création des constantes pour nos fonctions.
const DISLIKED = 0;
const LIKED    = 1;

// Logique métier de nos routes "like" et "dislike".

// Fonction qui permet de liker un message.
exports.likePost = (req, res) => {
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

    asyncLib.waterfall([
      function(done) {
        // On vérifie dans la base de données si notre message existe bel et bien. (On utilise findOne).
        models.Message.findOne({
          // Paramêtre de recherche (identifiant du message que l'on a saisi dans l'URL).
          where: { id: messageId }
        })
        .then(function(messageFound) {
          done(null, messageFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      // On vérifie si le message a été correctement trouvé.
      function(messageFound, done) {
        if(messageFound) {
          // Requête dans la base de donnée afin de récupérer l'objet "Utilisateur"
          models.User.findOne({
            where: { id: userId }
          })
          // On récupère l'objet "Utilisateur" et on stock les données dans la variables "userFound".
          .then(function(userFound) {
            // On fait appel à notre callback "done" qui envoie messageFound et userFound en tant que paramêtre.
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      // Dans cette fonction, on vérifié si l'utilisateur a été trouvé.
      function(messageFound, userFound, done) {
        if(userFound) {
          // Si l'utilisateur a été trouvé, on vérifie dans la table "likes" (jonction entre user et message)
          // On recherche une entrée qui correspond à la fois à userId et messageId.
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId
            }
          })
          // informations précédentes, stockées dans la variables "userAlreadyLikedFOund", et qui nous permet de savoir si l'utilisateur a deja liké le message
          .then(function(userAlreadyLikedFound) {
            done(null, messageFound, userFound, userAlreadyLikedFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      // Dans cette 4ème étape, on s'assure que l'utilisateur n'a pas deja liké le message avec ce que l'on a récupéré juste avant.
      function(messageFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {
          // Si tout e passe bien, on ajoute la relation qui uni le message et l'utilisateur.
          // cela permettra de crééer une nouvelle tables dans la base de données et donc de savoir plus tard si le message a deja été liké ou non.
          messageFound.addUser(userFound, { isLike: LIKED })
          .then(function (alreadyLikeFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound.update({
              isLike: LIKED,
            }).then(function() {
              done(null, messageFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'message already liked' });
          }
        }
      },
      // 5ème et dernière fonction. Mise à jour de l'objet et incrémentation du like sur le message.
      function(messageFound, userFound, done) {
        messageFound.update({
          likes: messageFound.likes + 1,
        }).then(function() {
          // Callback done, on oublie le paramêtre null car on a terminé notre waterfall.
          done(messageFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });
      },
      // Fonction qui nous permet d'afficher (ou non) le message qui a été modifié (uniquement la propriété like qui va devoir s'incrémenter).
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
},
  // Fonction qui permet de Disliker un message. La logique métier est la même, sauf qu'on va faire -1 au lieu de +1.
exports.dislikePost = (req, res) => {
  
   let headerAuth  = req.headers['authorization'];
   let userId      = jwtUtils.getUserId(headerAuth);


   let messageId = parseInt(req.params.messageId);

   if (messageId <= 0) {
     return res.status(400).json({ 'error': 'invalid parameters' });
   }

   asyncLib.waterfall([
    function(done) {
       models.Message.findOne({
         where: { id: messageId }
       })
       .then(function(messageFound) {
         done(null, messageFound);
       })
       .catch(function(err) {
         return res.status(500).json({ 'error': 'unable to verify message' });
       });
     },
     function(messageFound, done) {
       if(messageFound) {
         models.User.findOne({
           where: { id: userId }
         })
         .then(function(userFound) {
           done(null, messageFound, userFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify user' });
         });
       } else {
         res.status(404).json({ 'error': 'post already liked' });
       }
     },
     function(messageFound, userFound, done) {
       if(userFound) {
         models.Like.findOne({
           where: {
             userId: userId,
             messageId: messageId
           }
         })
         .then(function(userAlreadyLikedFound) {
            done(null, messageFound, userFound, userAlreadyLikedFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify is user already liked' });
         });
       } else {
         res.status(404).json({ 'error': 'user not exist' });
       }
     },
     function(messageFound, userFound, userAlreadyLikedFound, done) {
      if(!userAlreadyLikedFound) {
        messageFound.addUser(userFound, { isLike: DISLIKED })
        .then(function (alreadyLikeFound) {
          done(null, messageFound, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to set user reaction' });
        });
      } else {
        if (userAlreadyLikedFound.isLike === LIKED) {
          userAlreadyLikedFound.update({
            isLike: DISLIKED,
          }).then(function() {
            done(null, messageFound, userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user reaction' });
          });
        } else {
          res.status(409).json({ 'error': 'message already disliked' });
        }
      }
     },
     function(messageFound, userFound, done) {
       messageFound.update({
         likes: messageFound.likes - 1,
       }).then(function() {
         done(messageFound);
       }).catch(function(err) {
         res.status(500).json({ 'error': 'cannot update message like counter' });
       });
     },
   ], function(messageFound) {
     if (messageFound) {
       return res.status(201).json(messageFound);
     } else {
       return res.status(500).json({ 'error': 'cannot update message' });
     }
   });
}
