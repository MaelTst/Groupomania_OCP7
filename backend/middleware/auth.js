const jwt = require('jsonwebtoken');

// Middleware d'authentification présent sur chaque endpoints nécessitant une authentification
module.exports = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        req.token = jwt.verify(token, process.env.JWT);
        const userId = req.token.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        }
        else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: "Requete non authentifiée !" });
    }
};