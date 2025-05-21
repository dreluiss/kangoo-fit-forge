const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface WorkoutMessage {
  type: 'workout_completed';
  data: {
    userId: string;
    userName: string;
    workoutId: string;
    workoutName: string;
    exercises: {
      exerciseId: string;
      exerciseName: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
    completedAt: string;
    notes?: string;
  };
}

export interface WorkoutFeedback {
  message: string;
  suggestions?: string[];
  nextWorkout?: {
    focus: string;
    recommendations: string[];
  };
}

export const sendWorkoutMessage = async (message: WorkoutMessage): Promise<WorkoutFeedback> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    
    if (!response.ok) {
      throw new Error('Falha ao enviar mensagem para o n8n');
    }
    
    const text = await response.text();

    if (!text) throw new Error("Resposta vazia do agente IA");

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error("Resposta do agente IA não é um JSON válido: " + text);
    }

    return json;
  } catch (error) {
    throw error;
  }
};

function cleanFeedbackMessage(message: string): string {
  return message.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
} 