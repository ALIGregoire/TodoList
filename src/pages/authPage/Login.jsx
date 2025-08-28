import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { verifyToken, loginFonction } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { verifyEmail, verifyPassword } from "../../services/verifyData";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const valid = await verifyToken();
      if (valid) {
        navigate("/dashboard");
      }
    };
    checkToken();
  }, [navigate]);

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

    // Vérification des données
    if (!verifyEmail(formData.email)) {
      setIsError(true);
      setDisplayError("Email invalide");
      setIsLoading(false);
      return;
    }
    if (!verifyPassword(formData.password)) {
      setIsError(true);
      setDisplayError(
        "Le mot de passe doit contenir 8 caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginFonction(formData);
      const data = response.data;
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Connexion réussie", data.user);
        navigate("/dashboard");
      } else {
        setIsError(true);
        setDisplayError(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setDisplayError("Problème de serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5 overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-8 sm:p-10">
        <header className="text-center mb-6">
          <div className="flex justify-center items-center text-blue-600 text-2xl font-bold mb-2">
            <FaCheckCircle className="mr-2" />
            MyTodo
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
            Connectez-vous
          </h1>
          <p className="text-gray-500 text-sm">
            Reprenez là où vous vous êtes arrêté
          </p>
        </header>

        {isError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
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

          {/* Password */}
          <div className="relative">
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

          <div className="text-right">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Bouton */}
          {isLoading ? (
            <div className="mt-4">
              <button
                disabled
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition flex justify-center items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-5 h-5 mr-2 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858..."
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038..."
                    fill="currentColor"
                  ></path>
                </svg>
                Veuillez patienter...
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Se connecter
              </button>
            </div>
          )}
        </form>

        <footer className="text-center mt-5 text-gray-500 text-sm">
          Vous n'avez pas de compte ?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Inscrivez-vous
          </a>
        </footer>
      </div>
    </div>
  );
}
