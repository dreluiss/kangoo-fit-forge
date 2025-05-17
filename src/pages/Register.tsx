import { useEffect, useState } from "react";
import { RegisterForm } from "@/components/auth-forms";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";
import InterviewFlow from "@/components/onboarding/InterviewFlow";

const Register = () => {
  const navigate = useNavigate();
  const [showInterview, setShowInterview] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    document.title = "Cadastro | KangoFit";
  }, []);

  const handleRegisterComplete = (data: any) => {
    setUserData(data);
    setShowInterview(true);
  };

  const handleInterviewComplete = (interviewData: any) => {
    // Combinar dados do registro com dados da entrevista
    const completeUserData = {
      ...userData,
      ...interviewData,
      // Mapear mainGoal para objective com valores mais descritivos
      objective: interviewData.mainGoal === 'loseFat' ? 'Perder gordura corporal' :
                interviewData.mainGoal === 'gainMuscle' ? 'Ganhar massa muscular' :
                interviewData.mainGoal === 'improveConditioning' ? 'Melhorar o condicionamento' :
                interviewData.mainGoal === 'maintainHealth' ? 'Manutenção da saúde' :
                'Não definido'
    };
    
    // Salvar dados completos no localStorage
    localStorage.setItem("kangofit-profile-data", JSON.stringify(completeUserData));
    
    // Redirecionar para o dashboard
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
