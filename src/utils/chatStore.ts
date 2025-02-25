import { ChatContext, Message } from "@/types/chat";
import { randomUUID } from "crypto";

class ChatStore {
  private static instance: ChatStore;
  private contexts: Map<string, ChatContext>;

  private constructor() {
    this.contexts = new Map();
  }

  public static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  createChat(): string {
    const id = randomUUID();
    this.contexts.set(id, {
      id,
      messages: [],
      lastUpdated: new Date().toISOString(),
    });
    return id;
  }

  getContext(id: string): ChatContext | undefined {
    return this.contexts.get(id);
  }

  addMessage(chatId: string, message: Message): void {
    const context = this.contexts.get(chatId);
    if (context) {
      context.messages.push(message);
      context.lastUpdated = new Date().toISOString();
    }
  }

  getMessages(chatId: string): Message[] {
    return this.contexts.get(chatId)?.messages || [];
  }
}

// Create the singleton instance in the global scope
declare global {
  // eslint-disable-next-line no-var
  var chatStore: ChatStore | undefined;
}

const chatStore = global.chatStore ?? ChatStore.getInstance();

if (process.env.NODE_ENV !== "production") {
  global.chatStore = chatStore;
}

export { chatStore };
