import { API_URL } from "./config";
import axios from "axios";
import api from "./axiosConfig";

export async function getProfile() {
  try {
    const response = await api.get("/auth/profile");
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de la recuperation du profile";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function getStats() {
  try {
    const response = await api.get("/stats/tasks");
    return response;
  } catch (error) {
    if (error.response) {
      return (
        error.response || "Erreur lors de la recuperation des statistiques"
      );
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function getGroups() {
  try {
    const response = await api.get("/groups");
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de la recuperation des Groupes";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function getTasks(id) {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de la recuperation des Taches";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function addGroup(groupData) {
  try {
    const response = await api.post("/groups/", {
      name: groupData.name,
      color: groupData.color,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return (
        error.response || "Erreur lors de la recuperation des statistiques"
      );
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function addTask(groupId, taskData) {
  try {
    const response = await api.post("/tasks/", {
      name: taskData.name,
      status: taskData.status,
      date: taskData.date,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      priority: taskData.priority,
      groupId: groupId,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return (
        error.response || "Erreur lors de la recuperation des statistiques"
      );
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function UpdateTask(taskId, taskUpdate) {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskUpdate);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de ...";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function DeleteTask(taskId) {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de ...";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function CompletionTask(taskId) {
  try {
    const response = await api.put(`/tasks/${taskId}/complete`);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de ...";
    } else {
      return "Erreur du serveur";
    }
  }
}

export async function DeleteGroup(groupId) {
  try {
    const response = await api.delete(`/groups/${groupId}`);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response || "Erreur lors de ...";
    } else {
      return "Erreur du serveur";
    }
  }
}
