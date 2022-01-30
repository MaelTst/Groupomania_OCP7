const jwt = require('jsonwebtoken');

// Middleware d'authentification présent sur chaque endpoints nécessitant une authentification
// Vérifie la validité du token présent dans le cookie envoyé par le front
module.exports = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        req.token = jwt.verify(token, process.env.JWT);
        if (req.token) {
            next();
        }
    }
    catch (error) {
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
            .json({ message: "Votre session n'est plus valide, veuillez vous reconnecter" })
    }
};