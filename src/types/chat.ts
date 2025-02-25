export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
  timestamp: string;
}

export interface ChatContext {
  id: string;
  messages: Message[];
  lastUpdated: string;
}
