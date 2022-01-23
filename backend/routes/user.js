const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const rateLimit = require('../middleware/rate-limit');

// Router indiquant les middlewares et controllers à utiliser pour les differents endpoints de la route /api/user
router.post('/auth/signup', rateLimit.signup, validation.user, userCtrl.signup);
router.post('/auth/login', rateLimit.login, userCtrl.login);
router.get('/auth/logout', userCtrl.logout);
router.get('/', auth, userCtrl.getAll);
router.get('/:id', auth, userCtrl.getOne);
router.put('/:id', auth, multer, validation.updateUser, userCtrl.updateUser);
router.put('/:id/banner', auth, multer, userCtrl.updateUserBanner);
router.delete('/:id', auth, userCtrl.deleteUser);


module.exports = router;