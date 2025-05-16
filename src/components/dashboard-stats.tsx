
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

export function WorkoutChart() {
  const data = [
    { name: "Seg", tempo: 30, calorias: 240 },
    { name: "Ter", tempo: 45, calorias: 320 },
    { name: "Qua", tempo: 0, calorias: 0 },
    { name: "Qui", tempo: 60, calorias: 450 },
    { name: "Sex", tempo: 50, calorias: 380 },
    { name: "Sáb", tempo: 90, calorias: 520 },
    { name: "Dom", tempo: 0, calorias: 0 },
  ];

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
              <Bar 
                dataKey="calorias" 
                fill="hsl(var(--secondary))" 
                radius={[4, 4, 0, 0]} 
                name="Calorias"
                hide
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingWorkoutsCard() {
  const workouts = [
    { day: "Hoje", name: "Treino de Pernas", time: "18:00" },
    { day: "Amanhã", name: "Treino de Braços", time: "19:00" },
    { day: "Quinta", name: "Cardio Intenso", time: "17:30" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Treinos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.map((workout, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{workout.name}</p>
                <p className="text-xs text-muted-foreground">{workout.day}</p>
              </div>
              <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                {workout.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
