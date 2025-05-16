
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { KangooMascot } from "@/components/kangoo-mascot";
import { 
  StatsCard, 
  WorkoutChart, 
  UpcomingWorkoutsCard 
} from "@/components/dashboard-stats";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Dashboard | KangoFit";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Dashboard" />
      
      <main className="flex-1 p-4 md:p-6 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard 
            title="Total de Treinos" 
            value="24" 
            description="8 treinos este mês"
          />
          <StatsCard 
            title="Tempo Total" 
            value="32h" 
            description="5h na última semana"
          />
          <StatsCard 
            title="Nível de Progresso" 
            value="Intermediário" 
            description="Próximo nível: 10 treinos"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <WorkoutChart />
          <UpcomingWorkoutsCard />
        </div>
        
        <div className="border rounded-lg p-12">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex items-center gap-12">
              <KangooMascot />  
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
