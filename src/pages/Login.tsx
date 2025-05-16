
import { useEffect } from "react";
import { LoginForm } from "@/components/auth-forms";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Login | KangoFit";
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center h-14 px-4 border-b">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/")}>
          <KangooMascot variant="small" />
          <span className="font-bold">KangoFit</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
