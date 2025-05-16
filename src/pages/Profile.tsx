
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { KangooMascot } from "@/components/kangoo-mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [name, setName] = useState("Usuário KangoFit");
  const [email, setEmail] = useState("usuario@exemplo.com");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [objective, setObjective] = useState("Ganho de massa muscular");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Meu Perfil | KangoFit";
  }, []);

  const handleSaveProfile = () => {
    // Save profile data (mock)
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
  };
  
  const handleLogout = () => {
    navigate("/login");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Meu Perfil" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-xl bg-primary/20 text-primary">
                {name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-muted-foreground">{email}</p>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={() => document.getElementById("name")?.focus()}>
                  Editar Perfil
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objective">Objetivo</Label>
                <Input id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>
            </div>
            
            <Button type="submit">Salvar alterações</Button>
          </form>
          
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <KangooMascot />
                <div>
                  <h3 className="font-medium text-lg">Sua jornada de treino</h3>
                  <p className="text-muted-foreground">
                    Você está no caminho certo! Continue consistente com seus treinos e verá resultados incríveis em breve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
