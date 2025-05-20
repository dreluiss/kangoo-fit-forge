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
import { sendWorkoutMessage, WorkoutFeedback } from "@/lib/n8n-message";

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
  onComplete: (notes: string, feedback: WorkoutFeedback) => void;
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
  const text = await response.text();
  if (!text) throw new Error("Resposta vazia do agente IA");
  return JSON.parse(text);
}

// Função para salvar o treino no Supabase SEM autenticação
const saveWorkoutToSupabase = async ({
  workoutId,
  workoutName,
  exercises,
  feedback
}: {
  workoutId: string;
  workoutName: string;
  exercises: WorkoutExercise[];
  feedback: WorkoutFeedback;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  const userId = user.id;

  // Salva o treino finalizado
  const { data, error } = await supabase
    .from("completed_workouts")
    .insert([{
      id: workoutId,
      name: workoutName,
      exercises: exercises,
      date: new Date().toISOString(),
      user_id: userId,
      feedback_message: feedback.message,
      feedback_suggestions: feedback.suggestions,
      next_workout_focus: feedback.nextWorkout?.focus,
      next_workout_recommendations: feedback.nextWorkout?.recommendations
    }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Erro ao salvar treino no Supabase");

  // Salva os exercícios desse treino (se necessário)
  // ...

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

function cleanFeedbackMessage(message: string): string {
  return message.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

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
  const [feedback, setFeedback] = useState<WorkoutFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error("Usuário não autenticado");

      const workoutId = crypto.randomUUID();
      const message = {
        type: 'workout_completed' as const,
        data: {
          userId: user.id,
          userName: user.email || 'Usuário',
          workoutId,
          workoutName,
          exercises,
          completedAt: new Date().toISOString(),
        }
      };

      // Send workout to n8n for feedback
      const n8nFeedback = await sendWorkoutMessage(message);
      if (!n8nFeedback) {
        throw new Error("Não foi possível obter feedback do treino");
      }

      // Clean and format feedback
      n8nFeedback.message = cleanFeedbackMessage(n8nFeedback.message);
      setFeedback(n8nFeedback);

      // Save workout to Supabase
      const { error: saveError } = await supabase
        .from("completed_workouts")
        .insert([{
          workout_id: workoutId,
          workout_name: workoutName || 'Treino sem nome',
          exercises: exercises,
          exercise_count: exercises.length,
          date: new Date().toISOString(),
          user_id: user.id,
          completed: true,
          feedback_message: n8nFeedback.message,
          feedback_suggestions: n8nFeedback.suggestions,
          next_workout_focus: n8nFeedback.nextWorkout?.focus,
          next_workout_recommendations: n8nFeedback.nextWorkout?.recommendations
        }]);

      if (saveError) {
        throw new Error(`Erro ao salvar treino: ${saveError.message}`);
      }

      setIsWorkoutComplete(true);
      toast({
        title: "Feedback recebido!",
        description: "Seu treino foi analisado com sucesso.",
      });

    } catch (err) {
      console.error("Erro ao finalizar treino:", err);
      toast({
        title: "Erro ao finalizar treino",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const renderExerciseContent = () => {
    // Exibe feedback do agente após finalizar
    if (isWorkoutComplete && feedback) {
      return (
        <div className="flex flex-col gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Treino Concluído! 🎉</h3>
            <p>Parabéns por concluir este treino!</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback do Agente IA</h4>
            <p className="text-sm mb-2">{feedback.message}</p>
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Sugestões:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.nextWorkout && (
              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Próximo Treino:</h5>
                <p className="text-sm mb-1">Foco: {feedback.nextWorkout.focus}</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {feedback.nextWorkout.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Exibe botão "Finalizar Treino" apenas quando todos os exercícios foram feitos
    if (isWorkoutComplete && !feedback) {
      return (
        <div className="flex flex-col gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">Treino Concluído! 🎉</h3>
            <p>Parabéns por concluir todo o treino!</p>
          </div>
          <Button
            onClick={handleFinishWorkout}
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processando feedback..." : "Finalizar Treino"}
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
