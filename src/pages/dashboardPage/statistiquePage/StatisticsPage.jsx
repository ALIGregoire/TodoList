import React, { useEffect, useState } from "react";
import api from "../../../services/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatisticsPage = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [groupStats, setGroupStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const taskRes = await api.get("/stats/tasks"); // ton endpoint getTaskStats
        const groupRes = await api.get("/stats/groups"); // ton endpoint getGroupStats

        setTaskStats(taskRes.data.stats);
        setGroupStats(groupRes.data.groups);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">Chargement des statistiques...</div>
    );
  }

  // Préparer les données pour le BarChart
  const barData = taskStats
    ? Object.entries(taskStats).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  // Préparer les données pour le PieChart
  const pieData = groupStats.map((group) => ({
    name: group.name,
    value: group.stats.total || 0,
    color: group.color || COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Statistiques des Tâches
      </h1>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tâches par statut</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Répartition par groupe</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Résumé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-100 rounded p-4 text-center">
            <p className="text-lg font-bold">{taskStats?.total || 0}</p>
            <p>Total Tâches</p>
          </div>
          <div className="bg-green-100 rounded p-4 text-center">
            <p className="text-lg font-bold">{taskStats?.completed || 0}</p>
            <p>Complétées</p>
          </div>
          <div className="bg-yellow-100 rounded p-4 text-center">
            <p className="text-lg font-bold">{taskStats?.pending || 0}</p>
            <p>En attente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
