import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface KangooMascotProps {
  className?: string;
  variant?: 'default' | 'small';
  message?: string;
}

// Sample motivational messages from Kangoo
const motivationalMessages = [
  "Excelente treino hoje! Continue assim e logo você verá resultados incríveis!",
  "Você está evoluindo a cada dia! Sua consistência é inspiradora!",
  "Mais um treino concluído! Sua dedicação é o que te torna cada vez mais forte!",
  "Você superou seus limites hoje! Esse é o caminho para o sucesso!",
  "Incrível desempenho! Lembre-se que cada treino te aproxima dos seus objetivos!",
  "Você está construindo o seu melhor eu a cada dia! Continue assim!",
  "Sua persistência é admirável! Os resultados virão com certeza!",
  "Cada repetição te faz mais forte, física e mentalmente!",
  "Você está no caminho certo! Sua determinação é o que te diferencia!",
  "Já pensou onde você estará daqui alguns meses se continuar nesse ritmo?"
];

export function KangooMascot({ className, variant = 'default', message }: KangooMascotProps) {
  const [currentMessage, setCurrentMessage] = useState<string>(message || motivationalMessages[0]);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setCurrentMessage(motivationalMessages[randomIndex]);
    }
  }, [message]);

  return (
    <div className={cn(
      "flex flex-row items-start w-full",
      variant === 'small' ? "gap-2" : "gap-4",
      className
    )}>
      <div className="relative" style={{ minWidth: variant === 'small' ? 40 : 80 }}>
        {variant === 'small' ? (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/072895f9-4fea-4e82-8ec2-0a8900622c64.png" 
              alt="Kangoo AI" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/072895f9-4fea-4e82-8ec2-0a8900622c64.png" 
              alt="Kangoo AI" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={cn(
          "absolute -top-1 -right-1 bg-secondary text-white rounded-full flex items-center justify-center",
          variant === 'small' ? "w-4 h-4 text-[8px]" : "w-6 h-6 text-xs"
        )}>
          AI
        </div>
      </div>
      
      {variant === 'default' && (
        <div className="bg-white/80 dark:bg-secondary/20 p-4 rounded-lg w-full text-left text-sm relative border border-neutral-200 dark:border-none">
          <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white/80 dark:border-b-secondary/20"></div>
          {currentMessage.split(/\n\n|\n/).map((paragraph, idx) => (
            <p className="font-medium" key={idx} style={{ marginBottom: 8 }}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}
