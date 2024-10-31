---
keywords:
  - 開発
  - Deno
---

# ChatGPTのFine-tuningで自分のツイートを学習させてbotに自分っぽいツイートをさせる

ChatGPT は独自のデータを学習させる [Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset) の API を用意してくれているので、それを使って自分の過去のツイートを学習させ、自分を模したツイートをする bot を作りました。[v2 がリリースされたてほやほや](https://deno.com/blog/v2.0)の Deno で書いて Deno Deploy (Deno Cron) で動かしています。

https://github.com/morishin/morishin-bot

https://x.com/morishin_bot/status/1851972406732009746

---

## 背景

過去に同じコンセプトの bot をマルコフ連鎖を使った文章生成のプログラムで実現していましたが、現代ではマルコフ連鎖よりも生成AIの方がそれっぽくて面白い文章を作ってくれると思ったので v2 として作り直しました。

過去のエピソードはこのへんとかこのへん。

https://blog.morishin.me/posts/2016/03/06/haskell-poem-generator

https://ryota-ka.hatenablog.com/entry/2016/05/09/001103

## できたもの

新しい bot は @morishin127 の過去ツイートを1000件ほど学習して、@morishin127 っぽいツイートをしてくれと指示しています。肝心のクオリティは、、口調はそれっぽいですが内容は支離滅裂です。期待以上の滅裂で割と気に入っています。

https://x.com/morishin_bot/status/1851853376340033891

https://x.com/morishin_bot/status/1851864841482572106

https://x.com/morishin_bot/status/1851854731410538942

## 実装

OpenAI の[ガイド](https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset)によると Fine-tuning に使う学習データはこのような対話形式である必要があります。

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```

なので自分の過去ツイートをこのように整形して学習データとしました。https://github.com/morishin/morishin-bot/blob/main/modeler/main.ts#L31-L55

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
          "あなたはmorishin_botというXのbotアカウントです。まるで本物のmorishinかのようなツイートをしてください。@の付いたメンションやURLを含むツイートは避けてください。",
      },
      {
        role: "user",
        content: `現在の日時は${formattedDateTime}です。本物のmorishinかのようなツイートを一つしてください。`,
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

「現在の日時は〜」という情報を与えているのは、bot といえど季節感のあるツイートを心がけてほしいからです。このねらいは案外うまくいったようで、先ほど掲載したツイート例にはハロウィンの話題が含まれていました。

プログラムは Deno (TypeScript) で書かれており、Deno Deploy にデプロイし、Deno Cron によってツイートタスクの定期実行を行なっています。

リポジトリはモノレポ (Workspace) になっており、tweets.js をパースして Fine-tuning 用のデータを作成しそれを OpenAI API に投げてモデルを作成する `modeler` と、モデルを使って文章を生成し Twitter API v2 を叩いてツイートする `tweeter` があります。

Deno + Deno Deploy にしたのは OpenAI ライブラリ ([openai-node](https://github.com/openai/openai-node)) が使えてデプロイや定期実行ジョブの設定が一番楽ちんという理由です。Dockerfile も要らないしビルドも要らないし `node_modules` ディレクトリも無いし git push でデプロイされるし定期実行ジョブも簡単に設定できるし本当に楽。ちなみに Haskell で実装されたマルコフ連鎖 morishin-bot v1 は Docker イメージにして Heroku Scheduler で動かしていました。

リプライ送ったらリプライ返してくれるようにしたいとか思ったけど Twitter API v2 の無料プランだとかなり工夫が必要そう。
