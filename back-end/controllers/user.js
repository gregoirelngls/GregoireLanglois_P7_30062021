//Import
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');
let asyncLib = require('async');
let jwtUtils = require('../utils/jwt.utils');

// Création des constantes pour le contrôleur "User".
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,10}$/;



// fonction permettant l'enregistrement d'un nouvel utilisateur.
module.exports ={
register: function (req, res) {
  // On recupère les paramêtres utilisés dans les requêtes.
  let email    = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let bio      = req.body.bio;

  // Si l'un des champs suivant n'est pas renseigné, on evoie un message d'erreur.
  if (email == null || username == null || password == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }
  // Si le nom d'utilisateurs comporte plus de 15 caractères ou moins de 4 caractères, on envoie un message d'erreur.
  if (username.length >= 15 || username.length <= 4) {
    return res.status(400).json({ 'error': 'wrong username (must be length 4 - 15)' });
  }
  // Si l'email n'est pas valide (règles REGEXP), on evoie un message d'erreur.
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ 'error': 'email is not valid' });
  }
  // SI le mot de passe n'est pas valide (règles REGEXP), on evoie un message d'erreur.
  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
  }
  // Utilisation des cascades grâce au module async, afin de rendre notre code plus propre et plus lisible.
  asyncLib.waterfall([
    function(done) {
      // On vérifie si l'utilisateur n'existe pas dans la base de données.
      models.User.findOne({
        attributes: ['email'],
        where: { email: email }
      })
      // Si la requête s'effectue bien, on passe créer un paramêtre "userFound" dans une fonction de notre .then.
      .then(function(userFound) {
        done(null, userFound);
      })
      // Si la requête s'effectue mal, on envoie un message d'erreur.
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },

    function(userFound, done) {
      // On vérifie si l'utilisateur existe.
      if (!userFound) {
        // Si l'utilisateur n'existe pas, on utilise la fonction "hash" de bcrypt pour haser/saler le mot de passe.
        bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
          done(null, userFound, bcryptedPassword);
        });
        // Si l'utilisateur existe déja, il y a conflit et on envoie le message suivant.
      } else {
        return res.status(409).json({ 'error': 'user already exist' });
      }
    },
    // Une fois notre mdp hasher/saler, on créer notre nouvel utilisateur en lui assignant les champs requis.
    function(userFound, bcryptedPassword, done) {
      let newUser = models.User.create({
        email: email,
        username: username,
        password: bcryptedPassword,
        bio: bio,
        isAdmin: false
      })
      .then(function(newUser) {
        done(newUser);
      })
      // 
      .catch(function(err) {
        return res.status(500).json({ 'error': 'cannot add user' });
      });
    }
    
  ], function(newUser) {
    // On retourne qu'il n'y a pas eu d'erreur et que l'utilisateur a bien été créée, en lui assigant un identifiant d'utilisateur (newUser.id).
    if (newUser) {
      return res.status(201).json({
        'userId': newUser.id
      });
    // On renvoie une erreur si cela se passe mal.
    } else {
      return res.status(500).json({ 'error': 'cannot add user' });
    }
  });
},

login: function(req, res) {
  // Params
  let email    = req.body.email;
  let password = req.body.password;

  console.log(req.body);
  console.log("lol" , password);
  if (email == null ||  password == null) {
    console.log("coucou");
  
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        where: { email: email }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if (userFound) {
        bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
          done(null, userFound, resBycrypt);
        });
      } else {
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    },
    function(userFound, resBycrypt, done) {
      if(resBycrypt) {
        done(userFound);
      } else {
        return res.status(403).json({ 'error': 'invalid password' });
      }
    }
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json({
        'userId': userFound.id,
        'token': jwtUtils.generateToken(userFound)
      });
    } else {
      return res.status(500).json({ 'error': 'cannot log on user' });
    }
  });
},

getUserProfile: function (req, res) {
  // Getting auth header
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);

  if (userId < 0)
    return res.status(400).json({ 'error': 'wrong token' });

  models.User.findOne({
    attributes: [ 'id', 'email', 'username', 'bio' ],
    where: { id: userId }
  }).then(function(user) {
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ 'error': 'user not found' });
    }
  }).catch(function(err) {
    res.status(500).json({ 'error': 'cannot fetch user' });
  });
},

updateUserProfile: function (req, res) {
  // Getting auth header
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);

  // Params
  let bio = req.body.bio;

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        attributes: ['id', 'bio'],
        where: { id: userId }
      }).then(function (userFound) {
        done(null, userFound); 
      }) 
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      }); 
    }, 
    function(userFound, done) {
      if(userFound) {
        userFound.update({
          bio: (bio ? bio : userFound.bio)
        }).then(function() {
          done(userFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update user' });
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json(userFound);
    } else {
      return res.status(500).json({ 'error': 'cannot update user profile' });
    }
  });
},

deleteUserProfile: function (req, res) {
  // Récupération de l'identifiant de l'utilisateur.
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);

  if (userId != null) {
      //Recherche sécurité si user existe bien
      models.User.findOne({
          where: { id: userId }
      })
          .then(user => {
              if (user != null) {
                  //Delete de tous les posts de l'user même s'il y en a pas
                  models.Message
                      .destroy({
                          where: { userId: user.id }
                      })
                      .then(() => {
                          console.log('Tous les posts de cet user ont été supprimé');
                          // On supprime l'utilisateur avec la fonction "Destroy"
                          models.User
                              .destroy({
                                  where: { id: user.id }
                              })
                              .then(() => res.end())
                              .catch(err => console.log(err))
                      })
                      .catch(err => res.status(500).json(err))
              }
              else {
                  res.status(401).json({ error: 'Cet user n\'existe pas' })
              }
          })
  } else {
      res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
  }
}
}

  