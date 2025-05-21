import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dumbbell, Calendar as CalendarIcon, Clock, ArrowRight, Play } from "lucide-react";
import { WorkoutExercise } from "./exercise-components";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { WorkoutExecution } from "./workout-execution";
import { KangooMascot } from "@/components/kangoo-mascot";
import { supabase } from "@/lib/supabase";
import { sendWorkoutMessage } from "@/lib/n8n-message";

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  date: Date;
  completed?: boolean;
  notes?: string;
  executionDate?: Date;
  executiondate?: Date;
  feedback_message?: string;
  feedback_suggestions?: string[];
  next_workout_focus?: string;
  next_workout_recommendations?: string[];
}

interface WorkoutListProps {
  workouts: Workout[];
  onViewWorkout: (workoutId: string) => void;
  onCreateWorkout: () => void;
}

export function WorkoutList({ workouts, onViewWorkout, onCreateWorkout }: WorkoutListProps) {
  console.log("workouts recebidos na Dashboard:", workouts);
  // Ensure all workout dates are Date objects before sorting
  const sortedWorkouts = [...workouts]
    .map(workout => ({
      ...workout,
      // Ensure date is a proper Date object
      date: workout.date instanceof Date ? workout.date : new Date(workout.date)
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Meus Treinos</h2>
        <Button onClick={onCreateWorkout}>Criar Treino</Button>
      </div>
      
      {sortedWorkouts.length === 0 ? (
        <div className="text-center py-8">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-medium text-lg">Nenhum treino cadastrado</h3>
          <p className="text-muted-foreground mb-6">Comece criando seu primeiro treino!</p>
          <Button onClick={onCreateWorkout}>Criar Treino</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedWorkouts.map((workout) => (
            <Card key={workout.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{workout.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(new Date(workout.date), "dd 'de' MMMM", { locale: pt })}
                    </CardDescription>
                  </div>
                  {workout.completed && (
                    <Badge variant="secondary">Concluído</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">
                    {workout.exercises.length} exercícios
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    {workout.exercises.slice(0, 3).map((ex, i) => (
                      <li key={i} className="text-sm truncate">
                        {ex.exerciseName} ({ex.sets}×{ex.reps})
                      </li>
                    ))}
                    {workout.exercises.length > 3 && (
                      <li className="text-muted-foreground">
                        +{workout.exercises.length - 3} mais...
                      </li>
                    )}
                  </ul>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-between"
                    onClick={() => onViewWorkout(workout.id)}
                  >
                    Ver detalhes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface WorkoutSchedulerProps {
  workouts: Workout[];
  onDateSelected: (date: Date) => void;
}

export function WorkoutScheduler({ workouts, onDateSelected }: WorkoutSchedulerProps) {
  // Function to convert workout dates to string format for showing dots in calendar
  const workoutDates = workouts.reduce((acc: Record<string, number>, workout) => {
    try {
      // Ensure the date is a valid Date object before formatting
      const date = workout.date instanceof Date ? workout.date : new Date(workout.date);
      if (isNaN(date.getTime())) {
        console.error("Invalid date found in workout:", workout);
        return acc;
      }
      const dateStr = format(date, "yyyy-MM-dd");
      acc[dateStr] = (acc[dateStr] || 0) + 1;
    } catch (error) {
      console.error("Error processing workout date:", error, workout);
    }
    return acc;
  }, {});
  
  // Custom render function for calendar day
  const renderDay = (day: any) => {
    try {
      // Validate that the day is a valid date
      if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
        return <div className="relative h-9 w-9 p-0 flex items-center justify-center">-</div>;
      }
      
      const dateStr = format(day, "yyyy-MM-dd");
      const count = workoutDates[dateStr] || 0;
      
      return (
        <div className="relative h-9 w-9 p-0 flex items-center justify-center">
          {format(day, "d")}
          {count > 0 && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </div>
      );
    } catch (error) {
      console.error("Error rendering day:", error, day);
      return <div className="relative h-9 w-9 p-0 flex items-center justify-center">-</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Treinos</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          onSelect={onDateSelected}
          locale={pt}
          components={{
            Day: renderDay,
          }}
          className="rounded-md border pointer-events-auto"
        />
      </CardContent>
    </Card>
  );
}

interface WorkoutDetailProps {
  workout: Workout;
  onComplete: (workoutId: string, notes?: string) => void;
  onDelete: (workoutId: string) => void;
  onBack: () => void;
}

export function WorkoutDetail({ workout, onComplete, onDelete, onBack }: WorkoutDetailProps) {
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  // Ensure the workout date is a Date object
  const workoutDate = workout.date instanceof Date ? workout.date : new Date(workout.date);
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const estimatedTime = totalSets * 2; // Estimativa simplificada: 2 minutos por série

  const handleExecutionComplete = async (notes: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) throw new Error("Usuário não autenticado");

    // Busque o nome do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('user_id', user.id)
      .single();
    const userName = profile?.name || user.email || 'Usuário';

    // Monte o JSON para o n8n
    const message = {
      type: 'workout_completed' as const,
      data: {
        userId: user.id,
        userName, // agora é o nome real, não o e-mail
        workoutId: workout.id,
        workoutName: workout.name,
        exercises: workout.exercises,
        completedAt: new Date().toISOString(),
      }
    };

    const n8nFeedback = await sendWorkoutMessage(message);

    onComplete(workout.id, notes);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          Voltar
        </Button>
        
        <div className="flex gap-2 self-end sm:self-auto">
          {!workout.completed && (
            <>
              <Button 
                variant="default" 
                onClick={() => setIsExecutionModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" /> Iniciar Treino
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onComplete(workout.id)}
              >
                Marcar como concluído
              </Button>
            </>
          )}
          <Button 
            variant="destructive" 
            onClick={() => onDelete(workout.id)}
          >
            Excluir
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(workoutDate, "dd 'de' MMMM, yyyy", { locale: pt })}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            ~{estimatedTime} min
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exercícios</CardTitle>
          <CardDescription>
            {workout.exercises.length} exercícios · {totalSets} séries no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workout.exercises.map((ex, i) => (
              <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{ex.exerciseName}</h4>
                  <Badge variant="outline">
                    {ex.sets} × {ex.reps}
                  </Badge>
                </div>
                {ex.weight ? (
                  <p className="text-muted-foreground text-sm">Carga: {ex.weight} kg</p>
                ) : (
                  <p className="text-muted-foreground text-sm">Sem carga</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {workout.completed && (
        <Card className="border-2 border-cyan-400 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <KangooMascot variant="small" />
            <div>
              <CardTitle className="text-lg">Feedback do Agente IA</CardTitle>
              {workout.executionDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Concluído em: {format(new Date(workout.executionDate), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base mb-2">{workout.feedback_message}</p>
            {workout.feedback_suggestions && workout.feedback_suggestions.length > 0 && (
              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Sugestões:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {workout.feedback_suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {workout.next_workout_focus && (
              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Próximo Treino:</h5>
                <p className="text-sm mb-1">Foco: {workout.next_workout_focus}</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {(workout.next_workout_recommendations || []).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <WorkoutExecution 
        open={isExecutionModalOpen}
        onOpenChange={setIsExecutionModalOpen}
        exercises={workout.exercises}
        workoutName={workout.name}
        workoutId={workout.id}
        onComplete={handleExecutionComplete}
      />
    </div>
  );
}

const { data, error } = await supabase
  .from('completed_workouts')
  .select('id, name, exercises, date, completed, feedback_message');

console.log("Dados recebidos do Supabase:", data, error);

