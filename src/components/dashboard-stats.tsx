import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  className?: string;
}

export function StatsCard({ title, value, description, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function WorkoutChart({ data }: { data: { name: string; tempo: number }[] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Progresso da Semana</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickFormatter={(value) => `${value}min`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value: number, name: string) => [
                  name === "tempo" ? `${value} min` : `${value} kcal`,
                  name === "tempo" ? "Tempo" : "Calorias"
                ]}
              />
              <Bar 
                dataKey="tempo" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                name="Tempo"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface Exercise {
  // Add appropriate properties for Exercise type
}

interface UpcomingWorkout {
  workout_name: string;
  date?: string;
  exercises?: Exercise[];
}

export function UpcomingWorkoutsCard({ workouts = [] }: { workouts: UpcomingWorkout[] }) {
  // Helper para formatar a data
  function getDayLabel(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return "Hoje";
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  }

  function getDateLabel(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `Criado em: ${date.toLocaleDateString('pt-BR')}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Treinos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum treino agendado.</p>
          ) : (
            workouts.map((workout, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{workout.workout_name || 'Treino'}</p>
                  <p className="text-xs text-muted-foreground">{getDateLabel(workout.date)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
