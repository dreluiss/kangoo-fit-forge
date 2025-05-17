import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Tipos
export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment?: string;
}

interface ExerciseTableProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
  onEditExercise: (id: string, exercise: Partial<Exercise>) => void;
  onDeleteExercise: (id: string) => void;
}

// Dados padrão para exercícios
export const defaultExercises: Exercise[] = [
  { id: "1", name: "Agachamento", category: "Pernas", equipment: "Peso livre" },
  { id: "2", name: "Supino", category: "Peito", equipment: "Halteres" },
  { id: "3", name: "Flexão de braço", category: "Peito", equipment: "Peso corporal" },
  { id: "4", name: "Prancha", category: "Core", equipment: "Peso corporal" },
  { id: "5", name: "Corrida na esteira", category: "Cardio", equipment: "Esteira" },
  { id: "6", name: "Bíceps com halteres", category: "Braços", equipment: "Halteres" },
  { id: "7", name: "Tríceps na polia", category: "Braços", equipment: "Polia" },
  { id: "8", name: "Abdominal supra", category: "Core", equipment: "Peso corporal" },
  { id: "9", name: "Burpee", category: "Cardio", equipment: "Peso corporal" },
];

export const exerciseCategories = [
  "Pernas",
  "Peito",
  "Costas",
  "Braços",
  "Ombros",
  "Core",
  "Cardio",
  "Outro"
];

export function ExerciseTable({
  exercises,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}: ExerciseTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewExercise, setViewExercise] = useState<Exercise | null>(null);

  const { toast } = useToast();

  const handleAddNew = () => {
    setCurrentExercise({ name: "", category: "", equipment: "" });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onDeleteExercise(id);
    toast({
      title: "Exercício removido",
      description: "O exercício foi removido com sucesso.",
    });
  };

  const handleSave = () => {
    if (!currentExercise || !currentExercise.name || !currentExercise.category) {
      toast({
        title: "Erro ao salvar",
        description: "Nome e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentExercise.id) {
      onEditExercise(currentExercise.id, currentExercise);
      toast({
        title: "Exercício atualizado",
        description: "O exercício foi atualizado com sucesso.",
      });
    } else {
      const newExercise = {
        id: Math.random().toString(36).substr(2, 9),
        name: currentExercise.name,
        category: currentExercise.category,
        equipment: currentExercise.equipment,
      };
      onAddExercise(newExercise);
      toast({
        title: "Exercício adicionado",
        description: "O novo exercício foi adicionado com sucesso.",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Exercícios</h2>
        <Button onClick={handleAddNew}>Novo Exercício</Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Nome</TableHead>
              <TableHead className="w-12 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="font-medium">{exercise.name}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewExercise(exercise)}>
                        <Eye className="w-4 h-4 mr-2" /> Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(exercise)}>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(exercise.id)}
                        className="text-destructive"
                      >
                        <Trash className="w-4 h-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewExercise} onOpenChange={() => setViewExercise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Exercício</DialogTitle>
          </DialogHeader>
          {viewExercise && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Nome:</span> {viewExercise.name}
              </div>
              <div>
                <span className="font-semibold">Categoria:</span> {viewExercise.category}
              </div>
              <div>
                <span className="font-semibold">Equipamento:</span> {viewExercise.equipment || "—"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Exercício" : "Novo Exercício"}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes do exercício abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exercício</Label>
              <Input
                id="name"
                value={currentExercise?.name || ""}
                onChange={(e) =>
                  setCurrentExercise({
                    ...currentExercise!,
                    name: e.target.value,
                  })
                }
                placeholder="Ex: Agachamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={currentExercise?.category || ""}
                onValueChange={(value) =>
                  setCurrentExercise({
                    ...currentExercise!,
                    category: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipamento (opcional)</Label>
              <Input
                id="equipment"
                value={currentExercise?.equipment || ""}
                onChange={(e) =>
                  setCurrentExercise({
                    ...currentExercise!,
                    equipment: e.target.value,
                  })
                }
                placeholder="Ex: Halteres, Esteira, Peso corporal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutFormProps {
  exercises: Exercise[];
  onSaveWorkout: (name: string, exercises: WorkoutExercise[]) => void;
}

export function WorkoutForm({ exercises, onSaveWorkout }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [currentExerciseId, setCurrentExerciseId] = useState("");
  const [viewExercise, setViewExercise] = useState<WorkoutExercise | null>(null);
  const { toast } = useToast();

  const addExerciseToWorkout = () => {
    if (!currentExerciseId) {
      toast({
        title: "Selecione um exercício",
        description: "Por favor selecione um exercício para adicionar ao treino.",
        variant: "destructive",
      });
      return;
    }

    const exercise = exercises.find((ex) => ex.id === currentExerciseId);
    
    if (exercise) {
      if (selectedExercises.some(e => e.exerciseId === currentExerciseId)) {
        toast({
          title: "Exercício já adicionado",
          description: "Este exercício já está no treino.",
          variant: "destructive",
        });
        return;
      }

      const newWorkoutExercise: WorkoutExercise = {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: 3,
        reps: 12,
        weight: 0,
      };
      
      setSelectedExercises([...selectedExercises, newWorkoutExercise]);
      setCurrentExerciseId("");
    }
  };

  const updateExerciseDetails = (index: number, field: keyof WorkoutExercise, value: number) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const removeExercise = (index: number) => {
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };

  const handleSaveWorkout = () => {
    if (!workoutName) {
      toast({
        title: "Nome do treino obrigatório",
        description: "Por favor, dê um nome ao seu treino.",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "Nenhum exercício selecionado",
        description: "Adicione pelo menos um exercício ao seu treino.",
        variant: "destructive",
      });
      return;
    }

    onSaveWorkout(workoutName, selectedExercises);
    
    // Reset form
    setWorkoutName("");
    setSelectedExercises([]);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Nome do Treino</Label>
          <Input
            id="workout-name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Ex: Treino de Pernas"
          />
        </div>

        <div className="space-y-2">
          <Label>Adicionar Exercício</Label>
          <div className="flex space-x-2">
            <Select
              value={currentExerciseId}
              onValueChange={setCurrentExerciseId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addExerciseToWorkout}>Adicionar</Button>
          </div>
        </div>

        {selectedExercises.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Exercícios no Treino</h3>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Exercício</TableHead>
                    <TableHead className="w-12 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedExercises.map((ex, index) => (
                    <TableRow key={index}>
                      <TableCell>{ex.exerciseName}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewExercise(ex)}>
                              <Eye className="w-4 h-4 mr-2" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {/* editar lógica */}}>
                              <Edit className="w-4 h-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => removeExercise(index)}
                              className="text-destructive"
                            >
                              <Trash className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <Button 
          onClick={handleSaveWorkout} 
          className="w-full"
          disabled={!workoutName || selectedExercises.length === 0}
        >
          Salvar Treino
        </Button>
      </div>

      <Dialog open={!!viewExercise} onOpenChange={() => setViewExercise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Exercício</DialogTitle>
          </DialogHeader>
          {viewExercise && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Nome:</span> {viewExercise.exerciseName}
              </div>
              <div>
                <span className="font-semibold">Séries:</span> {viewExercise.sets}
              </div>
              <div>
                <span className="font-semibold">Repetições:</span> {viewExercise.reps}
              </div>
              <div>
                <span className="font-semibold">Carga:</span> {viewExercise.weight || "—"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
}

interface WorkoutHistoryListProps {
  workouts: Workout[];
  onViewWorkout: (workout: Workout) => void;
}

export function WorkoutHistoryList({ workouts, onViewWorkout }: WorkoutHistoryListProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Nome</TableHead>
            <TableHead className="w-12 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workouts.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell className="font-medium">{workout.name}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewWorkout(workout)}>
                      <Eye className="w-4 h-4 mr-2" /> Visualizar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface WorkoutListProps {
  workouts: Workout[];
  onViewWorkout: (workout: Workout) => void;
}

export function WorkoutList({ workouts, onViewWorkout }: WorkoutListProps) {
  const [viewWorkout, setViewWorkout] = useState<Workout | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id} className="overflow-hidden">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <div>
                <CardTitle>{workout.name}</CardTitle>
                {/* ... outras infos ... */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewWorkout(workout)}>
                    <Eye className="w-4 h-4 mr-2" /> Visualizar
                  </DropdownMenuItem>
                  {/* Outras ações, se desejar */}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            {/* ... resto do card ... */}
          </Card>
        ))}
      </div>

      {/* Modal de Visualização do Treino */}
      <Dialog open={!!viewWorkout} onOpenChange={() => setViewWorkout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Treino</DialogTitle>
          </DialogHeader>
          {viewWorkout && (
            <div>
              <div><b>Nome:</b> {viewWorkout.name}</div>
              <div><b>Data:</b> {format(new Date(viewWorkout.date), "dd/MM/yyyy")}</div>
              <div className="mt-4">
                <b>Exercícios:</b>
                <ul className="mt-2 space-y-2">
                  {viewWorkout.exercises.map((ex, i) => (
                    <li key={i} className="border rounded p-2">
                      <div><b>Nome:</b> {ex.exerciseName}</div>
                      <div><b>Séries:</b> {ex.sets}</div>
                      <div><b>Repetições:</b> {ex.reps}</div>
                      <div><b>Carga:</b> {ex.weight || "—"}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
