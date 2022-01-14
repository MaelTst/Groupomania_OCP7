const multer = require('multer');

// Dictionnaire permettant de définir l'extension du fichier en fonction de son type MIME 
const MIME_TYPES = {
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Configuration du Middleware Multer indiquant sous quel nom (filename) et dans quel dossier enregistrer les fichiers reçus (destination)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'img');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000
  },
  fileFilter: function (req, file, callback) {
    if (MIME_TYPES[file.mimetype]) {
      callback(null, true);
    } else {
      req.fileError = "Seuls les fichiers image sont acceptés (.bmp .gif .jpg .jpeg .png .webp)"
      callback(null, false);
    }
  }
})

const multerConfig = upload.single('image')

module.exports = function (req, res, next) {
  multerConfig(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      req.fileSizeError = true }
    next()
  })
}