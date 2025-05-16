
import { Button } from "@/components/ui/button";
import { KangooMascot } from "@/components/kangoo-mascot";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex justify-between items-center h-14 mx-auto">
          <div className="flex items-center space-x-2">
            <KangooMascot variant="small" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KangoFit
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Cadastrar
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto py-12 px-4 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Transforme seus treinos com o{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  KangoFit
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Monitore seu progresso, crie e personalize seus treinos com o auxílio do Kangoo,
                seu assistente de treino com inteligência artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate("/register")}>
                  Começar agora
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Já tenho uma conta
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full w-72 h-72 flex items-center justify-center">
                  <KangooMascot className="scale-150" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="bg-muted/50 py-12 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Por que escolher o KangoFit?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Treinos Personalizados</h3>
                <p className="text-muted-foreground">
                  Crie e personalize seus treinos de acordo com seus objetivos e nível de experiência.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Chart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Acompanhe seu Progresso</h3>
                <p className="text-muted-foreground">
                  Visualize sua evolução através de gráficos e estatísticas detalhadas.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <AI className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Assistente IA Kangoo</h3>
                <p className="text-muted-foreground">
                  Receba dicas e motivação personalizada do Kangoo, seu assistente de treino com IA.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="container mx-auto py-12 md:py-24 px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar seus treinos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão melhorando seu condicionamento físico com o KangoFit.
          </p>
          <Button size="lg" onClick={() => navigate("/register")}>
            Cadastre-se gratuitamente
          </Button>
        </section>
      </main>
      
      <footer className="bg-muted/50 py-8 border-t mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <KangooMascot variant="small" />
              <span className="font-bold">KangoFit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KangoFit. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Icons
function Dumbbell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 6.5h11"></path>
      <path d="M6.5 17.5h11"></path>
      <path d="M6 12h12"></path>
      <path d="M6.5 17.5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2 2 2 0 0 1 2 2"></path>
      <path d="M17.5 17.5a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2 2 2 0 0 0-2 2"></path>
    </svg>
  );
}

function Chart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18"></path>
      <path d="m19 9-5 5-4-4-3 3"></path>
    </svg>
  );
}

function AI(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
      <path d="M7 7h.01"></path>
    </svg>
  );
}

export default Landing;
