import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth-forms";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import InterviewFlow from "@/components/onboarding/InterviewFlow";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    document.title = "Login | KangoFit";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage("Login realizado!");
      setTimeout(() => navigate("/dashboard"), 1000);
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage("Erro ao cadastrar: " + error.message);
    } else {
      setUserEmail(email);
      setShowInterview(true);
    }
    setLoading(false);
  };

  const handleInterviewComplete = (interviewData: any) => {
    // Salve os dados do questionário como preferir (ex: localStorage, Supabase, etc)
    localStorage.setItem("kangofit-profile-data", JSON.stringify({
      email: userEmail,
      ...interviewData,
    }));
    navigate("/dashboard");
  };

  if (showInterview) {
    return <InterviewFlow onComplete={handleInterviewComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181A1B]">
      <form
        onSubmit={handleLogin}
        className="bg-[#10131A] rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md border border-[#23272F]"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#23272F] flex items-center justify-center mb-2">
            <KangooMascot variant="small" />
          </div>
          <span className="text-white text-3xl font-bold mb-1">Login</span>
          <span className="text-gray-400 text-sm text-center">
            Entre na sua conta para acessar seus treinos
          </span>
        </div>
        <div className="w-full mb-2">
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <Input
            type="email"
            className="w-full mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="w-full mb-4">
          <label className="text-gray-300 text-sm mb-1 block">Senha</label>
          <Input
            type="password"
            className="w-full mb-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="text-right text-xs">
            <a href="#" className="text-cyan-300 hover:underline">Esqueceu a senha?</a>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-cyan-300 text-black font-bold py-2 rounded-lg mb-2"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        {message && (
          <div className={`text-center text-sm mb-2 ${message.includes("realizado") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </div>
        )}
        <div className="text-gray-400 text-sm mt-2">
          Não tem uma conta?{" "}
          <span
            className="text-cyan-300 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
