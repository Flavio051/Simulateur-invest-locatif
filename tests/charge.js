// Charge le lecteur d'annonce depuis un fichier (lecteur.js ou index.html, entre les marqueurs)
const fs = require("fs");
module.exports = function charger(fichier) {
  const src = fs.readFileSync(fichier, "utf8");
  const a = src.indexOf("/* LECTEUR:DEBUT */"), b = src.indexOf("/* LECTEUR:FIN */");
  if (a < 0 || b < 0) throw new Error("marqueurs absents");
  return new Function(src.slice(a, b) + "\nreturn { lireAnnonce, nbFr, siteAnnonce };")();
};
