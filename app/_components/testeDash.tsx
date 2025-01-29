"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [dados, setDados] = useState({
    totalEquipamentos: 0,
    equipamentosEmUso: 0,
    equipamentosEmEstoque: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Equipamentos",
        data: [5000, 2500, 2700, 5800, 4500, 3900, 1800, 3200, 2500, 4300, 4900, 4200],
        backgroundColor: "#A3E635",
      },
    ],
  };

  const pieData = {
    labels: ["Em Uso", "Em Estoque"],
    datasets: [
      {
        data: [dados.equipamentosEmUso, dados.equipamentosEmEstoque],
        backgroundColor: ["#3B82F6", "#22C55E"],
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-md font-bold text-center md:text-left">Dashboard de Equipamentos</h1>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-md">Total de Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-md font-bold">{dados.totalEquipamentos}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-md">Equipamentos em Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-md font-bold">{dados.equipamentosEmUso}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-md">Equipamentos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-md font-bold">{dados.equipamentosEmEstoque}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="h-64 md:h-80">
              <Bar data={barData} />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Distribuição de Equipamentos</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="w-48 h-48 md:w-64 md:h-64">
              <Pie data={pieData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
