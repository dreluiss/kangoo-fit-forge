
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { 
  Exercise, 
  WorkoutExercise, 
  WorkoutForm, 
  defaultExercises 
} from "@/components/exercise-components";
import { useToast } from "@/hooks/use-toast";

const CreateWorkout = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem("kangofit-exercises");
    return saved ? JSON.parse(saved) : defaultExercises;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Novo Treino | KangoFit";
  }, []);
  
  const handleSaveWorkout = (name: string, workoutExercises: WorkoutExercise[]) => {
    // Obter treinos existentes do localStorage
    const workoutsJSON = localStorage.getItem("kangofit-workouts");
    const existingWorkouts = workoutsJSON ? JSON.parse(workoutsJSON) : [];
    
    // Criar novo treino
    const newWorkout = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      exercises: workoutExercises,
      date: new Date(),
    };
    
    // Adicionar à lista e salvar
    const updatedWorkouts = [...existingWorkouts, newWorkout];
    localStorage.setItem("kangofit-workouts", JSON.stringify(updatedWorkouts));
    
    toast({
      title: "Treino criado com sucesso!",
      description: `O treino "${name}" foi adicionado à sua lista.`,
    });
    
    navigate("/workouts");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Criar Novo Treino" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="outline" onClick={() => navigate("/workouts")}>
              Voltar
            </Button>
            <h1 className="text-2xl font-bold ml-4">Novo Treino</h1>
          </div>
          
          <WorkoutForm 
            exercises={exercises} 
            onSaveWorkout={handleSaveWorkout} 
          />
        </div>
      </main>
    </div>
  );
};

export default CreateWorkout;
