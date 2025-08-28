import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../services/AuthService";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (!verifyToken()) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const dataProfile = await getProfile();
        const userData = dataProfile.data;
        if (userData.success) {
          setUser(userData.user);
        } else {
          console.log(erreur);
        }
      } catch (error) {
        console.log("Erreur de :", erreur);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-600 rounded-full dark:bg-gray-600">
          <span className="font-bold text-white text-xl">
            {user.name?.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {user.name}
        </h2>
        <p className="text-gray-500">@{user.username}</p>
      </div>

      {/* Informations */}
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Email:</span>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Nom:</span>
          <p className="text-gray-600">{user.name}</p>
        </div>
      </div>

      {/* Date création */}
      <div className="text-center mt-6 text-sm text-gray-400">
        Créé le: {user.createdAt}
      </div>
    </div>
  );
};

export default Profile;
