import { useEffect, useState } from "react";
import { RegisterForm } from "@/components/auth-forms";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";
import InterviewFlow from "@/components/onboarding/InterviewFlow";

// Tipos para registro e entrevista
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface InterviewData {
  mainGoal: string;
  [key: string]: unknown; // outros campos opcionais
}

type CompleteUserData = RegisterData & InterviewData & { objective: string };

const Register = () => {
  const navigate = useNavigate();
  const [showInterview, setShowInterview] = useState(false);
  const [userData, setUserData] = useState<RegisterData | null>(null);
  
  useEffect(() => {
    document.title = "Cadastro | KangoFit";
  }, []);

  const handleRegisterComplete = (data: RegisterData) => {
    setUserData(data);
    setShowInterview(true);
  };

  const handleInterviewComplete = (interviewData: InterviewData) => {
    if (!userData) return;
    const completeUserData: CompleteUserData = {
      ...userData,
      ...interviewData,
      objective:
        interviewData.mainGoal === "loseFat"
          ? "Perder gordura corporal"
          : interviewData.mainGoal === "gainMuscle"
          ? "Ganhar massa muscular"
          : interviewData.mainGoal === "improveConditioning"
          ? "Melhorar o condicionamento"
          : interviewData.mainGoal === "maintainHealth"
          ? "Manutenção da saúde"
          : "Não definido",
    };
    
    localStorage.setItem("kangofit-profile-data", JSON.stringify(completeUserData));
    
    navigate("/dashboard");
  };

  if (showInterview) {
    return <InterviewFlow onComplete={handleInterviewComplete} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center h-14 px-4 border-b">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/")}>
          <KangooMascot variant="small" />
          <span className="font-bold">KangoFit</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <RegisterForm onRegisterComplete={handleRegisterComplete} />
      </div>
    </div>
  );
};

export default Register;
