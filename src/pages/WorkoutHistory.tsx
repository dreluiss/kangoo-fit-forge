
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { Workout } from "@/components/workout-components";
import { WorkoutHistoryList } from "@/components/workout-history-components";
import { WorkoutHistoryCalendar } from "@/components/workout-history-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("kangofit-workouts");
    if (!saved) return [];
    
    // Parse workouts and convert date strings back to Date objects
    try {
      const parsedWorkouts = JSON.parse(saved);
      return parsedWorkouts
        .filter((workout: any) => workout.completed) // Only show completed workouts
        .map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
          executionDate: workout.executionDate ? new Date(workout.executionDate) : undefined
        }));
    } catch (error) {
      console.error("Error parsing workouts from localStorage:", error);
      return [];
    }
  });
  
  useEffect(() => {
    document.title = "Histórico de Treinos | KangoFit";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Histórico de Treinos" />
      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="list" className="flex gap-2 items-center">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex gap-2 items-center">
              <Calendar className="h-4 w-4" />
              Calendário
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <WorkoutHistoryList workouts={workouts} />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <WorkoutHistoryCalendar workouts={workouts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WorkoutHistory;
