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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard de Equipamentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dados.totalEquipamentos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos em Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dados.equipamentosEmUso}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dados.equipamentosEmEstoque}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Equipamentos</CardTitle>
          </CardHeader>
          <CardContent className="w-[400px] h-[400px] flex justify-center items-center mx-auto">
            <Pie data={pieData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
