
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
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise> | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="font-medium">{exercise.name}</TableCell>
                <TableCell>{exercise.category}</TableCell>
                <TableCell>{exercise.equipment || "—"}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(exercise)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(exercise.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercício</TableHead>
                  <TableHead className="w-16">Séries</TableHead>
                  <TableHead className="w-16">Reps</TableHead>
                  <TableHead className="w-20">Carga (kg)</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedExercises.map((ex, index) => (
                  <TableRow key={index}>
                    <TableCell>{ex.exerciseName}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        className="w-14"
                        value={ex.sets}
                        onChange={(e) => updateExerciseDetails(index, "sets", parseInt(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        className="w-14"
                        value={ex.reps}
                        onChange={(e) => updateExerciseDetails(index, "reps", parseInt(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-16"
                        value={ex.weight || 0}
                        onChange={(e) => updateExerciseDetails(index, "weight", parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => removeExercise(index)}
                      >
                        X
                      </Button>
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
  );
}
