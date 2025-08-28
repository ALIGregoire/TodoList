import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { verifyToken, registerFonction } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import {
  verifyEmail,
  verifyName,
  verifyPassword,
  verifyPasswordConfirme,
  verifyUserName,
} from "../../services/verifyData";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setDisplayError("");
    setIsLoading(true);

    if (!verifyEmail(formData.email)) {
      setIsError(true);
      setDisplayError("Email invalide");
      setIsLoading(false);
      return;
    }
    if (!verifyPassword(formData.password)) {
      setIsError(true);
      setDisplayError(
        "Le mot de passe doit contenir 8 caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre, et un caractère spécial"
      );
      setIsLoading(false);
      return;
    }
    if (!verifyName(formData.name)) {
      setIsError(true);
      setDisplayError("Le nom doit contenir au moins 3 caractères");
      setIsLoading(false);
      return;
    }
    if (!verifyUserName(formData.username)) {
      setIsError(true);
      setDisplayError(
        "Le nom d'utilisateur doit contenir au moins 3 caractères avec des lettres et des chiffres"
      );
      setIsLoading(false);
      return;
    }
    if (!verifyPasswordConfirme(formData.password, formData.confirmPassword)) {
      setIsError(true);
      setDisplayError("Les deux mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerFonction(formData);
      const data = response.data;
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Inscription réussie", data.user);
        navigate("/Dashboard");
      } else {
        setIsError(true);
        setDisplayError(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setIsError(true);
      setDisplayError("Problème de serveur", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5 overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-8 sm:p-10">
        <header className="text-center mb-6">
          <div className="flex justify-center items-center text-blue-600 text-2xl font-bold mb-2">
            <FaCheckCircle />
            MyTodo
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm">
            Commencez à organiser votre vie
          </p>
        </header>

        {isError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ligne 1 */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block mb-1 text-gray-800 font-semibold text-sm"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Votre nom"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="username"
                className="block mb-1 text-gray-800 font-semibold text-sm"
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Votre pseudo"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ligne 2 */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label
                htmlFor="email"
                className="block mb-1 text-gray-800 font-semibold text-sm"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ligne 3 */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
            <div className="flex-1 relative">
              <label
                htmlFor="password"
                className="block mb-2 text-gray-800 font-semibold text-sm"
              >
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Votre mot de passe"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 hover:text-blue-600 transition z-10 bg-transparent"
                aria-label={
                  showPassword
                    ? "Cacher le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>

            <div className="flex-1 relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-gray-800 font-semibold text-sm"
              >
                Confirmation
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirmer votre mot de passe"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 hover:text-blue-600 transition z-10 bg-transparent"
                aria-label={
                  showPassword
                    ? "Cacher le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div class="mt-4">
              <button
                disabled=""
                type="button"
                class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-5 h-5 mr-2 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Please wait..
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                S'inscrire
              </button>
            </div>
          )}
        </form>

        <footer className="text-center mt-5 text-gray-500 text-sm">
          Déjà un compte?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Se connecter
          </a>
        </footer>
      </div>
    </div>
  );
}
