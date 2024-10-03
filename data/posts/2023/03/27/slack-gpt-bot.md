---
keywords:
  - 開発
---

# Slack の次世代プラットフォームで作る ChatGPT Bot

Slack がベータ公開 (2023年時点) している[次世代プラットフォーム](https://api.slack.com/future/intro)を使って ChatGPT Slack bot を作りました。bot へメンションすると ChatGPT API を叩いて返答してくれます。

これだけの機能の bot なら多くの人が作っていて github.com 上でもコードが散見されますが、今回作ったものには次の機能があります。ワイが作ったやつが一番ようできとる。

- ファイルに固定値で指定したチャンネルだけでなく、後から任意のチャンネルに bot を追加できる
- Slack Datastores に会話履歴を保存することで、一連の会話をまるっと ChatGPT API に投げられるため文脈を理解して返答してもらえる
- ChatGPT API に渡す [system message](https://platform.openai.com/docs/guides/chat/introduction) を bot が動くチャンネル毎に設定できて、後からでも変えられる

---

<img src="https://i.gyazo.com/5278aaa899f345794c24363b056b69be.png"/>

詳しい導入の仕方や設定の仕方はリポジトリの README に書いています。アイコンとか名前は好きに変えてご利用ください💁‍♀️

https://github.com/morishin/slack-chatgpt-bot

## 機能説明

### bot を動かすチャンネルの設定

bot がメンションを受け取った時に何かアクションをさせようと思うと Event Trigger を使う必要がありますが、これはトリガーの作成時に bot がメンションを受け取れるチャンネルのリスト (`channel_ids`) を指定する必要があるため、[トリガー定義をファイルに記述する方式](https://api.slack.com/future/triggers/event#create-trigger-file)だと後からチャンネルリストを変更することができません。

そのため今回は[トリガーをランタイムで作成/更新する方式](https://api.slack.com/future/triggers/event#create-runtime)を採用しました。複数チャンネルを選択するモーダルを表示し、そこでユーザーが選択するとその `channel_ids` で Event を更新 (無ければ作成) する Function を実装しています。
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_channels_modal/configure_channels_modal_function.ts#L26-L65

### 会話履歴の保持

bot はメンションを受け取る度に Event Trigger が発火し、[ReplyWorkflow](https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/workflows/reply_workflow.ts) が実行され、ワークフローの中で

1. 受け取ったメッセージを `{ "role": "user", "content": "<受け取ったメッセージ>" }` として Datastore に保存
1. system message とこれまでの会話履歴と今回受け取ったメッセージを合わせて ChatGPT API に投げる
1. ChatGPT API から受け取った返答を Slack チャンネルにポストする
1. 返答を `{ "role": "assistant", "content": "<ChatGPT API の返答>" }` として Datastore に保存

というステップを踏んでいます。
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/workflows/reply_workflow.ts#L17-L50

Slack の Datastores は Amazon DynamoDB で、JS のオブジェクト型のような構造のデータもそのまま突っ込めます。このアプリで保持するデータは primary key を `channelId` として次のような構造にしました。

```typescript
{
  channelId: string,
  latestMessages: { role: "user" | "assistant" | "system" }[]
}
```

メッセージを保存する Function の実装: https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/put_message_history/put_message_history_function.ts

直前の発言を覚えて返答してくれています。

<img src="https://user-images.githubusercontent.com/1413408/227261586-f7ff30e0-cfb9-4a27-a277-3f5dd0e72d80.png"/>

### system message の設定

**system message** は Chat API へリクエストする際に渡す bot への指令のようなもので、[次の例](https://platform.openai.com/docs/guides/chat/introduction)の `You are a helpful assistant.` の部分です。

```json
[
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "Who won the world series in 2020?"},
  {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
  {"role": "user", "content": "Where was it played?"}
]
```

API に投げるメッセージを作っている箇所: https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/generate_reply/generate_reply_function.ts#L36-L42

この system message に何を指定するかで bot の挙動が大きく変わるため Slack Workflow から柔軟に変更できるようにしています。

<img src="https://i.gyazo.com/b41950c3724965b2266fd2362dee1d74.png" width="500"/>

このモーダルで設定した内容は Slack のプラットフォーム上の Datastores に保存されます。
https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L68-L76


## 作ったモチベ

ChatGPT は流行っていて面白い使い方とか Twitter でもよく見かけるけど、ネタ用途を超えて実際の業務や生活に役立てられている人は多くない。chat.openai.com にアクセスしたら全人類が触れるのだけど、英語のサイトだしなんだかんだ社内でもエンジニアや新しいモノ好きな人たちしか触っていないから、かわいい人格の Slack bot にして全員が気軽に触れるようにし、ChatGPT の活用イメージを持ってもらおうと思ったのが動機でした。

## Slack の次世代プラットフォームへの感想

### 良かったところ

- インフラを自分で用意しなくていい
- それなのにデータストアまである
- Deno は TypeScript をそのまま実行できるし format や lint も標準装備で開発体験が良い
- 開発中のホットリロード
- SDK の型付けが丁寧
- Slack CLI が使いやすい

### いまいちだったところ

- 有料プランのワークスペースでしか使えない
- slack env で設定する秘匿値は Function からしか読めない。Manifest や Workflow でも使いたいし普通に Deno.env から読めるようにして欲しい。
- dev アプリにはアイコンが反映されない
- Datastore から読み出した `item` にはややこしい型が付いてるのに `item.<プロパティ>` を読み出すと全部 any になってた (例: https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L44)
- Built-in の `OpenForm` Function は便利だけど Workflow の first step で呼び出さなければならないという[制約](https://api.slack.com/future/functions#open-a-form:~:text=must%20be%20the-,first%20step,-in%20the%20workflow)があった。フォームのフィールドにデータストアから読み出した値を埋めて表示したりしたかったので first step に置くことができず、[自前で `OpenForm` 同等の Function](https://github.com/morishin/slack-chatgpt-bot/blob/aace92b4cc361620d4fad073e859e62cf645eed3/functions/configure_system_message_modal/configure_system_message_modal_function.ts#L46-L162) を定義する羽目になった。
- [App Home](https://api.slack.com/lang/ja-jp/app-home-with-modal) はまだ作れない。(最初は bot の設定画面を App Home に作ろうとしてた)

## ChatGPT への感想

API の従量課金には $18 の無料枠があるからとりあえず無料でお試しできてうれしかった。

https://twitter.com/morishin127/status/1639422439682871296
