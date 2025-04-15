---
keywords:
  - 開発
  - Deno
---

# Fine-tuning ChatGPT to Learn My Tweets and Create a Bot That Tweets Like Me

ChatGPT provides an API for [Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset) that allows you to train it on your own data, so I used it to learn from my past tweets and created a bot that tweets in a style similar to mine. I wrote it in Deno, which has just had its [v2 release](https://deno.com/blog/v2.0), and it runs on Deno Deploy (Deno Cron).

https://github.com/morishin/morishin-bot

https://x.com/morishin_bot/status/1851972406732009746

---

## Background

In the past, I had implemented a bot with the same concept using a Markov chain-based text generation program, but I thought that modern generative AI could produce more realistic and interesting text than Markov chains, so I rebuilt it as v2.

You can find past episodes around here and here.

https://blog.morishin.me/posts/2016/03/06/haskell-poem-generator

https://ryota-ka.hatenablog.com/entry/2016/05/09/001103

## What I Created

The new bot has learned about 1000 of @morishin127's past tweets and is instructed to tweet like @morishin127. The quality is crucial; while the tone is somewhat similar, the content is quite incoherent. I actually like how incoherent it is, exceeding my expectations.

https://x.com/morishin_bot/status/1851853376340033891

https://x.com/morishin_bot/status/1851864841482572106

https://x.com/morishin_bot/status/1851854731410538942

## Implementation

According to OpenAI's [guide](https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset), the training data for Fine-tuning needs to be in a conversational format like this:

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```

So I formatted my past tweets into this structure for the training data. https://github.com/morishin/morishin-bot/blob/main/modeler/main.ts#L31-L55

```ts
tweets.forEach(({ tweet }: any) => {
  const tweetText = tweet.full_text;
  const date = new Date(tweet.created_at);
  const formattedDateTime = `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}時${date.getMinutes()}分`;
  const conversation = {
    messages: [
      {
        role: "system",
        content:
          "You are the X bot account called morishin_bot. Please tweet as if you were the real morishin. Avoid tweets that include mentions with @ or URLs.",
      },
      {
        role: "user",
        content: `The current date and time is ${formattedDateTime}. Please tweet one as if you were the real morishin.`,
      },
      {
        role: "assistant",
        content: tweetText,
      },
    ],
  };
  fineTuningData.push(conversation);
});
```

The reason for providing the information "The current date and time is ~" is that I want the bot to make tweets that reflect the season. This approach seems to have worked surprisingly well, as the tweet examples I shared earlier included topics related to Halloween.

The program is written in Deno (TypeScript) and is deployed on Deno Deploy, with tweet tasks being executed regularly by Deno Cron.

The repository is a monorepo (Workspace) consisting of `modeler`, which parses tweets.js to create data for Fine-tuning and sends it to the OpenAI API to create the model, and `tweeter`, which uses the model to generate text and calls the Twitter API v2 to tweet.

I chose Deno + Deno Deploy because it allows me to use the OpenAI library ([openai-node](https://github.com/openai/openai-node)), making deployment and scheduling jobs the easiest. There's no need for a Dockerfile, no builds required, no `node_modules` directory, and deployment happens with a simple git push, plus scheduling jobs is straightforward. It's really convenient. By the way, the previous version of morishin-bot, implemented in Haskell with a Markov chain, was running as a Docker image on Heroku Scheduler.

I thought about making it so that it replies to replies, but it seems that quite a bit of ingenuity is required under the free plan of the Twitter API.

## Update on 2024/11/2

I have tried to make it so that it retrieves replies received every 20 minutes and responds to them. I am saving only the ID of the last replied tweet in Deno KV to avoid replying to the same reply again. The 20-minute interval is due to the Twitter API's rate limit. Wow, the free plan is tough ^^;

https://x.com/morishin_bot/status/1852633746148917477