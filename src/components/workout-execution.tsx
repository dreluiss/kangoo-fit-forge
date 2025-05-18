import React, { useState, useEffect, useCallback } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight,
  Check,
  Flag,
  Pause,
  Play,
  Timer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkoutExercise } from "./exercise-components";
import { KangooMascot } from "./kangoo-mascot";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Frases motivacionais para o Kangoo exibir durante o treino
const motivationalPhrases = [
  "Você está arrasando! Continue assim!",
  "Mais uma série concluída! Seu esforço está valendo a pena!",
  "Incrível! Seu progresso é inspirador!",
  "Não desista, você está cada vez mais forte!",
  "Sua determinação é admirável! Continue se superando!",
  "Parabéns pelo seu desempenho! Você é capaz de muito mais!",
  "Cada repetição te aproxima dos seus objetivos!",
  "Sua disciplina é o que te diferencia! Continue firme!",
  "Excelente trabalho! Seu corpo agradece pelo esforço!",
  "Vamos lá! Você está prestes a superar seus limites!"
];

interface WorkoutExecutionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: WorkoutExercise[];
  workoutName: string;
  onComplete: (notes: string, n8nFeedback?: any) => void;
}

async function sendToN8n(userId: string, exercises: WorkoutExercise[]) {
  const webhookUrl = "https://drelui.app.n8n.cloud/webhook-test/kangofit-gerar-plano";
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      exercises,
    }),
  });
  if (!response.ok) throw new Error("Erro ao comunicar com o n8n");
  return response.json();
}

// Função para salvar o treino no Supabase SEM autenticação
const saveWorkoutToSupabase = async ({
  workoutId,
  workoutName,
  exercises
}: {
  workoutId: string;
  workoutName: string;
  exercises: WorkoutExercise[];
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  const userId = user.id;

  console.log({
    workout_id: workoutId,
    workout_name: workoutName,
    user_id: userId,
    exercise_count: exercises.length
  });

  // 1. Salva o treino finalizado
  const { data, error } = await supabase
    .from("completed_workouts")
    .insert([{
      workout_id: workoutId,
      workout_name: workoutName,
      user_id: userId,
      exercise_count: exercises.length
    }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Erro ao salvar treino no Supabase");

  // 2. Salva os exercícios desse treino
  const exercisesToInsert = exercises.map(ex => ({
    completed_workout_id: data.id,
    exercise_id: ex.exerciseId,
    reps_per_set: ex.reps,
    sets: ex.sets,
    weight: ex.weight ?? null
  }));

  const { error: exercisesError } = await supabase
    .from("completed_workout_exercises")
    .insert(exercisesToInsert);

  if (exercisesError) throw exercisesError;

  return data;
};

// Cadastro
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    alert("Erro ao cadastrar: " + error.message);
  } else {
    alert("Cadastro realizado! Verifique seu e-mail.");
  }
};

// Login
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    alert("Erro ao logar: " + error.message);
  } else {
    alert("Login realizado!");
  }
};

export function WorkoutExecution({
  open,
  onOpenChange,
  exercises,
  workoutName,
  onComplete
}: WorkoutExecutionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [notes, setNotes] = useState("");
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  
  const { toast } = useToast();
  const currentExercise = exercises[currentExerciseIndex];
  
  // Selecionar uma frase motivacional aleatória
  const getRandomMotivationalPhrase = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    return motivationalPhrases[randomIndex];
  }, []);
  
  // Iniciar contador de descanso
  useEffect(() => {
    let timer: number | undefined;
    
    if (isResting && !isPaused && restTimeRemaining > 0) {
      timer = window.setInterval(() => {
        setRestTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimeRemaining === 0) {
      setIsResting(false);
      setRestTimeRemaining(60);
      setMotivationalPhrase(getRandomMotivationalPhrase());
      
      toast({
        title: "Descanso concluído!",
        description: "Hora de iniciar a próxima série.",
      });
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isResting, isPaused, restTimeRemaining, toast, getRandomMotivationalPhrase]);
  
  useEffect(() => {
    // Resetar o estado ao abrir o modal
    if (open) {
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setIsResting(false);
      setRestTimeRemaining(60);
      setIsPaused(false);
      setIsWorkoutComplete(false);
      setNotes("");
      setMotivationalPhrase(getRandomMotivationalPhrase());
    }
  }, [open, getRandomMotivationalPhrase]);
  
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Usuário autenticado Supabase:", user);
    }
    checkUser();
  }, []);
  
  const handleCompleteSet = () => {
    if (currentSet < currentExercise.sets) {
      // Ainda tem mais séries para fazer neste exercício
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      toast({
        title: "Série concluída!",
        description: `Descanse por 60 segundos antes da próxima série.`,
      });
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Exercício concluído, mas ainda tem mais exercícios
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setMotivationalPhrase(getRandomMotivationalPhrase());
      toast({
        title: "Exercício concluído!",
        description: "Vamos para o próximo exercício.",
      });
    } else {
      // Todos os exercícios concluídos
      setIsWorkoutComplete(true);
      toast({
        title: "Treino completo!",
        description: "Parabéns, você completou todo o treino!",
      });
    }
  };
  
  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const handleFinishWorkout = async () => {
    try {
      await saveWorkoutToSupabase({
        workoutId: Math.random().toString(36).substr(2, 9),
        workoutName,
        exercises
      });
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || '';
      const n8nResponse = await sendToN8n(userId, exercises);

      // Passe o feedback do n8n para o onComplete
      onComplete(notes, n8nResponse);

      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Erro ao comunicar com IA",
        description: String(err),
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const renderExerciseContent = () => {
    if (isWorkoutComplete) {
      return (
        <div className="flex flex-col gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Treino Concluído! 🎉</h3>
            <p>Você completou todos os exercícios do treino.</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <KangooMascot message="Excelente trabalho! Seu comprometimento é inspirador. Como foi seu treino hoje?" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Observações sobre o treino
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Como você se sentiu? Precisou ajustar as cargas? Teve dificuldades?"
              className="h-32"
            />
          </div>
          
          <Button onClick={handleFinishWorkout} size="lg" className="w-full">
            Finalizar e Salvar Treino <Flag className="ml-2" />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Progress bar do treino */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso do treino</span>
            <span>{currentExerciseIndex + 1}/{exercises.length} exercícios</span>
          </div>
          <Progress 
            value={(currentExerciseIndex / exercises.length) * 100} 
            className="h-2"
          />
        </div>
        
        {/* Informações do exercício atual */}
        <div className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">{currentExercise.exerciseName}</h3>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div>Série {currentSet}/{currentExercise.sets}</div>
            <div>{currentExercise.reps} repetições</div>
            {currentExercise.weight ? (
              <div>{currentExercise.weight} kg</div>
            ) : null}
          </div>
        </div>
        
        {isResting ? (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium">Tempo de Descanso</h4>
              <div className="text-3xl font-bold my-4">{formatTime(restTimeRemaining)}</div>
              <Progress 
                value={(restTimeRemaining / 60) * 100} 
                className="h-2 mt-2"
              />
            </div>
            
            <Button
              onClick={handleTogglePause}
              variant="outline"
              className="w-full"
            >
              {isPaused ? (
                <>
                  <Play className="mr-2" /> Retomar
                </>
              ) : (
                <>
                  <Pause className="mr-2" /> Pausar
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                setIsResting(false);
                setRestTimeRemaining(60);
              }}
              variant="default"
              className="w-full"
            >
              Pular Descanso <ArrowRight className="ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {motivationalPhrase && (
              <div className="flex justify-center mb-4">
                <KangooMascot variant="small" message={motivationalPhrase} />
              </div>
            )}
            
            <Button
              onClick={handleCompleteSet}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {currentSet < currentExercise.sets ? (
                <>Concluir Série <Check className="ml-2" /></>
              ) : (
                <>Concluir Exercício <Check className="ml-2" /></>
              )}
            </Button>
          </div>
        )}
        
        {!isResting && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsWorkoutComplete(true)}
            >
              Finalizar Treino <Flag className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-md md:max-w-lg",
        isWorkoutComplete ? "sm:max-w-lg" : ""
      )}>
        <DialogHeader>
          <DialogTitle>
            {isWorkoutComplete ? "Treino Finalizado" : `${workoutName} - Execução`}
          </DialogTitle>
          <DialogDescription>
            {isWorkoutComplete
              ? "Parabéns por completar seu treino! Adicione suas observações abaixo."
              : `Execute cada exercício conforme instruções.`}
          </DialogDescription>
        </DialogHeader>
        
        {renderExerciseContent()}
      </DialogContent>
    </Dialog>
  );
}
