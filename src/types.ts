export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isNotFound?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: "premios" | "discografia" | "biografia" | "fuera_de_base";
  label: string;
}
