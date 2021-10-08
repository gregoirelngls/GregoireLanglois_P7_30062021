//Import
const auth = require('../middleware/auth');
const express = require('express');
let models = require('../models');
let utils = require('../utils/jwt.utils');
const router = express.Router();
const likeCtrl = require('../controllers/like');

//Routage
router.post('/messages/:messageId/vote/like',auth, likeCtrl.likePost);
router.post('/messages/:messageId/vote/dislike', auth, likeCtrl.dislikePost);


module.exports = router;
