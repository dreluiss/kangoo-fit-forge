
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { 
  Exercise, 
  ExerciseTable, 
  defaultExercises 
} from "@/components/exercise-components";
import { KangooMascot } from "@/components/kangoo-mascot";

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem("kangofit-exercises");
    return saved ? JSON.parse(saved) : defaultExercises;
  });
  
  useEffect(() => {
    document.title = "Exercícios | KangoFit";
  }, []);
  
  useEffect(() => {
    // Salvar exercícios no localStorage quando mudarem
    localStorage.setItem("kangofit-exercises", JSON.stringify(exercises));
  }, [exercises]);
  
  const handleAddExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
  };
  
  const handleEditExercise = (id: string, updatedExercise: Partial<Exercise>) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, ...updatedExercise } : ex))
    );
  };
  
  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Exercícios" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <ExerciseTable 
            exercises={exercises}
            onAddExercise={handleAddExercise}
            onEditExercise={handleEditExercise}
            onDeleteExercise={handleDeleteExercise}
          />
          
          <div className="mt-8 p-6 border rounded-lg">
            <div className="flex items-center gap-4">
              <KangooMascot variant="small" />
              <div>
                <h3 className="font-medium">Dica do Kangoo</h3>
                <p className="text-muted-foreground text-sm">
                  Adicione seus exercícios favoritos para montar treinos personalizados mais rápido!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Exercises;
