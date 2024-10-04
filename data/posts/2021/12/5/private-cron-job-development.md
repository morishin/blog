---
keywords:
  - AWS
  - 開発
---

# ご家庭を支える定期実行ジョブの開発フロー

この記事は [CAMPHOR- Advent Calendar 2021](https://advent.camph.net/) の5日目の記事です。

CAMPHOR- Advent Calendar には初回の2014年から参加していて8度目の参加になります。老ですね。

今回は私生活でしばしば必要になって作っている家庭内タスクのリマインダーのお手軽構築スタイルを紹介します。

さて、僕は家庭内のコミュニケーションツールとして主に [Slack](https://slack.com/) と [Snapchat](https://www.snapchat.com/) を利用しています。日常会話は Slack で、子ども・猫の様子やその他日常の風景を動画で共有するのに Snapchat を使います。Snapchat は大好きなのですが今はその話は置いておいて、家庭内タスクのリマインド通知先としても Slack が最適なので色々な通知を Slack に流しています。

<figure class="figure-image figure-image-fotolife" title="家庭内コミュニケーションの様子"><img src="https://i.gyazo.com/41474ab4a448bf950cc7a5f976e5849c.png" width="424" height="170" /><figcaption>家庭内コミュニケーションの様子</figcaption></figure>

この記事では毎週決まった時刻に締め切りのある、生協のネット注文のリマインダーを例にして構築手順を説明します。

---

## 例: 生協のネット注文のリマインダー

<img src="https://i.gyazo.com/a357e1c9522343999a25f18ddae3632a.png" width="512"/>

画像のような通知を毎週決まった時刻にポストしています。定型文の定期ポストであれば Slackbot を使えばノーコードで実現できますが、お届け日の日付文字列を毎回異なったものにしたかったりするので自分で簡単なコードを書かなければなりません。任意のプログラムを定期実行させる方法はいくつかありますが、AWS Lambda と AWS EventBridge (旧 CloudWatch Events) を使うのが楽だと思っていて、さらに Lambda レイヤーや AWS コンソール上のエディタも合わせて利用することで**ブラウザ上の操作だけで開発を完結させる**ことができて最高なのでそのスタイルを紹介します。いやいや個人ミニアプリでもインフラストラクチャアズコードで継続的デリバリーや！という方のために手元でソースコードを書いて git 管理して AWS CDK でデプロイを行うスタイルも後半で紹介しようと思います。

(ちなみに画像の noru くんはウチの猫1号で、とてもかわいいです。詳しくは: https://scrapbox.io/morishin/Cats )

## ブラウザで完結させる編

### 関数の作成

AWS コンソールにログインして Lambda のページを開き「関数を作成」をクリックすると関数のエディタ画面が開きます。そこから

1. ブラウザ内エディタでコードを書く
1. 「トリガーを追加」から EventBridge を選択し、ルールを「スケジュール式」にして cron 文を設定する

とするだけで定期実行 Lambda 関数が完成します。生協のネット注文リマインダの完成形はこのようになります。

<img src="https://i.gyazo.com/4b75ea3a9487b8f2b7cdd522ff7d38d2.png" width="640"/>

### Lambda レイヤーでモジュールを使い回す

画像の実装コードを見るといくつかの依存ライブラリがあります。

```javascript
const axios = require('axios')
const querystring = require('querystring')
const format = require('date-fns/format');
const addDays = require('date-fns/addDays')
```

これらは個人的によく使うライブラリ群なのですが、こういう頻出パッケージをインストールした node_modules を zip で固めて Lambda レイヤーとしてアップロードして置いておくと、AWS コンソールの Lambda 関数エディタでそのレイヤーを選択するだけでインポートできるようになり、真にブラウザ上で開発が完結するようになって便利です。

### 関数の実装

Lambda 関数本体の実装は説明不要なほどシンプルですが、生協の注文ページへのリンクになった文字列とその回のお届け日付の文字列を含んだテキストを Slack の Incoming Webhook でポストしています。

```javascript
exports.handler = async (event) => {
  const text = `<!channel> 【明日10時〆切】<https://ouchi.ef.cws.coop/auth/bb/login.do|おうちコープ>注文した？【${format(
    addDays(new Date(), 6),
    "M月d日お届け分"
  )}】`;

  await axios.post(
    "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXxx",
    { text }
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };
  return response;
};
```

### できあがり

これで完成で cron 文で指定したタイミングで Slack に通知されるようになります。Lambda レイヤーさえ用意しておけばあとはブラウザ上でポチポチして10行ほどコードを書いたら完成するのでとてもお手軽ですね。TypeScript でなくバニラな JavaScript でしか書けないのがちょっとアレなので Go とかの方が書きやすいかもですが、これぐらい単純な内容ならなんでもいいかな。

## AWS CDK 編

上述のようにブラウザでピャピャッとやっちゃうのが好きですが、やっぱりコードは手元で書いて GitHub にプッシュして自動的にデプロイして欲しいという気持ちもわかります。同じアプリケーションを例に AWS CDK を使ってデプロイするスタイルも紹介したいと思います。

Lambda 関数の実装は TypeScript で行い、インフラ構成は AWS CDK で定義し、GitHub Actions でデプロイを行います。ここで紹介するソースコードはこちらのリポジトリにありますので適宜ご参照ください。

https://github.com/morishin/slack-cron-bot-example

### ディレクトリ構成

ディレクトリ構成はこのようになっていて、`@aws-cdk/aws-lambda-nodejs` のドキュメントにあった `Reference project architecture` に倣っています。

```txt
slack-cron-bot-example
├── .env.local
├── .github
│  └── workflows
│     └── deploy.yml
├── .gitignore
├── .npmignore
├── bin
│  └── slack-cron-bot.ts
├── cdk.json
├── jest.config.js
├── lib
│  ├── app
│  │  └── postMessage.ts
│  ├── slack-cron-bot-stack.post.ts
│  └── slack-cron-bot-stack.ts
├── package-lock.json
├── package.json
├── README.md
├── test
│  └── slack-cron-bot.test.ts
└── tsconfig.json
```

ドキュメントによると

>The `NodejsFunction` allows you to define your CDK and runtime dependencies in a single package.json and to collocate your runtime code with your infrastructure code.

とのことですが、個人的には runtime code と infrastructure code はなるべく互いに依存しないように分離させたいです😓 ですが今回は AWS おすすめの形をとっています。

### 実装

`cdk init app --language=typescript` した状態から手を加えたのは次の3ファイルだけです。

- `lib/app/postMessage.ts`: Slack にポストする機能の実装コード
- `lib/slack-cron-bot-stack.ts`: CDK Stack の定義
- `lib/slack-cron-bot-stack.post.ts`: Lambda ハンドラの実装

[`lib/app/postMessage.ts`](https://github.com/morishin/slack-cron-bot-example/blob/main/lib/app/postMessage.ts) は Slack の Incoming Webhook URL にメッセージを POST しているだけです。

[`lib/slack-cron-bot-stack.post.ts`](https://github.com/morishin/slack-cron-bot-example/blob/main/lib/slack-cron-bot-stack.post.ts) は Lambda ハンドラの実装ですが `postMessage` を呼び出しているだけです。

```typescript
import { postMessage } from "./app/postMessage";

export const handler = async (_event: any, _context: any) => {
  await postMessage();
};
```

CDK Stack を定義している [`lib/slack-cron-bot-stack.ts`](https://github.com/morishin/slack-cron-bot-example/blob/main/lib/slack-cron-bot-stack.ts) を見ていきましょう。このようになっています。

```typescript
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as dotenv from "dotenv";

export class SlackCronBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 環境変数を .env.local ファイルから読み込み。開発環境でのみ利用されるもので、GitHub Actions 上での実行ではファイルが無いため何もしない。
    dotenv.config({ path: ".env.local" });

    // Lambda 関数の作成
    const handler = new lambda.NodejsFunction(this, "post", {
      environment: {
        SLACK_INCOMING_WEBHOOK_URL:
          process.env.SLACK_INCOMING_WEBHOOK_URL ||
          "Please set SLACK_INCOMING_WEBHOOK_URL",
      },
    });

    // EventBridge (関数実行スケジュールの作成)
    const target = new targets.LambdaFunction(handler);
    const scheduleExpression =
      process.env.SCHEDULE_EXPRESSION || "cron(0 3 * * ? *)";
    new events.Rule(this, "rule", {
      schedule: events.Schedule.expression(scheduleExpression),
      targets: [target],
    });
  }
}
```

ソースコード中にコメントを書いていますが Lambda 関数を作成して、EventBridge の関数呼び出しトリガーのルールを作成しています。ここで `process.env.*` として参照されている環境変数は実行環境である GitHub Actions の Actions secrets に設定されたものが読まれます。

<img src="https://i.gyazo.com/684a674ab0f167d05d28e3766f25b784.png" width="512"/>

CDK Stack はインフラ構成を定義するものですが YAML や JSON と違い普通のプログラミング言語なので [dotenv](https://github.com/motdotla/dotenv) のようなパッケージも使うことができて便利ですね。補完も効くし、テストも書けるし(このリポジトリではテストは書いてないですが！)。

### デプロイ

GitHub Actions としてのデプロイジョブを [.github/workflows/deploy.yml](https://github.com/morishin/slack-cron-bot-example/blob/main/.github/workflows/deploy.yml) に定義しています。

```yaml
name: CDK deploy

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    name: CDK deoloy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2.4.1
        with:
          node-version: "14"
      - name: Setup AWS CDK
        run: npm install -g aws-cdk@1.134.0
      - name: Setup Dependencies
        run: npm ci
      - name: CDK deploy
        run: cdk deploy --require-approval never
        env:
          AWS_DEFAULT_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SLACK_INCOMING_WEBHOOK_URL: ${{ secrets.SLACK_INCOMING_WEBHOOK_URL }}
```

`main` ブランチにプッシュされたら `cdk deploy` をやってくれます。TypeScript のトランスパイルなどはどこでやってんのと思ったかもしれませんが、

>The NodejsFunction construct creates a Lambda function with automatic transpiling and bundling of TypeScript or Javascript code.

とあるので `@aws-cdk/aws-lambda-nodejs` が中でやってくれてるみたいですね。べんり〜。細かいですが対話環境ではないリモートマシン上での `cdk deploy` では `--require-approval never` オプションをつけないと止まっちゃうので注意してください。`env:` で指定している環境変数は GitHub Actions の Actions secrets で設定されたものが読み出されます。

### できあがり

デプロイジョブが実行されると AWS 上にリソースが作成され、ブラウザでコンソールを開くとこのようになっています。

<img src="https://i.gyazo.com/e55767ff68ab5ed3c0619fb73a0ce6b3.png" width="640"/>

## おわりに

ご家庭でしばしば必要になる定期実行ジョブを簡単に作る方法について2通りやり方を紹介しました。あくまでご家庭用なので前者の方法でサクッと作るのが楽に違いありませんが、外で複数人で開発するようなシーンでは後者の方法を取るのが良いですね。みなさまのご家庭でも Slackbot で実現できないちょっと凝ったメッセージを Slack に通知したい場面がありましたらお試しください😉
