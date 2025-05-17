import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface InterviewData {
  experienceLevel: string;
  mainGoal: string;
  weeklyFrequency: string;
  sessionDuration: string;
  trainingLocation: string;
  availableEquipment: string[];
}

const questions = [
  {
    id: "experienceLevel",
    question: "Qual seu nível atual de experiência com treinos físicos?",
    options: [
      { value: "beginner", label: "Iniciante – Nunca treinei ou estou voltando agora" },
      { value: "intermediate", label: "Intermediário – Já treino com alguma frequência" },
      { value: "advanced", label: "Avançado – Treino com regularidade há mais de 1 ano" }
    ],
    type: "radio"
  },
  {
    id: "mainGoal",
    question: "Qual seu objetivo principal com o KangoFit?",
    options: [
      { value: "loseFat", label: "Perder gordura corporal" },
      { value: "gainMuscle", label: "Ganhar massa muscular" },
      { value: "improveConditioning", label: "Melhorar o condicionamento" },
      { value: "maintainHealth", label: "Manutenção da saúde" }
    ],
    type: "radio"
  },
  {
    id: "weeklyFrequency",
    question: "Quantos dias por semana você pode treinar?",
    options: [
      { value: "2x", label: "2x por semana" },
      { value: "3x", label: "3x por semana" },
      { value: "4x", label: "4x por semana" },
      { value: "5x+", label: "5 ou mais vezes por semana" }
    ],
    type: "radio"
  },
  {
    id: "sessionDuration",
    question: "Quanto tempo você tem disponível por treino?",
    options: [
      { value: "20min", label: "Até 20 minutos" },
      { value: "30-40min", label: "30 a 40 minutos" },
      { value: "60min+", label: "1 hora ou mais" }
    ],
    type: "radio"
  },
  {
    id: "trainingLocation",
    question: "Onde você pretende treinar?",
    options: [
      { value: "home", label: "Em casa" },
      { value: "gym", label: "Na academia" },
      { value: "outdoor", label: "Ao ar livre" }
    ],
    type: "radio"
  },
  {
    id: "availableEquipment",
    question: "Quais equipamentos você tem disponíveis?",
    options: [
      { value: "none", label: "Nenhum – só peso corporal" },
      { value: "dumbbells", label: "Halteres" },
      { value: "bench", label: "Banco" },
      { value: "bands", label: "Elásticos" },
      { value: "cardio", label: "Esteira/bicicleta ergométrica" }
    ],
    type: "checkbox"
  }
];

const InterviewFlow = ({ onComplete }: { onComplete: (data: InterviewData) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<InterviewData>({
    experienceLevel: "",
    mainGoal: "",
    weeklyFrequency: "",
    sessionDuration: "",
    trainingLocation: "",
    availableEquipment: []
  });

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <KangooMascot />
          <div className="text-sm text-muted-foreground">
            {currentStep + 1} de {questions.length}
          </div>
        </div>

        <div className="w-full bg-muted h-2 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

          {currentQuestion.type === "radio" ? (
            <RadioGroup
              value={answers[currentQuestion.id as keyof InterviewData] as string}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={(answers[currentQuestion.id as keyof InterviewData] as string[]).includes(option.value)}
                    onCheckedChange={(checked) => {
                      const current = answers[currentQuestion.id as keyof InterviewData] as string[];
                      const newValue = checked
                        ? [...current, option.value]
                        : current.filter(v => v !== option.value);
                      handleAnswer(currentQuestion.id, newValue);
                    }}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={
                currentQuestion.type === "radio"
                  ? !answers[currentQuestion.id as keyof InterviewData]
                  : (answers[currentQuestion.id as keyof InterviewData] as string[]).length === 0
              }
            >
              {currentStep === questions.length - 1 ? "Finalizar" : "Próximo"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewFlow;