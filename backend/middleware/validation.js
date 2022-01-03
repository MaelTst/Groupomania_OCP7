// Middleware de validation pour le endpoint /api/auth/signup
// Vérifie que les entrées mail et password de l'utilisateur respectent les contraintes imposées par les RegEx suivantes :
// mailValidation : [*] + [@] + [*] +[.] + [*]
// passwordValidation : un chiffre, une minuscule, une majuscule et 8 caractères minimum
exports.signup = (req, res, next) => {
    const passwordValidation = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    const mailValidation = new RegExp(/\S+@\S+\.\S+/);
    const nicknameValidation = new RegExp(/^.{6,30}$/);
    let validationCode = "";
    if (!mailValidation.test(req.body.email) || !passwordValidation.test(req.body.password) || !nicknameValidation.test(req.body.nickname)) {
        if (!mailValidation.test(req.body.email)) {
            validationCode += "1";
        }
        if (!passwordValidation.test(req.body.password)) {
            validationCode += "2";
        }
        if (!nicknameValidation.test(req.body.nickname)) {
            validationCode += "3";
        }
        res.status(400).json({ code: validationCode });
    }
    else {
        next();
    }
};