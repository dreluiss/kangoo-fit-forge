
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { WorkoutScheduler, Workout } from "@/components/workout-components";
import { KangooMascot } from "@/components/kangoo-mascot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const Calendar = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("kangofit-workouts");
    return saved ? JSON.parse(saved).map((w: any) => ({
      ...w,
      date: new Date(w.date)
    })) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Calendário de Treinos | KangoFit";
  }, []);
  
  // Filter workouts for selected date
  const workoutsForSelectedDay = selectedDate
    ? workouts.filter(
        (workout) =>
          format(new Date(workout.date), "yyyy-MM-dd") === 
          format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const handleDateSelected = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Calendário" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-4">
            <WorkoutScheduler
              workouts={workouts}
              onDateSelected={handleDateSelected}
            />
            
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">Dica de progresso</CardTitle>
                </div>
                <KangooMascot variant="small" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mantenha a consistência! Tente marcar pelo menos 3-4 treinos por semana para 
                  resultados ótimos.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? 
                    format(selectedDate, "EEEE, dd 'de' MMMM", { locale: pt }) :
                    "Selecione uma data"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workoutsForSelectedDay.length > 0 ? (
                  <div className="space-y-4">
                    {workoutsForSelectedDay.map((workout) => (
                      <div 
                        key={workout.id} 
                        className="border rounded-md p-3 cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{workout.name}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {workout.exercises.length} exercícios
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {workout.completed ? "Concluído" : "Pendente"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Nenhum treino agendado para este dia
                    </p>
                    <Button onClick={() => navigate("/workouts/new")}>
                      Adicionar treino
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
