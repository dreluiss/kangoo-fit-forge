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
import { supabase } from "@/lib/supabase";
import { sendWorkoutMessage } from "@/lib/n8n-message";

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
  
  const handleSaveWorkout = async (name: string, workoutExercises: WorkoutExercise[]) => {
    // Buscar usuário autenticado
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      toast({
        title: "Erro ao criar treino!",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. Cria o treino no Supabase
      const { data, error } = await supabase
        .from("completed_workouts")
        .insert([{
          workout_id: crypto.randomUUID(),
          workout_name: name,
          exercises: workoutExercises,
          date: new Date().toISOString(),
          user_id: user.id,
          completed: false,
          exercise_count: workoutExercises.length
        }])
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Erro ao criar treino");
      }

      toast({
        title: "Treino criado!",
        description: "Seu treino foi salvo com sucesso.",
      });

      navigate("/workouts");
    } catch (err) {
      console.error("Erro ao criar treino:", err);
      toast({
        title: "Erro ao criar treino!",
        description: String(err),
        variant: "destructive"
      });
    }
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
