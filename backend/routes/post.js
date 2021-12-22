const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

// Router indiquant les middlewares et controllers à utiliser pour les differents endpoints de la route /sauces
router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAll);
router.get('/user/:id', auth, postCtrl.getUserPost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);
//router.post('/:id/like', auth, postCtrl.likePost);
module.exports = router;