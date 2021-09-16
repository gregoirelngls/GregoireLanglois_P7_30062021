//Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

//Routage
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get('/me', auth, userCtrl.getUserProfile);
router.put('/update',auth, userCtrl.updateUserProfile);
router.delete('/delete', auth, userCtrl.deleteUserProfile)

module.exports = router;