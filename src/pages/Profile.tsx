import { useState, useEffect, useRef } from "react";
import { AppHeader } from "@/components/app-header";
import { KangooMascot } from "@/components/kangoo-mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";

// Interface para os dados do perfil
interface ProfileData {
  name: string;
  email: string;
  height: string;
  weight: string;
  objective: string;
  // Dados do questionário
  experienceLevel?: string;
  mainGoal?: string;
  weeklyFrequency?: string;
  sessionDuration?: string;
  trainingLocation?: string;
  availableEquipment?: string[];
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    // Carregar dados do localStorage, se existirem
    const savedData = localStorage.getItem("kangofit-profile-data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Dados do perfil carregados:", parsedData); // Log para debug
        return parsedData;
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
    
    // Valores padrão se não houver dados salvos
    return {
      name: "Usuário KangoFit",
      email: "usuario@exemplo.com",
      height: "175",
      weight: "70",
      objective: "Não definido"
    };
  });
  
  const { name, email, height, weight, objective } = profileData;
  
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem("kangofit-profile-image");
  });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Meu Perfil | KangoFit";
  }, []);

  useEffect(() => {
    // Save profile image to localStorage when it changes
    if (profileImage) {
      localStorage.setItem("kangofit-profile-image", profileImage);
    }
  }, [profileImage]);
  
  // Salvar dados do perfil no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem("kangofit-profile-data", JSON.stringify(profileData));
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveProfile = () => {
    // Dados já estão sendo salvos automaticamente no localStorage
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
  };
  
  const handleLogout = () => {
    navigate("/login");
  };
  
  const handleUploadImage = () => {
    setIsUploadDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.match('image.*')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, envie apenas imagens (jpg, png).",
          variant: "destructive",
        });
        return;
      }

      // Read the file and convert to data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
          setIsUploadDialogOpen(false);
          toast({
            title: "Imagem atualizada",
            description: "Sua foto de perfil foi atualizada com sucesso!",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem("kangofit-profile-image");
    setIsUploadDialogOpen(false);
    toast({
      title: "Imagem removida",
      description: "Sua foto de perfil foi removida com sucesso.",
    });
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Meu Perfil" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleUploadImage}>
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={name} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary/20 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <button 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-md"
                onClick={handleUploadImage}
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
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
                <Input id="name" value={name} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" value={height} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objective">Objetivo</Label>
                <Input 
                  id="objective" 
                  value={objective || 'Não definido'} 
                  onChange={handleInputChange}
                  placeholder="Seu objetivo de treino"
                />
              </div>
            </div>
            
            <Button type="submit">Salvar alterações</Button>
          </form>

          {/* Nova seção para mostrar os dados do questionário */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Informações do seu perfil de treino</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nível de experiência</Label>
                  <p className="text-muted-foreground">
                    {profileData.experienceLevel === 'beginner' ? 'Iniciante' :
                     profileData.experienceLevel === 'intermediate' ? 'Intermediário' :
                     'Avançado'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequência semanal</Label>
                  <p className="text-muted-foreground">
                    {profileData.weeklyFrequency} treinos por semana
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Duração do treino</Label>
                  <p className="text-muted-foreground">
                    {profileData.sessionDuration === '20min' ? 'Até 20 minutos' :
                     profileData.sessionDuration === '30-40min' ? '30 a 40 minutos' :
                     '1 hora ou mais'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Local de treino</Label>
                  <p className="text-muted-foreground">
                    {profileData.trainingLocation === 'home' ? 'Em casa' :
                     profileData.trainingLocation === 'gym' ? 'Na academia' :
                     'Ao ar livre'}
                  </p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Equipamentos disponíveis</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.availableEquipment?.map((equipment, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {equipment === 'none' ? 'Peso corporal' :
                         equipment === 'dumbbells' ? 'Halteres' :
                         equipment === 'bench' ? 'Banco' :
                         equipment === 'bands' ? 'Elásticos' :
                         'Esteira/bicicleta ergométrica'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
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

      {/* Image Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foto de perfil</DialogTitle>
            <DialogDescription>
              Escolha uma imagem para usar como sua foto de perfil.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-4">
            <Avatar className="h-32 w-32">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={name} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Escolher imagem
              </Button>
              {profileImage && (
                <Button variant="outline" onClick={handleRemoveImage}>
                  Remover imagem
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
