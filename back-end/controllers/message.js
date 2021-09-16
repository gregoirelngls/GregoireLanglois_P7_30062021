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

let id = jwtUtils.getUserId(req.headers.authorization)
  models.User.findOne({
  attributes: ['id', 'email', 'username', 'bio'],
  where: { id: id }
  })
  .then(user => {
      if (user !== null) {
          //Récupération du corps du post,
          let attachment = req.files.file;
          let content = req.body.content;
          console.log('salut' , attachment.name);
          console.log('hello' , req.body);
          if (content == undefined || content.length == 0) {
              res.status(400).json({ error: 'Rien à publier' })
          } else {
              models.Message.create({
                  content: content,
                  attachment: attachment.name,
                  userId: user.id
                  
              })
                  .then((newPost) => {
                      res.status(201).json(newPost)
                  })
                  .catch((err) => {
                      res.status(500).json(err)
                  })
          };
      } else {
          res.status(400).json(error);
      }
  })
  .catch(error => res.status(500).json(error));
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
                          attachement: req.body.attachment
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
/*
exports.deleteMessage = (req, res) => {
  //récupération de l'id du demandeur pour vérification
  let userOrder = req.body.userId;
  //identification du demandeur
  let id = jwtUtils.getUserId(req.headers.authorization);
  models.User.findOne({
      attributes: ['id', 'email', 'username', 'isAdmin'],
      where: { id: id } 
  })
  .then(user => {
    console.log(req.body.messageId);
      //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
      if (user && (user.isAdmin == false || user.id == userOrder)) {
          console.log('Suppression du Message:', req.body.messageId);
          models.Message.findOne({
                  where: { id: req.body.messageId }
              })
              .then((messageFind) => { 
                console.log("salut" + messageFind.id);
                  if (messageFind.attachement) {
                      const filename = messageFind.attachement.split('/images/')[1];
                      console.log("teseeest", filename);
                      fs.unlink(`images/${filename}`, () => {
                          models.Message
                              .destroy({
                                  where: { id: messageFind.id }
                              })
                              .then(() => res.end())
                              .catch(err => res.status(500).json(err))
                      })
                  }
                  else {
                      models.Message
                          .destroy({
                              where: { id: messageFind.id }
                          })
                          .then(() => res.end())
                          .catch(err => res.status(500).json(err))
                  }
              })
              .catch(err => res.status(500).json(err))
      } else { res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
  })
  .catch(error => res.status(500).json(error));
}
*/

exports.deleteMessage = (req, res) => {
  let userOrder = req.params.id;
  let lol = req.query;
  let id = jwtUtils.getUserId(req.headers.authorization)
  models.User.findOne({
    attributes: ['id', 'email', 'username', 'bio', 'isAdmin'],
    where: {id : id}
  })
  .then(user => {
    console.log(lol);
      //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
      if (user && (user.isAdmin == true || user.id == userOrder)) {
          models.Message.findOne({
            where: { id: id}
          })
          .then(messageFind => {
            if (messageFind.attachment) {
              const filename = messageFind.attachment.split('/images')[1];
              console.log("teeeeeest", filename);
              fs.unlink(`images/${filename}`, () => {
                models.Post.destroy({
                  where: { id: postFind.id }
                })
                .then(() => res.end())
                .catch(err => res.status(500).json(err))
              })
            }
            else {
              models.Message.deleteOne({
                where: {id: id}
              })
              .then(() => res.end())
              .catch(err => res.status(500).json(err)) 
            }
          })
          .catch(err => res.status(500).json(err))
       } else { res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
    })
    .catch(error => res.status(500).json(error));
  };





  /*const { Message } = require('../models/index');
  Message.findOne({ where: { id: req.params.id }}) // On trouve l'objet dans la base de données //
      .then(message => {
        console.log("salut" , message);
        Message.destroy({ where: { id: req.params.id } }) // Méthode //
        .then(() => res.status(200).json({ message: 'Message supprimé' }))
        .catch(error => res.status(400).json({ error }));
       /*const filename = Message.attachmentURL.split('/images/')[1];
       fs.unlink(`images/${filename}`, () => {
          Message.destroy({ where: { id: req.params.id } }) // Méthode //
              .then(() => res.status(200).json({ message: 'Message supprimé' }))
              .catch(error => res.status(400).json({ error }));
       })
      })
      .catch(error => res.status(500).json({ error }));
}; */



