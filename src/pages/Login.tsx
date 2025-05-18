import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth-forms";
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | KangoFit";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        setMessage("Login realizado!");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Erro ao cadastrar: " + error.message);
      else setMessage("Cadastro realizado! Verifique seu e-mail.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center h-14 px-4 border-b">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/")}>
          <KangooMascot variant="small" />
          <span className="font-bold">KangoFit</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Criar conta" : "Já tem conta? Entrar"}
          </Button>
          {message && <div className="text-red-500 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
