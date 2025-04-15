---
keywords:
  - 開発
---

# Creating a ChatGPT Bot on Slack's Next-Generation Platform

I created a ChatGPT Slack bot using Slack's [next-generation platform](https://api.slack.com/future/intro), which is in beta as of 2023. When you mention the bot, it calls the ChatGPT API and provides a response.

While many people have created bots with similar functionality, and you can find code on github.com, the one I made has the following features. Mine is the best!

- You can add the bot to any channel later, not just the channel specified with fixed values in the file.
- By saving conversation history in Slack Datastores, you can send a complete series of conversations to the ChatGPT API, allowing it to understand the context and respond appropriately.
- You can set the [system message](https://platform.openai.com/docs/guides/chat/introduction) passed to the ChatGPT API for each channel where the bot operates, and you can change it later.

---

<img src="https://i.gyazo.com/5278aaa899f345794c24363b056b69be.png"/>

You can find detailed instructions on how to set it up in the repository's README. Feel free to change the icon and name as you like 💁‍♀️

https://github.com/morishin/slack-chatgpt-bot

## Feature Explanation

### Setting Up the Channel for the Bot

If you want the bot to perform an action when it receives a mention, you need to use Event Triggers. However, when creating a trigger, you must specify a list of channels (`channel_ids`) where the bot can receive mentions, which means you cannot change the channel list later if you use the [file-based trigger definition method](https://api.slack.com/future/triggers/event#create-trigger-file).

Therefore, this time I adopted the [runtime trigger creation/updating method](https://api.slack.com/future/triggers/event#create-runtime). I implemented a function that displays a modal for selecting multiple channels, and when the user selects them, it updates (or creates if it doesn't exist) the Event with those `channel_ids`.
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_channels_modal/configure_channels_modal_function.ts#L26-L65

### Maintaining Conversation History

Every time the bot receives a mention, an Event Trigger is fired, and the [ReplyWorkflow](https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/workflows/reply_workflow.ts) is executed, which goes through the following steps:

1. Save the received message as `{ "role": "user", "content": "<received message>" }` in the Datastore.
2. Combine the system message, previous conversation history, and the newly received message, and send it to the ChatGPT API.
3. Post the response received from the ChatGPT API to the Slack channel.
4. Save the response as `{ "role": "assistant", "content": "<ChatGPT API response>" }` in the Datastore.

This is the process it follows.
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/workflows/reply_workflow.ts#L17-L50

Slack Datastores use Amazon DynamoDB, and you can directly store data structured like JS objects. The data retained by this app has the primary key as `channelId` and is structured as follows:

```typescript
{
  channelId: string,
  latestMessages: { role: "user" | "assistant" | "system" }[]
}
```

Implementation of the function that saves messages: https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/put_message_history/put_message_history_function.ts

It remembers the last statement and responds accordingly.

<img src="https://user-images.githubusercontent.com/1413408/227261586-f7ff30e0-cfb9-4a27-a277-3f5dd0e72d80.png"/>

### Setting the System Message

The **system message** is a directive to the bot that is passed when making a request to the Chat API, like the part in the following example: `You are a helpful assistant.`

```json
[
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "Who won the world series in 2020?"},
  {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
  {"role": "user", "content": "Where was it played?"}
]
```

The part of the code where the message to be sent to the API is created: https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/generate_reply/generate_reply_function.ts#L36-L42

Since what you specify in this system message can greatly change the bot's behavior, I made it flexible to change from the Slack Workflow.

<img src="https://i.gyazo.com/b41950c3724965b2266fd2362dee1d74.png" width="500"/>

The settings made in this modal are saved in the Datastores on the Slack platform.
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L68-L76


## Motivation for Creating This

ChatGPT is popular, and I often see interesting uses for it on Twitter, but not many people are using it in actual work or daily life beyond just for fun. While anyone can access chat.openai.com, it's an English site, and in many cases, only engineers and tech enthusiasts in the company are using it. I wanted to create a cute personality Slack bot that everyone could easily interact with and help them envision how to utilize ChatGPT, which was my motivation.

## Impressions of Slack's Next-Generation Platform

### Positive Aspects

- No need to prepare the infrastructure yourself.
- Yet, it even has a data store.
- Deno can run TypeScript directly, and it comes with format and lint tools, providing a good development experience.
- Hot reload during development.
- The SDK has thorough type definitions.
- The Slack CLI is user-friendly.

### Areas for Improvement

- It can only be used in paid plan workspaces.
- Secret values set in slack env can only be read from Functions. I want to use them in Manifest and Workflow as well, and it would be nice to be able to read them directly from Deno.env.
- Icons do not reflect in dev apps.
- The `item` read from the Datastore has a complicated type, and when reading `item.<property>`, it all becomes any (e.g., https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L44).
- The built-in `OpenForm` Function is convenient, but there is a [restriction](https://api.slack.com/future/functions#open-a-form:~:text=must%20be%20the-,first%20step,-in%20the%20workflow) that it must be called as the first step in the workflow. I wanted to fill in values read from the Datastore into the form fields, but since I couldn't place it as the first step, I had to define my own [Function equivalent to `OpenForm`](https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L46-L162).
- [App Home](https://api.slack.com/lang/ja-jp/app-home-with-modal) cannot be created yet. (Initially, I was trying to create the bot's settings screen in App Home.)

## Impressions of ChatGPT

I'm glad there is an $18 free tier for the pay-as-you-go API, allowing me to try it out for free.

https://twitter.com/morishin127/status/1639422439682871296