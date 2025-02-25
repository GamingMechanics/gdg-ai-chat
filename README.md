This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and then modified to be a simple AI chat application using GitHub Copilot with Claude 3.5 Sonnet.

It was coded live during the [GDG Douglas](https://gdg.community.dev/gdg-douglas/) event ["ChatGPT, But in Your Shed"](https://gdg.community.dev/events/details/google-gdg-douglas-presents-chatgpt-but-in-your-shed/) on the 25th of February 2025.

The slides for the presentation are available [here](https://docs.google.com/presentation/d/1eH_1hcx_eRyihGw-T8toNfBFINa7YdTHks8MEJgcMiU/edit?usp=sharing).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running Ollama locally

This app expects Ollama to be running locally and to have the `llama3.2` model pre-downloaded.
To do so, [download Ollama](https://ollama.com/) for your operating system, then run `ollama serve` to start the Ollama server, then `ollama pull llama3.2` to download the model.

## The AI prompts

These are the prompts we used during the presentation to build the application:

- Change the home page to a UI appropriate for a chat between the user and an AI agent, with an input field for the user and a button to send the message and an area above that to show the chat's history.
- Create an API route to send the message to when the user sends a message and gets a reply from the assistant. For now, just make it a fake hard-coded reply.
- Using Ollama with the `llama3.2` model, send the message to the ollama server and get a response back to send to the user.
- In the terminal, we ran this one manually: `npm install --save ollama`
- Change the ollama service to use the ollama npm package.
- Change the ollama service, the chat api route and the page so that the response from Ollama is streamed.
- In the page, keep an `accumulatedResponse` variable with the stream content to set it at the end when the final stream content is done.
- In the chat API route, let's assign an id for the chat if it doesn't already have one sent by the page, and keep an in-memory context of the entire chat based on its id.
- Can we keep the singleton instance of the chat store in the global space?
- Can we change the `generateStreamingResponse` in the Ollama service to take in the entire chat so that the response considers context?

Throughout the build, we noticed the AI constantly changing the model from `llama3.2` to `llama2`, which we had to keep correcting.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
