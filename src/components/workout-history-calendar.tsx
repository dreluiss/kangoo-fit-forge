
import { useState, useMemo } from "react";
import { format, isSameDay, isValid } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Workout } from "@/components/workout-components";
import { Button } from "@/components/ui/button";
import { WorkoutHistoryDetail } from "@/components/workout-history-components";
import { CheckCircle, ArrowRight } from "lucide-react";
import { DayContent, DayProps } from "react-day-picker";

interface WorkoutHistoryCalendarProps {
  workouts: Workout[];
}

export function WorkoutHistoryCalendar({ workouts }: WorkoutHistoryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  // Filter completed workouts with valid execution dates
  const completedWorkouts = workouts.filter(workout => 
    workout.completed && 
    workout.executionDate && 
    isValid(new Date(workout.executionDate))
  );
  
  // Create a map of dates with workouts for rendering calendar dots
  const workoutsByDate = useMemo(() => {
    const dateMap: Record<string, Workout[]> = {};
    
    completedWorkouts.forEach(workout => {
      if (workout.executionDate) {
        const dateKey = format(new Date(workout.executionDate), "yyyy-MM-dd");
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = [];
        }
        dateMap[dateKey].push(workout);
      }
    });
    
    return dateMap;
  }, [completedWorkouts]);
  
  // Get workouts for the selected date
  const workoutsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return completedWorkouts.filter(workout => {
      if (!workout.executionDate) return false;
      const executionDate = new Date(workout.executionDate);
      return isSameDay(executionDate, selectedDate);
    });
  }, [selectedDate, completedWorkouts]);
  
  // Custom day render function to show dots for dates with workouts
  const renderDay = (props: DayProps) => {
    try {
      const { date } = props;
      
      // Validate that we have a valid date before proceeding
      if (!date || !isValid(date)) {
        return <DayContent {...props} />;
      }
      
      const dateKey = format(date, "yyyy-MM-dd");
      const hasWorkouts = workoutsByDate[dateKey] && workoutsByDate[dateKey].length > 0;
      
      return (
        <div className="relative h-9 w-9 p-0 flex items-center justify-center">
          <DayContent {...props} />
          {hasWorkouts && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </div>
      );
    } catch (error) {
      console.error("Error rendering calendar day:", error);
      return <DayContent {...props} />;
    }
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              locale={pt}
              components={{
                Day: renderDay,
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              {selectedDate 
                ? `Treinos em ${format(selectedDate, "dd 'de' MMMM", { locale: pt })}` 
                : "Selecione uma data no calendário"}
            </h3>
            
            {workoutsOnSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {workoutsOnSelectedDate.map(workout => (
                  <div key={workout.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workout.executionDate 
                            ? format(new Date(workout.executionDate), "HH:mm", { locale: pt }) 
                            : "Horário não registrado"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Concluído
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setSelectedWorkout(workout)}
                      >
                        Ver detalhes
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate 
                  ? "Nenhum treino registrado para esta data."
                  : "Selecione uma data para ver os treinos."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <WorkoutHistoryDetail 
        workout={selectedWorkout} 
        onClose={() => setSelectedWorkout(null)} 
        open={!!selectedWorkout} 
      />
    </div>
  );
}
