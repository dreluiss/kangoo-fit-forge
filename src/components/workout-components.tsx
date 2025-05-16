
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dumbbell, Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { WorkoutExercise } from "./exercise-components";
import { Badge } from "@/components/ui/badge";

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  date: Date;
  completed?: boolean;
}

interface WorkoutListProps {
  workouts: Workout[];
  onViewWorkout: (workoutId: string) => void;
  onCreateWorkout: () => void;
}

export function WorkoutList({ workouts, onViewWorkout, onCreateWorkout }: WorkoutListProps) {
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
  onComplete: (workoutId: string) => void;
  onDelete: (workoutId: string) => void;
  onBack: () => void;
}

export function WorkoutDetail({ workout, onComplete, onDelete, onBack }: WorkoutDetailProps) {
  // Ensure the workout date is a Date object
  const workoutDate = workout.date instanceof Date ? workout.date : new Date(workout.date);
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const estimatedTime = totalSets * 2; // Estimativa simplificada: 2 minutos por série

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          Voltar
        </Button>
        
        <div className="flex gap-2 self-end sm:self-auto">
          {!workout.completed && (
            <Button 
              variant="default" 
              onClick={() => onComplete(workout.id)}
            >
              Marcar como concluído
            </Button>
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
        <Card className="bg-primary/5 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Treino concluído!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Parabéns por concluir este treino!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
