export type AttachmentStyle = "Secure" | "Anxious" | "Avoidant" | "Fearful Avoidant" | "Mixed";

export interface User {
  email: string;
  name: string;
  attachmentStyle?: AttachmentStyle;
  registeredAt?: string;
  relationshipStatus?: string;
  primaryGoal?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface JournalInsights {
  summary: string;
  emotionalInsights: string[];
  communicationPatterns: string[];
  reflectionQuestions: string[];
  growthSuggestions: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: string; // emoji
  insights?: JournalInsights;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1 to 5
  emoji: string;
  note: string;
}

export interface RelationshipGoal {
  id: string;
  text: string;
  category: "communication" | "trust" | "boundaries" | "intimacy" | "self-care";
  targetDate: string;
  progress: number; // 0 to 100
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  text: string;
  type: "info" | "warning" | "success" | "reminder";
  read: boolean;
  date: string;
}

export interface DailyReflection {
  prompt: string;
  challenge: string;
  reminder: string;
  exercise: string;
  gratitude: string;
  quote: string;
}
