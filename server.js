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
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (mkErr) {
      console.warn("mkdir failed:", mkErr);
    }
  }

  fs.writeFile(csvPath, content, "utf8", (err) => {
    if (err) {
      console.error("write error:", err);
      return res.status(500).send("Erreur écriture.");
    }

    fs.chmod(csvPath, 0o000, (chmodErr) => {
      if (chmodErr) {
        console.error("chmod error:", chmodErr);
      }
    });

    console.log("Wrote:", csvPath);
    res.send("OK");
  });
});

app.get("/api/comptes.csv", (req, res) => {
  fs.readFile(csvPath, "utf8", (err, data) => {
    if (err) {
      console.error("read error:", err);
      return res.status(500).send("Erreur lecture.");
    }
    res.type("text/csv").send(data);
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
