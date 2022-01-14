const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const rateLimit = require('../middleware/rate-limit');

// Router indiquant les middlewares et controllers à utiliser pour les differents endpoints de la route /api/posts
router.post('/', rateLimit.post, auth, multer, validation.post, postCtrl.createPost);
router.get('/', auth, postCtrl.getAll);
router.get('/unique/:id', auth, postCtrl.getOnePost);
router.get('/user/:id', auth, postCtrl.getUserPost);
router.get('/mostlikedpics', auth, postCtrl.getMostLikedPics);
router.get('/liked/:id', auth, postCtrl.getUserFavoritesPost);
router.get('/pics', auth, postCtrl.getPicsPost);
router.put('/:id', auth, multer, validation.post, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.likePost);
router.post('/:id/comment', rateLimit.comment, auth, validation.post, postCtrl.createComment);
router.delete('/:id/comment/:commentId', auth, postCtrl.deleteComment);
router.put('/:id/comment/:commentId', auth, validation.post, postCtrl.updateComment);

module.exports = router;