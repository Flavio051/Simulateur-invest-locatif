// Tests du lecteur d'annonce (node tests/lecteur-annonce.test.js). Relevés réels du 06/11/2026, réduits.
const assert = require("assert");
const { lireAnnonce, nbFr } = require("./charge")(process.argv[2] || __dirname + "/../index.html");
let ok = 0, ko = 0;
const t = (nom, f) => { try { f(); ok++; } catch (e) { ko++; console.log("ÉCHEC", nom, "\n  ", e.message); } };
const v = (r, k) => r.champs[k] ? r.champs[k].v : undefined;

t("nombres", () => { assert.strictEqual(nbFr("199 000"), 199000); assert.strictEqual(nbFr("165.000"), 165000); assert.strictEqual(nbFr("1 800,00"), 1800); assert.strictEqual(nbFr("85,83"), 85.83); assert.strictEqual(nbFr("50.3"), 50.3); });

// leboncoin, relevé du 06/11/2026 (annonce 3302402853, réduit)
const lbc = { v: 1, url: "https://www.leboncoin.fr/ad/ventes_immobilieres/3302402853", host: "leboncoin.fr", titre: "Appartement 5 pièces 86 m² - Ventes immobilières", og: { "og:image": "https://img.leboncoin.fr/api/v1/lbcpb1/images/fc/46/50/fc4650e1.jpg?rule=ad-image" },
  lbc: { subject: "Appartement 5 pièces 86 m²", body: "RÉF : VA3039 - Rue Goiot, 51100 Reims\nSitué rue Goiot à Reims, cet appartement de 85,83 m²...\nNombre de lots : 20\nPas de procédure en cours", price: [248400], first_publication_date: "2026-11-04 19:40:39", index_date: "2026-11-04 19:40:39",
    images: { urls_large: ["https://img.leboncoin.fr/api/v1/lbcpb1/images/fc/46/50/fc4650e1.jpg?rule=ad-large", "https://img.leboncoin.fr/api/v1/lbcpb1/images/3d/ab/dd/3dabdd6f.jpg?rule=ad-large"] },
    attributes: [{ key: "real_estate_type", value: "2", value_label: "Appartement" }, { key: "square", value: "86" }, { key: "rooms", value: "5" }, { key: "bedrooms", value: "4" }, { key: "energy_rate", value: "d" }, { key: "ges", value: "b" }, { key: "floor_number", value: "0" }, { key: "elevator", value: "2" },
      { key: "fees_at_the_expanse_of", value: "buyer" }, { key: "negotiating_fees_percentage", value: "8" }, { key: "fai_included", value: "1" }, { key: "price_except_fees", value: "230000" }, { key: "immo_sell_type", value: "old" }],
    location: { city: "Reims", zipcode: "51100", district: "Henry Vasnier - Saint-Nicaise" }, owner: { type: "pro" } },
  texte: "Appartement 5 pièces 86 m²\n248 400 €\n...", photos: [] };
t("leboncoin", () => {
  const r = lireAnnonce(lbc);
  assert.strictEqual(r.site, "leboncoin"); assert.strictEqual(v(r, "prix"), 230000); assert.strictEqual(v(r, "agence"), 18400); assert.strictEqual(r.infos.prixAffiche, 248400);
  assert.strictEqual(v(r, "surface"), 86); assert.strictEqual(v(r, "dpe"), "D"); assert.strictEqual(v(r, "ville"), "Reims"); assert.strictEqual(v(r, "cp"), "51100"); assert.strictEqual(v(r, "typeBien"), "appartement");
  assert.strictEqual(r.infos.pieces, 5); assert.strictEqual(r.infos.etage, 0); assert.strictEqual(r.infos.ascenseur, false); assert.strictEqual(r.photos.length, 2); assert.ok(r.publieLe.startsWith("2026-11-0"));
  assert.strictEqual(v(r, "copro"), undefined); assert.strictEqual(v(r, "loyer"), undefined); assert.strictEqual(r.champs.prix.src, "site");
});

// SeLoger, relevé du 06/11/2026 (annonce 26YQWHEI5FN4, réduit)
const slg = { url: "https://www.seloger.com/annonce/achat/grand-est/marne-51/reims-51100/26YQWHEI5FN4", host: "seloger.com", titre: "Appartement à vendre T2/F2 42 m² 199000 € Bois d'Amour-Porte de Paris-Courlancy Reims (51100)", og: {},
  ld: [JSON.stringify({ "@context": "https://schema.org", "@type": "RealEstateListing", datePosted: "2026-07-29T17:02:00.000Z", name: "Appartement à vendre T2/F2 42 m² 199000 €", itemOffered: { "@type": "APARTMENT", numberOfRooms: "2", floorSize: { value: "42" } }, offers: { "@type": "Offer", price: "" } })],
  slg: { metadata: { creationDate: "2026-07-29T17:02:00Z", isNewBuildProject: false }, images: [{ url: "https://mms.seloger.com/2/0/1/8/20186bee.jpg?ci_seal=d6" }, { url: "https://mms.seloger.com/9/9/5/0/99503327.jpg?ci_seal=65" }],
    sections: { location: { address: { city: "Reims", zipCode: "51100", district: "Bois d'Amour" } },
      description: { texts: [{ text: "Au cœur de Reims, ce bel appartement de 42 m2 se situe au premier étage d'une résidence récente de 2019. Il bénéficie d'une grande terrasse d'environ 9,7 m2. Le bien est vendu loué, ce qui en fait une opportunité.\r\n\r\nCaractéristiques techniques\r\n- Taxe foncière : 665 €\r\n- Charges de copropriété : 70 €/mois\r\n- DPE : C" }] },
      hardFacts: { title: "Appartement à vendre", keyfacts: ["2 pièces", "1 chambre", "42 m²", "Étage 1/9"], facts: [{ type: "numberOfRooms", splitValue: "2" }, { type: "numberOfBedrooms", splitValue: "1" }, { type: "livingSpace", splitValue: "42" }, { type: "numberOfFloors", value: "Étage 1/9" }], price: { value: "199 000 €", ariaLabel: "199000 €" } },
      energy: { features: [{ type: "yearOfConstruction", value: "2024" }], certificates: [{ scales: [{ efficiencyClass: { rating: "C" }, type: "FR_ENERGY_AFTER_2021" }, { efficiencyClass: { rating: "C" }, type: "FR_GHG_AFTER_2021" }] }] },
      price: { components: [{ units: [{ main: { message: { value: "Les honoraires sont à la charge du vendeur" } } }] }] } } },
  texte: "", photos: [] };
t("SeLoger", () => {
  const r = lireAnnonce(slg);
  assert.strictEqual(r.site, "SeLoger"); assert.strictEqual(v(r, "prix"), 199000); assert.strictEqual(v(r, "surface"), 42); assert.strictEqual(v(r, "dpe"), "C"); assert.strictEqual(r.infos.ges, "C");
  assert.strictEqual(v(r, "copro"), 840); assert.strictEqual(r.champs.copro.sur, "mois"); assert.strictEqual(v(r, "tf"), 665); assert.strictEqual(v(r, "agence"), 0);
  assert.strictEqual(r.infos.venduLoue, true); assert.strictEqual(r.infos.etage, 1); assert.strictEqual(r.photos.length, 2); assert.strictEqual(v(r, "ville"), "Reims");
});

// Bien'ici, relevé du 06/11/2026 (realEstateAd.json, réduit)
const bi = { url: "https://www.bienici.com/annonce/vente/reims/appartement/3pieces/century-21-202_501_17688", host: "bienici.com", titre: "Achat appartement 3 pièces 54 m², Reims - 110 000 €",
  bi: { annualCondominiumFees: "3084.08", city: "Reims", postalCode: "51100", energyClassification: "F", greenhouseGazClassification: "F", feesChargedTo: "seller", floor: "6", hasElevator: "true", generatedTitle: "Appartement 3 pièces 54 m², Reims - 110 000 €",
    description: "Situé au 6 étage avec ascenseur d'une résidence sécurisée.<br>Des travaux de rafraîchissement ainsi que des améliorations concernant l'isolation sont à prévoir.", price: "110000", surfaceArea: "54.21", propertyType: "flat", roomsQuantity: "3", bedroomsQuantity: "2", yearOfConstruction: "1970", publicationDate: "2026-10-10T00:20:59.863Z",
    photos: [{ url: "https://file.bienici.com/photo/a.jpg" }, { url: "https://file.bienici.com/photo/b.jpg" }] }, texte: "" };
t("Bien'ici", () => {
  const r = lireAnnonce(bi);
  assert.strictEqual(v(r, "prix"), 110000); assert.strictEqual(v(r, "surface"), 54.21); assert.strictEqual(v(r, "copro"), 3084); assert.strictEqual(v(r, "dpe"), "F"); assert.strictEqual(v(r, "agence"), 0);
  assert.strictEqual(v(r, "etat"), "rafraichir"); assert.strictEqual(r.infos.etage, 6); assert.strictEqual(r.infos.annee, 1970); assert.strictEqual(r.photos.length, 2);
});

// PAP : uniquement le texte de la page (comme un copier-coller)
const papTexte = "Vente appartement 2 pièces 45 m² Lille (59000)\n165.000 €\n\nRéf. : G50/1429 / Publié le 06 novembre 2026\n\nÀ partir de 771 € / mois\nLille (59000)\n2 pièces  1 chambre  45 m²  3.667 € le m²\n\nAppartement T2, 45 m² – Dernier étage – 165 000 €.\nDécouvrez ce charmant appartement T2 de 45 m², en excellent état (DPE : classe C), situé au 2ᵉ et dernier étage d'une résidence sécurisée construite en 2018 avec ascenseur.\n• Balcon : 5 m²\nClasse énergie \nA\nB\nC\nD\nE\nF\nG\nGES \nA\nB\nC\nD\nE\nF\nG\nFrais de notaire\n(9 %)\n14 850 €";
t("PAP (texte seul)", () => {
  const r = lireAnnonce({ texte: papTexte, photos: ["https://cdn.pap.fr/photos/pap/3b/09/3b09/3-p1.jpg", "https://www.pap.fr/images/logos/logo-pap.png", "https://www.pap.fr/images/visuels/emojis/neutral-face.png"], url: "https://www.pap.fr/annonces/appartement-lille-59000-r465001429" });
  assert.strictEqual(r.site, "PAP"); assert.strictEqual(v(r, "prix"), 165000); assert.strictEqual(v(r, "surface"), 45); assert.strictEqual(v(r, "dpe"), "C"); assert.strictEqual(v(r, "ville"), "Lille"); assert.strictEqual(v(r, "cp"), "59000");
  assert.strictEqual(v(r, "typeBien"), "appartement"); assert.strictEqual(r.infos.etage, 2); assert.strictEqual(r.infos.annee, 2018); assert.strictEqual(r.infos.ascenseur, true); assert.strictEqual(r.photos.length, 1);
  assert.ok(r.publieLe && r.publieLe.startsWith("2026-11-06"), r.publieLe); assert.strictEqual(r.champs.prix.src, "texte"); assert.strictEqual(r.infos.pieces, 2);
});

// Copier-coller d'une annonce d'agence avec honoraires inclus dans le prix
t("honoraires inclus (texte)", () => {
  const r = lireAnnonce({ texte: "Appartement 3 pièces 62 m² - Nantes (44000)\n215 000 €\nHonoraires : 7,5 % TTC à la charge de l'acquéreur. Prix hors honoraires : 200 000 €.\nCharges annuelles : 1 320 €. Taxe foncière : 980 € par an.\nAppartement à rénover entièrement à rénover. DPE E." });
  assert.strictEqual(v(r, "prix"), 200000); assert.strictEqual(v(r, "agence"), 15000); assert.strictEqual(v(r, "copro"), 1320); assert.strictEqual(v(r, "tf"), 980); assert.strictEqual(v(r, "etat"), "lourd"); assert.strictEqual(v(r, "dpe"), "E"); assert.strictEqual(v(r, "cp"), "44000");
});
t("honoraires en % seulement", () => {
  const r = lireAnnonce({ texte: "Maison 4 pièces 95 m² Angers (49000)\nPrix : 270 000 € honoraires inclus\nHonoraires de 8 % TTC à la charge de l'acquéreur\nSurface du terrain : 400 m²" });
  assert.strictEqual(v(r, "prix"), 250000); assert.strictEqual(v(r, "agence"), 20000); assert.strictEqual(v(r, "surface"), 95); assert.strictEqual(v(r, "typeBien"), "maison");
});
t("vendu loué avec loyer", () => {
  const r = lireAnnonce({ texte: "Studio 22 m² Lyon 7e (69007) 135 000 €. Vendu loué, loyer actuel : 560 € hors charges. Charges de copropriété : 45 € par mois." });
  assert.strictEqual(v(r, "loyer"), 560); assert.strictEqual(v(r, "copro"), 540); assert.strictEqual(r.infos.pieces, 1);
});
t("loyer estimé ignoré", () => {
  const r = lireAnnonce({ texte: "T2 40 m² Reims (51100) 120 000 €. Idéal investisseur : loyer estimé 600 € par mois." });
  assert.strictEqual(v(r, "loyer"), undefined);
});
t("rien d'inventé", () => {
  const r = lireAnnonce({ texte: "Bonjour, voici un texte sans annonce." });
  assert.deepStrictEqual(Object.keys(r.champs), []);
});
t("échelle DPE ignorée", () => {
  const r = lireAnnonce({ texte: "Appartement 50 m² 150 000 €\nClasse énergie \nA\nB\nC\nD\nE\nF\nG" });
  assert.strictEqual(v(r, "dpe"), undefined);
});
console.log(`${ok} réussis, ${ko} échoués`);
process.exit(ko ? 1 : 0);
