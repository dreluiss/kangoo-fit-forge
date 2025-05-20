import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { WorkoutList, WorkoutDetail, Workout } from "@/components/workout-components";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { sendWorkoutMessage, type WorkoutFeedback, type WorkoutMessage } from "@/lib/n8n-message";

// Mock de dados para treinos
const initialWorkouts: Workout[] = [
  {
    id: "1",
    name: "Treino de Pernas",
    date: new Date(2025, 4, 15),
    exercises: [
      { exerciseId: "1", exerciseName: "Agachamento", sets: 4, reps: 12 },
      { exerciseId: "3", exerciseName: "Leg Press", sets: 3, reps: 15, weight: 80 },
      { exerciseId: "4", exerciseName: "Extensora", sets: 3, reps: 12, weight: 30 },
    ],
    completed: true,
  },
  {
    id: "2",
    name: "Treino de Peito e Braços",
    date: new Date(2025, 4, 17),
    exercises: [
      { exerciseId: "2", exerciseName: "Supino", sets: 4, reps: 10, weight: 50 },
      { exerciseId: "6", exerciseName: "Bíceps com halteres", sets: 3, reps: 12, weight: 10 },
      { exerciseId: "7", exerciseName: "Tríceps na polia", sets: 3, reps: 15, weight: 25 },
    ],
  },
];

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("completed_workouts")
        .select("*")
        .order('date', { ascending: false });

      if (error) {
        console.error("Erro ao buscar treinos:", error);
        setWorkouts([]);
        return;
      }

      if (!data) {
        setWorkouts([]);
        return;
      }

      const formattedWorkouts = data.map((w: any) => ({
        id: w.workout_id || w.id,
        name: w.workout_name || w.name,
        exercises: w.exercises || [],
        date: w.date ? new Date(w.date) : new Date(),
        completed: w.completed || false,
        notes: w.notes,
        executionDate: w.executiondate ? new Date(w.executiondate) : undefined,
        feedback_message: w.feedback_message,
        feedback_suggestions: w.feedback_suggestions,
        next_workout_focus: w.next_workout_focus,
        next_workout_recommendations: w.next_workout_recommendations
      }));

      setWorkouts(formattedWorkouts);
    } catch (err) {
      console.error("Erro ao buscar treinos:", err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    document.title = workoutId 
      ? "Detalhes do Treino | KangoFit" 
      : "Meus Treinos | KangoFit";
  }, [workoutId]);

  const handleViewWorkout = (id: string) => {
    navigate(`/workouts/${id}`);
  };

  const handleCreateWorkout = () => {
    navigate("/workouts/new");
  };
  
  const handleCompleteWorkout = async (workoutId: string, notes?: string) => {
    // 1. Buscar o treino atual
    const { data: workout, error: fetchError } = await supabase
      .from("completed_workouts")
      .select("*")
      .eq("workout_id", workoutId)
      .single();

    if (fetchError || !workout) {
      toast({
        title: "Erro ao buscar treino",
        description: fetchError?.message || "Treino não encontrado.",
        variant: "destructive"
      });
      return;
    }

    // 2. Montar mensagem para o n8n
    const message: WorkoutMessage = {
      type: 'workout_completed',
      data: {
        userId: workout.user_id,
        userName: '', // Se tiver nome/email, preencha aqui
        workoutId: workout.workout_id,
        workoutName: workout.workout_name,
        exercises: workout.exercises,
        completedAt: new Date().toISOString(),
        notes: notes || ''
      }
    };

    // 3. Chamar o n8n para obter feedback
    let n8nFeedback: WorkoutFeedback | null = null;
    try {
      n8nFeedback = await sendWorkoutMessage(message);
      if (n8nFeedback && n8nFeedback.message) {
        // Limpa o texto entre <think> e </think>
        n8nFeedback.message = n8nFeedback.message.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      }
      console.log('Feedback recebido do n8n:', n8nFeedback);
    } catch (err) {
      n8nFeedback = null;
    }

    // 4. Atualizar o treino no Supabase com feedback
    const { error } = await supabase
      .from("completed_workouts")
      .update({
        completed: true,
        executiondate: new Date().toISOString(),
        notes: notes || null,
        feedback_message: n8nFeedback?.message || null,
        feedback_suggestions: n8nFeedback?.suggestions || null,
        next_workout_focus: n8nFeedback?.nextWorkout?.focus || null,
        next_workout_recommendations: n8nFeedback?.nextWorkout?.recommendations || null
      })
      .eq("workout_id", workoutId);

    if (error) {
      toast({
        title: "Erro ao marcar como concluído",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    await fetchWorkouts();
    toast({
      title: "Treino concluído!",
      description: "Parabéns por mais um treino finalizado!",
    });
  };
  
  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    navigate("/workouts");
    
    toast({
      title: "Treino excluído",
      description: "O treino foi removido com sucesso.",
    });
  };

  // Se temos um ID de treino, mostrar os detalhes daquele treino
  if (workoutId && workoutId !== "new") {
    const workout = workouts.find(w => w.id === workoutId);
    
    if (!workout) {
      return (
        <div className="flex flex-col min-h-screen">
          <AppHeader title="Treino não encontrado" />
          <main className="flex-1 p-4 md:p-6">
            <p>Este treino não foi encontrado.</p>
            <Button variant="link" onClick={() => navigate("/workouts")}>
              Voltar para meus treinos
            </Button>
          </main>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader title={workout.name} />
        <main className="flex-1 p-4 md:p-6">
          <WorkoutDetail 
            workout={workout} 
            onComplete={handleCompleteWorkout} 
            onDelete={handleDeleteWorkout}
            onBack={() => navigate("/workouts")}
          />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader title="Meus Treinos" />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <span>Carregando treinos...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Meus Treinos" />
      <main className="flex-1 p-4 md:p-6">
        <WorkoutList 
          workouts={workouts} 
          onViewWorkout={handleViewWorkout} 
          onCreateWorkout={handleCreateWorkout}
        />
      </main>
    </div>
  );
};

export default Workouts;
