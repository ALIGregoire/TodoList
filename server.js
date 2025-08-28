import app from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Vérification de la connexion à la base de données
prisma
  .$connect()
  .then(() => {
    console.log("Connecté à la base de données PostgreSQL");
    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur de connexion à la base de données:", error);
    process.exit(1);
  });
