const jwt = require('jsonwebtoken');

// Middleware d'authentification présent sur chaque endpoints nécessitant une authentification
module.exports = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        req.token = jwt.verify(token, process.env.JWT);
        const userId = req.token.userId;
        if (req.token) {
            next();
        }
    } catch (error) {
        res.status(401)
        .cookie('access_token', "", {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .cookie('isLoggedIn', false, {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .cookie('ID', "", {
            domain: process.env.SITE_DOMAIN,
            expires: new Date(Date.now() - 1)
        })
        .json({ error: "Requete non authentifiée !" })
    }
};