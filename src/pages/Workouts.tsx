
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { WorkoutList, WorkoutDetail, Workout } from "@/components/workout-components";
import { useToast } from "@/hooks/use-toast";

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
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("kangofit-workouts");
    return saved ? JSON.parse(saved) : initialWorkouts;
  });
  
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Salvar treinos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("kangofit-workouts", JSON.stringify(workouts));
  }, [workouts]);
  
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
  
  const handleCompleteWorkout = (workoutId: string) => {
    setWorkouts(prev => 
      prev.map(w => 
        w.id === workoutId ? { ...w, completed: true } : w
      )
    );
    
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
