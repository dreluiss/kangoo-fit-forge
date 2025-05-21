import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { Workout, WorkoutExercise } from "@/components/workout-components";
import { WorkoutHistoryList } from "@/components/workout-history-components";
import { WorkoutHistoryCalendar } from "@/components/workout-history-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CompletedWorkout {
  workout_id: string;
  workout_name: string;
  exercises: WorkoutExercise[];
  date: string;
  completed: boolean;
  notes: string | null;
  executiondate: string | null;
  feedback_message: string | null;
  feedback_suggestions: string[] | null;
  next_workout_focus: string | null;
  next_workout_recommendations: string[] | null;
}

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          setWorkouts([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("workout_history")
          .select("*")
          .eq("user_id", user.id)
          .order('executed_at', { ascending: false });

        if (error) {
          console.error("Erro ao buscar histórico:", error);
          setWorkouts([]);
          return;
        }

        if (!data) {
          setWorkouts([]);
          return;
        }

        const formattedWorkouts = data.map((w: any) => ({
          id: w.id,
          name: w.workout_name || 'Treino',
          exercises: w.exercises || [],
          date: w.executed_at ? new Date(w.executed_at) : new Date(),
          completed: true,
          notes: w.notes,
          executionDate: w.executed_at ? new Date(w.executed_at) : undefined,
          executiondate: w.executed_at ? new Date(w.executed_at) : undefined,
          feedback_message: w.feedback,
          feedback_suggestions: [],
          next_workout_focus: undefined,
          next_workout_recommendations: []
        }));
        console.log('Histórico carregado:', formattedWorkouts);
        setWorkouts(formattedWorkouts);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    document.title = "Histórico de Treinos | KangoFit";
  }, []);

  if (loading) {
    return <div>Carregando histórico...</div>;
  }

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
