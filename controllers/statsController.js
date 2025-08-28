import { prisma } from "../config/api.js";
import { calculateTaskStats } from "../utils/helpers.js";

// Récupérer les statistiques des tâches
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer toutes les tâches de l'utilisateur
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    // Calculer les statistiques générales
    const stats = calculateTaskStats(tasks);

    // Calculer la progression des tâches complétées par jour
    const progressionMap = {};

    tasks.forEach((task) => {
      if (task.status === "completed") {
        const date = task.updatedAt.toISOString().split("T")[0]; // YYYY-MM-DD
        progressionMap[date] = (progressionMap[date] || 0) + 1;
      }
    });

    const progression = Object.entries(progressionMap)
      .map(([date, completed]) => ({ date, completed }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      stats: { ...stats, progression },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

// Récupérer les statistiques par groupe
export const getGroupStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer tous les groupes avec leurs tâches
    const groups = await prisma.group.findMany({
      where: { userId },
      include: {
        tasks: true,
      },
    });

    // Calculer les statistiques pour chaque groupe
    const groupStats = groups.map((group) => ({
      id: group.id,
      name: group.name,
      color: group.color,
      stats: calculateTaskStats(group.tasks),
    }));

    res.status(200).json({
      success: true,
      groups: groupStats,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques par groupe:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques par groupe",
    });
  }
};
