// Importations modules et fichiers
let models   = require('../models/');
let jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');


// Création des constantes.
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes qui contient nos fonctions/logique métier CRUD pour les messages.

exports.createMessage = (req, res) => {
//identifier qui créé le message
let userId = jwtUtils.getUserId(req.headers.authorization)
const content = req.body.content;

if (content == null) {
  return res.status(400).json({ 'error' : 'Veuillez renseigner un contenu'});
} 
  models.User.findById(userId)
  .then(userFound => {
      if (!userFound ) {
        return res.status(400).json({'error': 'utilisateur non trouvé'});
      }
      models.Message.create({
          content: content,
          attachment: req.file ? req.file.filename : null,
          likes:0,
          userId: userFound.id
      })
          .then((newPost) => {
              res.status(201).json(newPost)
          })
          .catch((err) => {
              res.status(500).json(err)
          })
      })
      .catch(function (err) {
        return res.status(500).json({'error': 'erreur serveur / impossible de trouvé le message'});
    });
}

// Fonction permettant de lister tous les messages.
exports.listMessages = (req, res) => {
  // On récupère dans l'URL, ces 4 paramêtres.
  // Fields permet de selectionner les colonnes que l'on souhaite afficher.
  let fields  = req.query.fields;
  // Limit et Offset permettent de récupérer les messages par segmentation. (On ne veut pas que l'utilisateur puisse récupérer tous les messages d'un coup car ce serait beaucoup trop lourd/gros.)
  let limit   = parseInt(req.query.limit);
  let offset  = parseInt(req.query.offset);
  // Order permet de sortir la liste des messages via un ordre particulier.
  let order   = req.query.order;
      if (limit > ITEMS_LIMIT) {
    limit = ITEMS_LIMIT;
  }
  // On fait appel à la méthode findAll permettant de récupérer tous les messages, depuis notre model "Message".
  models.Message.findAll({
    // La méthode finAll prend en paramêtre tous les attributs précédents (les variables) mais on va les paramêtrer pour être sûr que l'utilisateur rentre des données corrects.
    order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
    attributes: (fields !== '*' && fields != null) ? fields.split(',') : null, 
    limit: (!isNaN(limit)) ? limit : null,
    offset: (!isNaN(offset)) ? offset : null, 
    include: [{
      model: models.User,
      attributes: ['username'],
      as: 'User'
    }] 
    // Si tout se passe bien, on retourne les messages théoriquement récupérer par le serveur. Et on formate nos données sous le format JSON.
  })
  .then(function(messages) {
    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ "error": "no messages found" });
    }
    // Si ça se passe mal, on récupère l'erreur avec le .catch.
  }).catch(function(err) {
    console.log(err);
    res.status(500).json({ "error": "invalid fields" });
  });
}

//sélection d'un message
exports.getOneMessage = (req, res) => {
  models.Message.findById(req.params.id).then(function (message) {
      if (message) {
          res.status(200).json(message);
      } else {
          res.status(404).json({ "error": 'pas de message trouvé' });
      }
  }).catch(function (err) {
      console.log(err);
      res.status(500).json({ 'error': 'erreur serveur / champs invalide' });
  })
}

exports.updateMessage = (req, res) => {
  //récupération de l'id du demandeur pour vérification
  let userOrder = req.body.userIdOrder;
  //identification du demandeur
  let id = jwtUtils.getUserId(req.headers.authorization);
  models.User.findOne({
      attributes: ['id', 'email', 'username','bio', 'isAdmin'],
      where: { id: id }
  })
      .then(user => {
        console.log(userOrder);
          //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
          if (user && (user.isAdmin == false || user.id != userOrder)) {
              console.log('Modif ok pour le post :', req.body.messageId); 
              models.Message
                  .update(
                      {
                          content: req.body.content,
                          attachment: req.body.attachment
                      },
                      { where: { id: req.body.messageId } }
                  ) 
                  .then(() => res.end()) 
                  .catch(err => res.status(500).json(err))
          } 
          else {
              res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce post' })
          }
      }
      )
      .catch(error => res.status(500).json(error));
}

exports.deleteMessage = (req, res) => {
  let messageId = req.params.id;
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);
 
  models.User.findOne({
    attributes: ['id', 'email', 'username', 'bio', 'isAdmin'],
    where: {id : userId}
  })
  .then(user => {
    models.Message.findOne({
      where: { id: messageId}
    }).then(message => {
      console.log('message ===>', message)
      if (user && (user.isAdmin || userId == message.userId)) {
        models.Message.destroy({
          where: { id: messageId }
        }).then(messageFind => {
          return res.status(200).json('Message supprimé !')
        })
      } else {
        return res.status(403).json('Utilisateur non autorisé à supprimer ce post')
      }
    })
  })
}





