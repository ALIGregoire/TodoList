// Fonction pour calculer les statistiques des tâches
export const calculateTaskStats = (tasks) => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "Terminée").length,
    overdue: tasks.filter((task) => {
      // Construire la date de fin complète de la tâche
      const taskDate = new Date(task.date);
      const [endHour, endMin] = task.endTime.split(":").map(Number);
      const taskEnd = new Date(taskDate);
      taskEnd.setHours(endHour, endMin, 0, 0);

      return taskEnd < now && task.status !== "Terminée";
    }).length,
    today: tasks.filter((task) => {
      const taskDate = new Date(task.date);
      const [startHour, startMin] = task.startTime.split(":").map(Number);
      const [endHour, endMin] = task.endTime.split(":").map(Number);
      const taskStart = new Date(taskDate);
      taskStart.setHours(startHour, startMin, 0, 0);
      const taskEnd = new Date(taskDate);
      taskEnd.setHours(endHour, endMin, 0, 0);

      // La tâche est aujourd'hui si elle chevauche la journée actuelle
      return (
        taskEnd >= todayStart &&
        taskStart <= todayEnd &&
        task.status !== "Terminée"
      );
    }).length,
  };

  return stats;
};

// Fonction pour filtrer les tâches
export const filterTasks = (tasks, filters) => {
  let filteredTasks = [...tasks];

  if (filters.status) {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === filters.status
    );
  }

  if (filters.priority) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === filters.priority
    );
  }

  if (filters.groupId) {
    filteredTasks = filteredTasks.filter(
      (task) => task.groupId === parseInt(filters.groupId)
    );
  }

  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredTasks = filteredTasks.filter(
      (task) => new Date(task.startDate) >= startDate
    );
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredTasks = filteredTasks.filter(
      (task) => new Date(task.endDate) <= endDate
    );
  }

  return filteredTasks;
};
