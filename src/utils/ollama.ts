import { Ollama } from "ollama";
import { Message } from "@/types/chat";

const ollama = new Ollama({
  host: "http://localhost:11434",
});

function formatMessages(messages: Message[]): string {
  return messages
    .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
    .join('\n\n');
}

export async function* generateStreamingResponse(currentMessage: string, previousMessages: Message[] = []) {
  try {
    const conversationContext = formatMessages(previousMessages);
    const fullPrompt = `${conversationContext}${conversationContext ? '\n\n' : ''}Human: ${currentMessage}\n\nAssistant:`;

    const stream = await ollama.generate({
      model: "llama3.1",
      prompt: fullPrompt,
      stream: true,
    });

    for await (const part of stream) {
      yield part.response;
    }
  } catch (error) {
    console.error("Ollama API error:", error);
    throw new Error("Failed to generate response from AI");
  }
}
