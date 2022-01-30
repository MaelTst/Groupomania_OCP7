const { check, validationResult } = require('express-validator');

// Middleware de validation pour la route de création d'utilisateurs
exports.user = [
    check('email').isEmail(),
    check('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }),
    check('nickname').isLength({ min: 6, max: 30 }).isAlphanumeric('fr-FR', { ignore: ' ' }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }
        else {
            next();
        }
    },
];

// Middleware de validation pour les routes de création de posts et commentaires
exports.post = [
    check('content').isLength({ min: 6, max: 300 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }
        else {
            next();
        }
    },
];

// Middleware de validation pour la route de modification d'utilisateurs
exports.updateUser = [
    check('password').optional().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }
        else {
            next();
        }
    },
];