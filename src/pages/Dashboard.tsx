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
import { supabase } from "@/lib/supabase";

interface Exercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutHistory {
  id: string;
  user_id: string;
  workout_id: string;
  workout_name: string;
  executed_at: string;
  exercises: Exercise[];
  notes: string | null;
  feedback: string | null;
}

// Tipo para próximos treinos
interface UpcomingWorkout {
  workout_name: string;
  date?: string;
  exercises?: Exercise[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<WorkoutHistory[]>([]);

  useEffect(() => {
    document.title = "Dashboard | KangoFit";
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          setWorkouts([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("workout_history")
          .select("*")
          .eq("user_id", user.id)
          .order('executed_at', { ascending: false });
        if (error || !data) {
          setWorkouts([]);
        } else {
          setWorkouts(data as WorkoutHistory[]);
        }
      } catch (err) {
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  // Buscar o feedback do último treino concluído diretamente da tabela completed_workouts
  const [ultimoFeedback, setUltimoFeedback] = useState<string | null>(null);
  useEffect(() => {
    const fetchUltimoFeedback = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from("completed_workouts")
          .select("feedback_message, date, completed")
          .eq("user_id", user.id)
          .eq("completed", true)
          .order("date", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Erro ao buscar feedback:", error);
          return;
        }

        if (data && data.length > 0) {
          setUltimoFeedback(data[0].feedback_message);
        }
      } catch (err) {
        console.error("Erro ao buscar feedback:", err);
      }
    };
    fetchUltimoFeedback();
  }, []);

  // Estatísticas
  const totalTreinos = workouts.length;
  const totalMinutos = workouts.reduce((acc, w) => {
    if (Array.isArray(w.exercises)) {
      const totalSets = w.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
      return acc + totalSets * 2;
    }
    return acc;
  }, 0);
  const totalHoras = (totalMinutos / 60).toFixed(1);

  // Treinos do mês
  const now = new Date();
  const treinosMes = workouts.filter(w => {
    const d = w.executed_at ? new Date(w.executed_at) : null;
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Tempo da semana
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const tempoSemana = workouts.reduce((acc, w) => {
    const d = w.executed_at ? new Date(w.executed_at) : null;
    if (d && d >= startOfWeek) {
      if (Array.isArray(w.exercises)) {
        const totalSets = w.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
        return acc + totalSets * 2;
      }
    }
    return acc;
  }, 0);
  const tempoSemanaHoras = (tempoSemana / 60).toFixed(1);

  // Dados para o gráfico (tempo por dia da semana)
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const dataGrafico = dias.map((dia, idx) => {
    const minutos = workouts.filter(w => {
      const d = w.executed_at ? new Date(w.executed_at) : null;
      return d && d.getDay() === idx;
    }).reduce((acc, w) => {
      if (Array.isArray(w.exercises)) {
        const totalSets = w.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
        return acc + totalSets * 2;
      }
      return acc;
    }, 0);
    return { name: dia, tempo: minutos };
  });

  // Buscar próximos treinos (ainda não executados)
  const [proximosTreinos, setProximosTreinos] = useState<UpcomingWorkout[]>([]);
  useEffect(() => {
    const fetchProximosTreinos = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;
        const { data, error } = await supabase
          .from("completed_workouts")
          .select("*")
          .eq("user_id", user.id)
          .eq("completed", false)
          .order("date", { ascending: true });
        if (error) {
          console.error("Erro ao buscar próximos treinos:", error);
          setProximosTreinos([]);
        } else {
          setProximosTreinos(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar próximos treinos:", err);
        setProximosTreinos([]);
      }
    };
    fetchProximosTreinos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Dashboard" />
      
      <main className="flex-1 p-4 md:p-6 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard 
            title="Total de Treinos" 
            value={loading ? "..." : totalTreinos.toString()} 
            description={`${treinosMes} treinos este mês`}
          />
          <StatsCard 
            title="Tempo Total" 
            value={loading ? "..." : `${totalHoras}h`} 
            description={`${tempoSemanaHoras}h na última semana`}
          />
          <StatsCard 
            title="Nível de Progresso" 
            value={totalTreinos < 10 ? "Iniciante" : totalTreinos < 30 ? "Intermediário" : "Avançado"} 
            description={`Próximo nível: ${totalTreinos < 10 ? 10 - totalTreinos : totalTreinos < 30 ? 30 - totalTreinos : 0} treinos`}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <WorkoutChart data={dataGrafico} />
          <UpcomingWorkoutsCard workouts={proximosTreinos} />
        </div>
        
        <div className="border rounded-lg p-12">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 justify-start w-full">
              <KangooMascot message={ultimoFeedback || "Finalize um treino para receber feedback do agente IA!"} />  
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
