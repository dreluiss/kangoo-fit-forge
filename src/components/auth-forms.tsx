import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useToast } from "@/hooks/use-toast";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface InterviewData {
  mainGoal: string;
  /* outros campos */
  [key: string]: any;
}

type CompleteUserData = RegisterData & InterviewData & { objective: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // Simple validation
      if (email && password) {
        // Mock successful login
        navigate("/dashboard");
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, verifique seu email e senha.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 items-center text-center">
        <div className="flex items-center justify-center mb-2">
          <KangooMascot variant="small" />
        </div>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Entre na sua conta para acessar seus treinos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => toast({
                  title: "Função em desenvolvimento",
                  description: "Esta funcionalidade estará disponível em breve!",
                })}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Não tem uma conta?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
            Cadastre-se
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function RegisterForm({ onRegisterComplete }: { onRegisterComplete: (data: RegisterData) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration delay
    setTimeout(() => {
      // Simple validation
      if (name && email && password) {
        const userData = {
          name,
          email,
          password
        };
        
        console.log("Registration successful, calling onRegisterComplete");
        onRegisterComplete(userData);
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 items-center text-center">
        <div className="flex items-center justify-center mb-2">
          <KangooMascot variant="small" />
        </div>
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Cadastre-se para começar sua jornada fitness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
            Faça login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
