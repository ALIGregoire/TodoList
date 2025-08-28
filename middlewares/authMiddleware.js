import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Middleware pour protéger les routes
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé, token manquant",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trouver l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expirée, veuillez vous reconnecter",
        code: "TOKEN_EXPIRED",
      });
    }

    // Autres erreurs JWT
    return res.status(401).json({
      success: false,
      message: "Authentification invalide",
    });
  }
};

//Generer le token

export const genererToken = (user) => {
  const token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

//Validation de Email

export const ValidateEmail = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

//Validation de mot de passe
export const ValidatePassword = (password) => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/; // Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
  return regexPassword.test(password);
};

// Middleware pour gérer les erreurs 404
export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  next(error);
};

// Middleware pour gérer les erreurs globales
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

//Verifier si un token est valide
export const isTokenValid = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Token invalide" });
    }
    res.status(200).json({ message: "Token valide", user });
  } catch (error) {
    console.error("Erreur de validation du token:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
