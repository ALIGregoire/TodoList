import { prisma } from "../config/api.js";
import { filterTasks } from "../utils/helpers.js";

// Créer une tâche
export const createTask = async (req, res) => {
  try {
    const { name, status, date, startTime, endTime, priority, groupId } =
      req.body;
    const userId = req.user.id;

    // Vérifier que le groupe appartient à l'utilisateur
    const group = await prisma.group.findFirst({
      where: { id: parseInt(groupId), userId },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Groupe non trouvé",
      });
    }

    // Vérifier que date est valide
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Date invalide",
      });
    }

    // Vérifier le format des heures (HH:MM)
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Heure de début ou de fin invalide (format HH:MM attendu)",
      });
    }

    // Construire les DateTime complets
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startDateTime = new Date(taskDate);
    startDateTime.setHours(startHour, startMin, 0, 0);
    const endDateTime = new Date(taskDate);
    endDateTime.setHours(endHour, endMin, 0, 0);

    // Vérifier que startTime < endTime
    if (startDateTime >= endDateTime) {
      return res.status(400).json({
        success: false,
        message: "L'heure de début doit être inférieure à l'heure de fin",
      });
    }

    // Vérifier que la tâche n'est pas dans le passé
    const now = new Date();
    if (endDateTime < now) {
      return res.status(400).json({
        success: false,
        message: "Impossible de créer une tâche dans le passé",
      });
    }

    // Créer la tâche
    const task = await prisma.task.create({
      data: {
        name,
        status: status || "en attente",
        date: taskDate,
        startTime,
        endTime,
        priority: priority || "medium",
        userId,
        groupId: parseInt(groupId),
      },
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la tâche",
    });
  }
};

// Récupérer toutes les tâches d'un utilisateur avec filtres
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    // Récupérer toutes les tâches de l'utilisateur
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    // Appliquer les filtres
    const filteredTasks = filterTasks(tasks, filters);

    res.status(200).json({
      success: true,
      tasks: filteredTasks,
      total: tasks.length,
      filteredTotal: filteredTasks.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des tâches",
    });
  }
};

// Récupérer une tâche par son ID
export const getTaskByGroupId = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await prisma.group.findFirst({
      where: { id: parseInt(id), userId },
      include: {
        tasks: {
          select: {
            id: true,
            name: true,
            date: true,
            startTime: true,
            endTime: true,
            priority: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tâche non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la tâche",
    });
  }
};

// Mettre à jour une tâche
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, date, startTime, endTime, priority, groupId } =
      req.body;
    const userId = req.user.id;

    // Vérifier que la tâche appartient à l'utilisateur
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tâche non trouvée",
      });
    }

    // Préparer les données à mettre à jour
    let taskDate = date ? new Date(date) : new Date(task.date);
    if (date && isNaN(taskDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Date invalide",
      });
    }

    // Vérifier si on met à jour les heures
    let startDateTime = null;
    let endDateTime = null;
    if (startTime && endTime) {
      const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
          success: false,
          message: "Heure de début ou de fin invalide (format HH:MM attendu)",
        });
      }

      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      startDateTime = new Date(taskDate);
      startDateTime.setHours(startHour, startMin, 0, 0);

      endDateTime = new Date(taskDate);
      endDateTime.setHours(endHour, endMin, 0, 0);

      if (startDateTime >= endDateTime) {
        return res.status(400).json({
          success: false,
          message: "L'heure de début doit être inférieure à l'heure de fin",
        });
      }

      // Vérifier que la tâche n'est pas dans le passé
      const now = new Date();
      if (endDateTime < now) {
        return res.status(400).json({
          success: false,
          message: "Impossible de mettre la tâche à une date passée",
        });
      }
    }

    // Effectuer la mise à jour
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? task.name,
        status: status ?? task.status,
        date: date ? taskDate : task.date,
        startTime: startTime ?? task.startTime,
        endTime: endTime ?? task.endTime,
        priority: priority ?? task.priority,
        groupId: groupId ? parseInt(groupId) : task.groupId,
      },
    });

    res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la tâche",
    });
  }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que la tâche appartient à l'utilisateur
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tâche non trouvée",
      });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Tâche supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la tâche",
    });
  }
};

// Cocher une tâche comme terminée
export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que la tâche appartient à l'utilisateur
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tâche non trouvée",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status: "Terminée" },
    });

    res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Erreur lors du marquage de la tâche comme terminée:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du marquage de la tâche comme terminée",
    });
  }
};
