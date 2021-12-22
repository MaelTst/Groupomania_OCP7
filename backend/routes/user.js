const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Router indiquant les middlewares et controllers à utiliser pour les differents endpoints de la route /api/user
router.post('/auth/signup', validation.signup, userCtrl.signup);
router.post('/auth/login', userCtrl.login);
router.get('/auth/logout', userCtrl.logout);
router.get('/', auth, userCtrl.getAll);
router.get('/:id', auth, userCtrl.getOne);
router.put('/:id', auth, multer, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);
module.exports = router;