import { generateStreamingResponse } from '@/utils/ollama';
import { chatStore } from '@/utils/chatStore';
import { Message } from '@/types/chat';

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { message, chatId: existingChatId } = await request.json();

  const chatId = existingChatId || chatStore.createChat();
  const previousMessages = chatStore.getMessages(chatId);
  
  const userMessage: Message = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };
  
  chatStore.addMessage(chatId, userMessage);

  try {
    let accumulatedResponse = '';
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateStreamingResponse(message, previousMessages)) {
            accumulatedResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          
          // Save the complete assistant message to the context
          const assistantMessage: Message = {
            role: 'assistant',
            content: accumulatedResponse,
            timestamp: new Date().toISOString()
          };
          chatStore.addMessage(chatId, assistantMessage);
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Chat-Id': chatId,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
