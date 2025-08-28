import { prisma } from "../config/api.js";

// Créer un groupe
export const createGroup = async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }
    const group = await prisma.group.create({
      data: {
        name,
        color: color || "#4361ee",
        userId,
      },
    });

    res.status(201).json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du groupe",
    });
  }
};

// Récupérer tous les groupes d'un utilisateur
export const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await prisma.group.findMany({
      where: { userId },
      include: {
        tasks: true,
      },
    });

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des groupes",
    });
  }
};

// Mettre à jour un groupe
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier que le groupe appartient à l'utilisateur
    const group = await prisma.group.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Groupe non trouvé",
      });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: { name, color },
    });

    res.status(200).json({
      success: true,
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du groupe:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du groupe",
    });
  }
};

// Supprimer un groupe
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que le groupe appartient à l'utilisateur
    const group = await prisma.group.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Groupe non trouvé",
      });
    }

    // Supprimer toutes les tâches du groupe d'abord
    await prisma.task.deleteMany({
      where: { groupId: parseInt(id) },
    });

    // Puis supprimer le groupe
    await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Groupe et ses tâches supprimés avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du groupe:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du groupe",
    });
  }
};
