import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Workout } from "@/components/workout-components";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Clock, Dumbbell, Calendar as CalendarIcon, ArrowRight, MessageSquare, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KangooMascot } from "@/components/kangoo-mascot";
import { supabase } from "@/lib/supabase";

interface WorkoutHistoryListProps {
  workouts: Workout[];
}

export function WorkoutHistoryList({ workouts }: WorkoutHistoryListProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  // Sort workouts by execution date (most recent first)
  const sortedWorkouts = [...workouts]
    .filter(workout => workout.completed && workout.executiondate)
    .sort((a, b) => {
      const dateA = workout.executiondate ? new Date(workout.executiondate).getTime() : 0;
      const dateB = workout.executiondate ? new Date(workout.executiondate).getTime() : 0;
      return dateB - dateA;
    });

  if (sortedWorkouts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Dumbbell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum treino concluído</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Quando você concluir seus treinos, eles aparecerão aqui para que você possa acompanhar seu progresso.
        </p>
      </div>
    );
  }
  
  // Calculate workout duration in minutes (mock for now)
  const getWorkoutDuration = (workout: Workout): number => {
    // For now, estimate based on exercise count and sets
    const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets, 0);
    return totalSets * 2; // Estimate 2 minutes per set
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedWorkouts.map((workout) => (
          <Card key={workout.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {workout.executiondate ? 
                      format(new Date(workout.executiondate), "dd 'de' MMMM, yyyy", { locale: pt }) :
                      format(new Date(workout.date), "dd 'de' MMMM, yyyy", { locale: pt })}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Concluído
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getWorkoutDuration(workout)} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <span>{workout.exercises.length} exercícios</span>
                </div>
              </div>
              
              {workout.notes && (
                <div className="bg-muted/50 p-2 rounded-md mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Observações:</p>
                  <p className="text-sm line-clamp-2">{workout.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => setSelectedWorkout(workout)}
              >
                Ver detalhes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <WorkoutHistoryDetail 
        workout={selectedWorkout} 
        onClose={() => setSelectedWorkout(null)} 
        open={!!selectedWorkout} 
      />
    </>
  );
}

interface WorkoutHistoryDetailProps {
  workout: Workout | null;
  onClose: () => void;
  open: boolean;
}

export function WorkoutHistoryDetail({ workout, onClose, open }: WorkoutHistoryDetailProps) {
  if (!workout) return null;
  console.log("WorkoutHistoryDetail", workout)
  // Calculate workout duration in minutes (mock for now)
  const workoutDuration = workout.exercises.reduce((total, ex) => total + (ex.sets * 2), 0);
  
  // Get a random motivational feedback (mock AI feedback)
  const getAIFeedback = () => {
    const feedbacks = [
      "Excelente trabalho! Sua consistência está impressionante. Continue assim!",
      "Notei que você aumentou a carga nos exercícios. Isso é ótimo para o seu progresso muscular!",
      "Você está criando um excelente hábito de treino. Lembre-se de descansar adequadamente entre os treinos.",
      "Seu progresso está ótimo! Considere aumentar a carga em 5% no próximo treino de força.",
      "Continue com essa determinação! Você está no caminho certo para alcançar seus objetivos."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };
  
  const fetchUpdatedWorkout = async () => {
    const { data: updatedWorkout } = await supabase
      .from('completed_workouts')
      .select('*')
      .eq('id', workout.id)
      .single();
    // Use updatedWorkout to update the state
    // This is a placeholder and should be replaced with actual state update logic
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{workout.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{workout.executiondate ? 
                format(new Date(workout.executiondate), "dd/MM/yyyy 'às' HH:mm", { locale: pt }) :
                "Data não registrada"}</span>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{workoutDuration} minutos</span>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
              <span>{workout.exercises.length} exercícios</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-lg mb-4">Exercícios realizados</h3>
            <div className="space-y-4">
              {workout.exercises.map((ex, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{ex.exerciseName}</h4>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {ex.sets} × {ex.reps}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {ex.weight ? <p>Carga: {ex.weight} kg</p> : <p>Sem carga</p>}
                    <p>Tempo estimado: {ex.sets * 2} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {workout.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Suas observações
                </h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p>{workout.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
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
