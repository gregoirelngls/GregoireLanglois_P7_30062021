const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routage
router.post("/create", auth, messageCtrl.createMessage);
router.get("/", auth, messageCtrl.listMessages);
router.get("/:id", auth, messageCtrl.getOneMessage);
router.put("/update/:id", auth, multer, messageCtrl.updateMessage);
router.delete("/delete/:id",auth,  messageCtrl.deleteMessage);


module.exports = router; 