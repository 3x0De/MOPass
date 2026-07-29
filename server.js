import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { exec } from "child_process";

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
      if (err.code === "EACCES" || err.code === "EPERM") {
        try {
          const b64 = Buffer.from(content, "utf8").toString("base64");
          const cmd = `echo '${b64}' | base64 -d | sudo tee "${csvPath}" > /dev/null && sudo chmod 000 "${csvPath}"`;
          exec(cmd, (exErr, stdout, stderr) => {
            if (exErr) {
              console.error("sudo write error:", exErr, stderr);
              return res.status(500).send("Erreur écriture (sudo).");
            }
            console.log("Wrote via sudo:", csvPath);
            return res.send("OK");
          });
          return;
        } catch (e) {
          console.error("sudo fallback failed:", e);
          return res.status(500).send("Erreur écriture.");
        }
      }

      console.error("write error:", err);
      return res.status(500).send("Erreur écriture.");
    }

    fs.chmod(csvPath, 0o000, (chmodErr) => {
      if (chmodErr) {
        const chmodCmd = `sudo chmod 000 "${csvPath}"`;
        exec(chmodCmd, (cErr) => {
          if (cErr) console.error("sudo chmod error:", cErr);
        });
      }
    });

    console.log("Wrote:", csvPath);
    res.send("OK");
  });
});

app.get("/api/comptes.csv", (req, res) => {
  fs.readFile(csvPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "EACCES" || err.code === "EPERM") {
        const cmd = `sudo cat "${csvPath}"`;
        exec(cmd, (exErr, stdout, stderr) => {
          if (exErr) {
            console.error("sudo read error:", exErr, stderr);
            return res.status(500).send("Erreur lecture (sudo).");
          }
          return res.type("text/csv").send(stdout);
        });
        return;
      }
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
