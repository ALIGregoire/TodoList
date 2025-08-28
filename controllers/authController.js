import bcrypt from "bcryptjs";
import {
  ValidateEmail,
  ValidatePassword,
  genererToken,
} from "../middlewares/authMiddleware.js";
import { prisma } from "../config/api.js";

// Inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    //Verifier que tous les champs sont saisi
    if (!name || !email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    //Valider l'email
    if (!ValidateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email invalide",
      });
    }

    //Valider le password

    if (!ValidatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Mot de passe invalide, il doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      });
    }

    //Verification le nombre de caractères du nom
    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Le nom doit contenir entre 3 et 50 caractères",
      });
    }

    //Verification le nombre de caractères du nom d'utilisateur
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères",
      });
    }
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Un utilisateur avec cet email ou nom d'utilisateur existe déjà",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
      },
    });

    // Créer un token JWT
    const token = genererToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
    });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Verifier que tous les champs sont saisi
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    //Valider l'email
    if (!ValidateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email invalide",
      });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      });
    }

    // Créer un token JWT
    const token = genererToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
    });
  }
};

// Récupérer le profil de l'utilisateur
export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        name: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lor de la récupération du profil",
    });
  }
};

//Verifier si un token est valide
export const isTokenValid = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("Il y'a rien", user);
      return res.status(401).json({ message: "Token invalide" });
    }
    res.status(200).json({ message: "Token valide", user });
  } catch (error) {
    console.error("Erreur de validation du token:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
