const sharp = require('sharp');
const fs = require('fs');

const convertImageToWebP = (req, res, next) => {
  if (!req.file) {
    // Aucun fichier à convertir
    return next();
  }

  const allowedFormats = ['jpg', 'jpeg', 'png'];
  const inputPath = req.file.path; // Chemin d'entrée du fichier
  const outputPath = req.file.path + ".webp"; // Chemin de sortie du fichier
  const fileExtension = inputPath.split('.').pop().toLowerCase(); // Récupération de l'extension du fichier. pop extrait le dernier élément du tableau

  if (!allowedFormats.includes(fileExtension)) {
    // Format de fichier non pris en charge
    fs.unlink(inputPath, (err) => {
      if (err) {
        console.error(err);
      }
      console.log("Format de fichier non pris en charge. Veuillez sélectionner un fichier au format JPG, JPEG ou PNG.");
      return res.status(400).json({ error: "Format de fichier non pris en charge. Veuillez sélectionner un fichier au format JPG, JPEG ou PNG." });
    });
  } else {

  
  sharp(inputPath) 
    .webp({ quality: 80 })
    .toFile(outputPath, (err, info) => { 
      if (err) {
        console.error(err);
        fs.unlink(inputPath); // Supprimer le fichier d'entrée en cas d'erreur
        return res.status(500).json({ error: "Erreur lors de la conversion de l'image" });
      }

      req.file.path = outputPath; // Le fichier converti est enregistré dans outputPath

      // Supprimer le fichier d'entrée après la conversion
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error(err);
        }
        next();
      });
    });
  }
};

module.exports = convertImageToWebP;
