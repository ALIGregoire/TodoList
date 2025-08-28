import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import {
  addTask,
  CompletionTask,
  DeleteGroup,
  DeleteTask,
  getGroups,
  UpdateTask,
} from "../services/dashboardService";
import { verifyToken } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

import "flowbite";

export default function DisplayTaskGroup({
  idDuGroup,
  groups,
  setGroups,
  fetchStatsData,
}) {
  const [group, setGroup] = useState(null);
  const [editingTask, setEditingTask] = useState({
    groupId: null,
    taskId: null,
  });
  const [taskEdit, setTaskEdit] = useState({});
  const [newTask, setNewTask] = useState({});
  const navigate = useNavigate();

  /** ---------- Vérification Token & Fetch Group ---------- **/
  useEffect(() => {
    if (!verifyToken()) {
      navigate("/login");
    }

    const fetchGroup = async () => {
      try {
        const response = await getGroups();
        const dataAllGroups = response.data;

        if (dataAllGroups.success) {
          const foundGroup = (dataAllGroups.groups || []).find(
            (g) => g.id === idDuGroup
          );
          setGroup(foundGroup || null);
          console.log("Récupération du groupe réussie");
        }
      } catch (error) {
        console.log("Erreur :", error);
      }
    };

    fetchGroup();
  }, [navigate, idDuGroup]);

  /** ---------- Modification tâche ---------- **/
  const HandleEditTask = (groupId, taskId, e) => {
    const { name, value } = e.target;
    setTaskEdit((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [name]: value,
      },
    }));
  };

  const HandleSubmitEditTask = async (groupId, taskId) => {
    const dataUpdate = taskEdit[taskId];
    if (!dataUpdate) return;

    try {
      const response = await UpdateTask(taskId, dataUpdate);
      const dataTaskUpdate = response.data;

      if (dataTaskUpdate.success) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          tasks: prevGroup.tasks.map((task) =>
            task.id === taskId ? { ...task, ...dataUpdate } : task
          ),
        }));

        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tasks: g.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...dataUpdate } : task
                  ),
                }
              : g
          )
        );

        setEditingTask({ groupId: null, taskId: null });
        if (fetchStatsData) await fetchStatsData();
        console.log("Modification réussie");
      }
    } catch (error) {
      console.log("Erreur lors de la mise à jour :", error);
    }
  };

  /** ---------- Suppression tâche ---------- **/
  const HandleDeleteTask = async (groupId, taskId) => {
    try {
      const response = await DeleteTask(taskId);
      const data = response.data;

      if (data.success) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          tasks: prevGroup.tasks.filter((task) => task.id !== taskId),
        }));

        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === groupId
              ? { ...g, tasks: g.tasks.filter((task) => task.id !== taskId) }
              : g
          )
        );

        if (fetchStatsData) await fetchStatsData();
        console.log("Suppression réussie");
      }
    } catch (error) {
      console.log("Erreur suppression :", error);
    }
  };

  /** ---------- Statut ---------- **/
  const toggleCompletionTask = async (groupId, taskId) => {
    try {
      const response = await CompletionTask(taskId);
      const data = response.data;

      if (data.success) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          tasks: prevGroup.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status:
                    task.status === "Terminée" ? "En attente" : "Terminée",
                }
              : task
          ),
        }));

        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tasks: g.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          status:
                            task.status === "Terminée"
                              ? "En attente"
                              : "Terminée",
                        }
                      : task
                  ),
                }
              : g
          )
        );

        if (fetchStatsData) fetchStatsData();
        console.log("Changement de statut réussi");
      }
    } catch (error) {
      console.error("Erreur lors de la complétion de la tâche:", error);
    }
  };

  /** ---------- Ajout tâche ---------- **/
  const HandleAddTask = (groupId, e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleSubmitAddTask = async (groupId) => {
    if (!newTask.name) return;

    try {
      const response = await addTask(groupId, newTask);
      const dataTaskAdd = response.data;

      if (dataTaskAdd.success) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          tasks: [...(prevGroup.tasks || []), dataTaskAdd.task],
        }));

        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === groupId
              ? { ...g, tasks: [...(g.tasks || []), dataTaskAdd.task] }
              : g
          )
        );

        console.log("Création de tâche réussie");

        setNewTask({
          name: "",
          date: "",
          startTime: "",
          endTime: "",
          priority: "",
        });
        if (fetchStatsData) await fetchStatsData();
      }
    } catch (error) {
      console.log("Erreur lors de la création de tâche :", error);
    }
  };

  /** ---------- Suppression groupe ---------- **/
  const HandleDeleteGroup = async (groupId) => {
    try {
      const response = await DeleteGroup(groupId);
      const data = response.data;

      if (data.success) {
        setGroup(null);
        setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
        console.log("Suppression groupe réussie");
      }
    } catch (error) {
      console.log("Erreur suppression :", error);
    }
  };

  /** ---------- Format date ---------- **/
  const formatDate = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  return (
    <>
      {!group ? (
        <div className="text-gray-500 text-[0.9rem] text-center my-4">
          Aucun groupe trouvé
        </div>
      ) : (
        <div
          key={group.id}
          className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-6"
        >
          {/* Header groupe */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="font-semibold text-gray-700 flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3 shadow-sm"
                style={{ backgroundColor: group?.color }}
              ></div>
              <span className="text-lg">{group?.name}</span>
            </div>
            <button
              type="button"
              onClick={() => HandleDeleteGroup(group.id)}
              className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1"
            >
              Delete
            </button>
          </div>

          {/* Liste des tâches */}
          <div className="px-6 py-2">
            {group?.tasks?.length === 0 ? (
              <div className="text-gray-500 text-[0.9rem] text-center my-4">
                Aucune tâche dans ce groupe
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                {group.tasks.map((task) => {
                  const isEditing =
                    editingTask.groupId === group.id &&
                    editingTask.taskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className="py-3 px-3 border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors duration-150"
                    >
                      {isEditing ? (
                        <div className="flex flex-col space-y-3 p-5">
                          <input
                            type="text"
                            name="name"
                            value={taskEdit[task.id]?.name ?? task.name ?? ""}
                            onChange={(e) =>
                              HandleEditTask(group.id, task.id, e)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="date"
                              name="date"
                              value={
                                taskEdit[task.id]?.date ??
                                formatDate(task.date) ??
                                ""
                              }
                              onChange={(e) =>
                                HandleEditTask(group.id, task.id, e)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <select
                              name="priority"
                              value={
                                taskEdit[task.id]?.priority ??
                                task.priority ??
                                ""
                              }
                              onChange={(e) =>
                                HandleEditTask(group.id, task.id, e)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="low">Faible</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Haute</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="time"
                              name="startTime"
                              value={
                                taskEdit[task.id]?.startTime ??
                                task.startTime ??
                                ""
                              }
                              onChange={(e) =>
                                HandleEditTask(group.id, task.id, e)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="time"
                              name="endTime"
                              value={
                                taskEdit[task.id]?.endTime ?? task.endTime ?? ""
                              }
                              onChange={(e) =>
                                HandleEditTask(group.id, task.id, e)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              type="button"
                              onClick={() =>
                                HandleSubmitEditTask(group.id, task.id)
                              }
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg"
                              onClick={() =>
                                setEditingTask({ groupId: null, taskId: null })
                              }
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.status === "Terminée"}
                            onChange={() =>
                              toggleCompletionTask(group.id, task.id)
                            }
                            className="mr-4 w-4 h-4 cursor-pointer"
                          />
                          <div
                            className={`flex-grow text-sm font-medium ${
                              task.status === "Terminée"
                                ? "text-gray-400 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {task.name}
                          </div>
                          <div className="flex items-center">
                            <div className="text-xs mr-3">
                              {formatDate(task.date)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-xs mr-3">
                              {task.startTime} - {task.endTime}
                            </div>
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTask({
                                    groupId: group.id,
                                    taskId: task.id,
                                  })
                                }
                              >
                                <FaPencilAlt size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  HandleDeleteTask(group.id, task.id)
                                }
                              >
                                <FaTrashAlt size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </form>
            )}

            {/* Ajout tâche */}
            <form
              className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200"
              onSubmit={(e) => {
                e.preventDefault();
                HandleSubmitAddTask(group.id);
              }}
            >
              <input
                type="text"
                placeholder="Nom de la tâche"
                name="name"
                value={newTask.name ?? ""}
                onChange={(e) => HandleAddTask(group.id, e)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
              />
              <input
                type="date"
                name="date"
                value={newTask.date ?? ""}
                onChange={(e) => HandleAddTask(group.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                required
              />
              <input
                type="time"
                name="startTime"
                value={newTask.startTime ?? ""}
                onChange={(e) => HandleAddTask(group.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                required
              />
              <input
                type="time"
                name="endTime"
                value={newTask.endTime ?? ""}
                onChange={(e) => HandleAddTask(group.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                required
              />
              <select
                name="priority"
                value={newTask.priority ?? ""}
                onChange={(e) => HandleAddTask(group.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
              >
                <option value="">Choisir priorité</option>
                <option value="low">Faible priorité</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Haute priorité</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2.5 w-full"
              >
                <FaPlus className="mr-2 inline" size={12} />
                Ajouter une tâche
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
