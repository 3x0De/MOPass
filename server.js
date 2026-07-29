import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const csvPath = path.resolve(process.cwd(), "public/comptes.csv");

app.post("/api/save-csv", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).send("Contenu vide.");
  }

  const dir = path.dirname(csvPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFile(csvPath, content, "utf8", (err) => {
    if (err) {
      console.error("Erreur écriture :", err);
      return res.status(500).send("Erreur écriture.");
    }
    console.log("Fichier mis à jour avec succès sur :", csvPath);
    res.send("OK");
  });
});

const server = app.listen(3001, () => {
  console.log("Serveur démarré sur http://localhost:3001");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("Port 3001 déjà occupé.");
    process.exit(1);
  } else {
    console.error("Erreur du serveur HTTP :", err);
  }
});
