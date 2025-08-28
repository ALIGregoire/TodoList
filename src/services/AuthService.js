import { API_URL } from "./config";
import axios from "axios";
import api from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

//Fonction pour l'enregistrement d'un utilisateur dans la base de données

export async function registerFonction(formaData) {
  try {
    const response = await api.post("/auth/register", {
      name: formaData.name,
      email: formaData.email,
      password: formaData.password,
      username: formaData.username,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de l'inscription";
    } else {
      return "Erreur du serveur";
    }
  }
}

//Fonction pour faire le login des utilisateur
export async function loginFonction(formaData) {
  try {
    const response = await api.post("/auth/login", {
      email: formaData.email,
      password: formaData.password,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de l'inscription";
    } else {
      console.log("Erreur cote serveur");
    }
  }
}

export async function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function singOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return true;
}
