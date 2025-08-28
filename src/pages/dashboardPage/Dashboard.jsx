import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaChartPie,
  FaCheckCircle,
  FaTasks,
  FaPlus,
  FaEllipsisV,
  FaPencilAlt,
  FaTrashAlt,
  FaExclamationCircle,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { singOut, verifyToken } from "../../services/AuthService";
import {
  addGroup,
  getGroups,
  getProfile,
  getStats,
} from "../../services/dashboardService";

import { useNavigate, Link } from "react-router-dom";
import DisplayTaskGroup from "../../components/displayTaskGroup";
import DisplayAllGroup from "../../components/DisplayAllGroup";

export default function Dashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState({});
  const [displayGroup, setDisplayGroup] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [newGroup, setNewGroup] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // 🔎 ajout pour la recherche

  const fetchStatsData = async () => {
    try {
      const dataStats = await getStats();
      const statsData = dataStats.data;
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.log("Erreur de :", error);
    }
  };

  useEffect(() => {
    if (!verifyToken()) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const dataProfile = await getProfile();
        const userData = dataProfile.data;
        if (userData.success) {
          setUserData(userData.user);
        }
      } catch (error) {
        console.log("Erreur de :", error);
      }
    };

    fetchUserData();

    const fetchAllGroups = async () => {
      try {
        const response = await getGroups();
        const dataAllGroups = response.data;
        if (dataAllGroups.success) {
          setGroups(dataAllGroups.groups || []);
          console.log("Récupération des groupes réussie");
        }
      } catch (error) {
        console.log("Erreur :", error);
      }
    };

    fetchAllGroups();

    fetchStatsData();
  }, [navigate]);

  /** ---------- Ajout Groupe ---------- **/
  const HandleAddGroup = (e) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleSubmitAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroup) return;

    try {
      const response = await addGroup(newGroup);
      const dataGroupAdd = response.data;

      if (dataGroupAdd.success) {
        setGroups((prevGroups) => [...prevGroups, dataGroupAdd.group]);
        console.log("Création de Groupe réussie");

        // reset form
        setNewGroup({
          name: "",
          color: "",
        });

        if (fetchStatsData) await fetchStatsData();
      }
    } catch (error) {
      console.log("Erreur lors de la création de groupe :", error);
    }
  };

  const HandleSingOut = () => {
    if (singOut()) {
      navigate("/login");
    }
  };

  // Filtrage des groupes selon la recherche
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header section*/}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            {/* Logo et icone responsive */}
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="#" className="flex ms-2 md:me-24">
                <div className="flex justify-center items-center text-blue-600 text-2xl font-bold mb-2">
                  <FaCheckCircle />
                  <span className="ml-0.5">MyTodo</span>
                </div>
              </a>
            </div>
            {/* Profile avatar */}
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>

                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-600 rounded-full dark:bg-gray-600">
                      <span className="font-bold text-white text-xl">JL</span>
                    </div>
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {userData.name}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {userData.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Voir Profile
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={HandleSingOut}
                        className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/*  Header Section end*/}
      {/* sidebare section */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-15 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {/* Main menu */}
          <ul className="space-y-2 font-medium">
            {/* Dashboard */}
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="ml-3">Dashboard</span>
              </a>
            </li>

            {/* Statistique */}
            <li>
              <Link
                to="/statistique"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.934.998V11a1 1 0 0 0 1 1h7.975a1 1 0 0 0 .998-.934l.005-.074A7.04 7.04 0 0 0 22 10.5 8.5 8.5 0 0 0 13.5 2Z" />
                  <path d="M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z" />
                </svg>

                <span className="flex-1 ml-3 whitespace-nowrap">
                  Statistiques
                </span>
              </Link>
            </li>
          </ul>

          {/* Footer links */}
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center my-6 mb-4 text-gray-500 text-[0.9rem] uppercase tracking-[1px]">
              <span>Mes groupes</span>
              <button
                data-modal-target="crud-modal"
                data-modal-toggle="crud-modal"
                className="bg-transparent border-none text-gray-500 cursor-pointer text-base"
              >
                <FaPlus />
              </button>
            </div>
            <li className="cursor-pointer">
              <button
                onClick={() => {
                  setDisplayGroup(null);
                  setActiveButton(null);
                }}
                className={`flex items-center font-semibold p-2 px-5 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 transition ${
                  activeButton === null
                    ? "bg-[#e6f0ff] text-primary-color"
                    : "hover:bg-[#f0f2f5]"
                }`}
              >
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Tous les Groupes
                </span>
              </button>
            </li>

            {filteredGroups.map((group, index) => (
              <li className="cursor-pointer" key={index}>
                <button
                  onClick={() => {
                    setDisplayGroup(group.id);
                    setActiveButton(group.id);
                  }}
                  className={`flex items-center font-semibold p-2 px-5 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 transition ${
                    activeButton === group.id
                      ? "bg-[#e6f0ff] text-primary-color"
                      : "hover:bg-[#f0f2f5]"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: group.color }}
                  ></div>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    {group.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* main section */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          {/* Barre de recherche */}
          <form
            className="max-w-md mx-auto mb-7"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
                bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Trouver un groupe ou tâche"
              />
            </div>
          </form>
          <div>
            <button
              data-modal-target="crud-modal"
              data-modal-toggle="crud-modal"
              className="px-4 py-2 rounded-lg font-semibold cursor-pointer flex items-center transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              <span>Nouveau groupe</span>
            </button>

            {/* Main modal */}
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Créer un nouveau Groupe de tache
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="crud-modal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form className="p-4 md:p-5" onSubmit={HandleSubmitAddGroup}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newGroup?.name ?? ""}
                          onChange={HandleAddGroup}
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Couleur
                        </label>
                        <select
                          id="countries"
                          name="color"
                          value={newGroup?.color ?? ""}
                          onChange={HandleAddGroup}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">-- Choisir une couleur --</option>
                          <option value="#facc15">Jaune</option>
                          <option value="#22c55e">Verte</option>
                          <option value="#ef4444">Rouge</option>
                          <option value="#4361ee">Bleu</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="me-1 -ms-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Ajouter un groupes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/*  stats section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Aperçu</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#f8f9fa] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold mb-2">{stats.total}</div>
                <div className="text-gray-500 text-[0.9rem]">
                  Tâches totales
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold mb-2">{stats.completed}</div>
                <div className="text-gray-500 text-[0.9rem]">Terminées</div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold mb-2">{stats.overdue}</div>
                <div className="text-gray-500 text-[0.9rem]">En retard</div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold mb-2">{stats.today}</div>
                <div className="text-gray-500 text-[0.9rem]">
                  À faire aujourd'hui
                </div>
              </div>
            </div>
          </section>
          {/*  stats section end*/}
          {/* Affichage des groupes et tâches */}
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(27rem,1fr))] gap-6 mb-8">
            {displayGroup != null ? (
              filteredGroups
                .filter((group) => group.id === displayGroup)
                .map((group) => (
                  <DisplayTaskGroup
                    key={group.id}
                    idDuGroup={group.id}
                    groups={filteredGroups}
                    setGroups={setGroups}
                    fetchStatsData={fetchStatsData}
                  />
                ))
            ) : (
              <DisplayAllGroup
                groups={filteredGroups}
                setGroups={setGroups}
                fetchStatsData={fetchStatsData}
              />
            )}
          </div>
        </div>

        <footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-0">
          <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2025{" "}
              <a
                href="https://github.com/ALIGregoire"
                target="_blank"
                className="hover:underline"
              >
                ALIGregoire
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
