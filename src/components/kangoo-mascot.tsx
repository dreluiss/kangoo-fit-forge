
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
    if (!message) {
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setCurrentMessage(motivationalMessages[randomIndex]);
    }
  }, [message]);

  return (
    <div className={cn(
      "flex flex-col items-center",
      variant === 'small' ? "gap-2" : "gap-4",
      className
    )}>
      <div className="relative">
        <svg 
          className={cn(
            "text-kangoo-light animate-bounce", 
            variant === 'small' ? "h-10 w-10" : "h-20 w-20"
          )} 
          viewBox="0 0 100 100" 
          fill="currentColor"
        >
          {/* Simple kangoo silhouette */}
          <path d="M50,10 C30,10 25,30 25,50 C25,70 35,90 50,90 C65,90 75,70 75,50 C75,30 70,10 50,10 Z" />
          {/* Eyes */}
          <circle cx="40" cy="40" r="3" fill="white" />
          <circle cx="60" cy="40" r="3" fill="white" />
          {/* Smile */}
          <path d="M40,55 Q50,65 60,55" fill="none" stroke="white" strokeWidth="2" />
          {/* Ears */}
          <ellipse cx="35" cy="25" rx="5" ry="10" />
          <ellipse cx="65" cy="25" rx="5" ry="10" />
          {/* Pouch */}
          <ellipse cx="50" cy="65" rx="10" ry="5" fill="rgba(255,255,255,0.3)" />
        </svg>
        <div className={cn(
          "absolute -top-1 -right-1 bg-secondary text-white rounded-full flex items-center justify-center",
          variant === 'small' ? "w-4 h-4 text-[8px]" : "w-6 h-6 text-xs"
        )}>
          AI
        </div>
      </div>
      
      {variant === 'default' && (
        <div className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-lg max-w-md text-center text-sm relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-secondary/10 dark:border-b-secondary/20"></div>
          <p className="font-medium">{currentMessage}</p>
        </div>
      )}
    </div>
  );
}
