// Middleware empechant les tentatives de bruteForce/spam en limitant le nombre de requetes API sur une route donnée
const rateLimit = require("express-rate-limit");

// Limité à 5 requêtes incorrectes toutes les 15 minutes sur la route POST /api/user/auth/login
exports.login =
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        skipSuccessfulRequests: true,
        message: { message: 'Vous avez effectué trop de tentatives de connexion, veuillez réessayer ultérieurement' },
    });

// Limité à 3 requêtes correctes toutes les 24 heures sur la route POST /api/user/auth/signup
exports.signup =
    rateLimit({
        windowMs: 24 * 60 * 1000,
        max: 3,
        skipFailedRequests: true,
        message: { message: 'Vous avez déjà créé plusieurs comptes récemment, veuillez réessayer ultérieurement' },
    });

// Limité à 5 requêtes correctes toutes les 15 minutes sur la route POST /api/posts/
exports.post =
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        skipFailedRequests: true,
        message: { message: 'Vous avez posté un trop grand nombre de messages récemment, veuillez réessayer ultérieurement' },
    });

// Limité à 10 requêtes correctes toutes les 15 minutes sur la route POST /api/posts/:id/comment
exports.comment =
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        skipFailedRequests: true,
        message: { message: 'Vous avez posté un trop grand nombre de commentaires récemment, veuillez réessayer ultérieurement' },
    });