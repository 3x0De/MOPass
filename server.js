import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const csvPath = path.resolve("public/comptes.csv");

app.post("/api/save-csv", (req, res) => {
  const { content } = req.body;

  fs.writeFile(csvPath, content, "utf8", (err) => {
    if (err) {
      console.error("Erreur d'écriture :", err);
      return res.status(500).send("Erreur lors de la sauvegarde.");
    }
    console.log("Fichier public/comptes.csv écrasé avec succès !");
    res.send("OK");
  });
});

app.listen(3001, () => {
  console.log("Serveur local d'écriture démarré sur http://localhost:3001");
});
