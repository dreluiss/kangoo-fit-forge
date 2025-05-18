import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Cadastro realizado! Verifique seu e-mail.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Login realizado!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 320, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{mode === "login" ? "Entrar" : "Cadastrar"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8 }}>
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ marginTop: 8, width: "100%", padding: 8, background: "none", border: "none", color: "#0070f3" }}
      >
        {mode === "login" ? "Criar uma conta" : "Já tem conta? Entrar"}
      </button>
      {message && <div style={{ marginTop: 12, color: "red" }}>{message}</div>}
    </div>
  );
}
