---
keywords:
  - Firebase
  - 開発
---

# Stripe と Firebase で集金ページを作る

この記事は [CAMPHOR- Advent Calendar 2018](https://advent.camph.net/) 17日目の記事です。

[morishin](https://scrapbox.io/morishin/morishin) です。今月イベントを主催して参加費を集金する機会があったのですが、当日会場で受付を用意して集金する手間を省くために、参加者には事前決済をお願いしました。そこで決済手数料や出金手数料、また参加者の支払いにかかる手間の少ない手段を検討し、Stripe と Firebase で集金ページを作成し、そこからクレジットカードで決済してもらうという形を取りました。この記事ではその集金ページの作り方を紹介したいと思います。

リポジトリはこちらです。Firebase と Stripe のアカウントを用意して README の手順を踏めばどなたでも集金ページを立ち上げることができます。

https://github.com/morishin/payme

【目次】

[:contents]


---


## 集金ページの仕様
PayPal に [PayPal.Me](https://www.paypal.me/) というサービスがあって、`https://paypal.me/<ユーザー名>/<金額>` という URL で特定のユーザーに特定の金額を支払うページをシェアすることができるのですが、そのサービスを真似して URL で決済金額を指定して決済を行えるサービスを作りました。PayPal.Me と同じならそれ使えばええやんなんですが、PayPal は決済をする側が PayPal アカウントを持っている必要があるのに加え手数料が少し高いので Stripe で作ることにしました。

URL の末尾で金額を指定してページを開くとこのような画面で、

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173243.png" width="512" height="359" loading="lazy" />

決済ボタンを押すとクレジットカード情報の入力画面が出てきて指定の金額を支払うことができます。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173308.png" width="512" height="502" loading="lazy" />

## 構造
決済ページは静的なウェブページで、Firebase Hosting で配信します。S3 でもなんでもいいんですが Cloud Function とかも使いたいので Firebase に乗せるのが楽でしょう。ウェブページ上のフォームにユーザーが決済情報を入力すると Stripe のサーバーに送信され、決済処理に利用するトークンを受け取ります。そのトークンをもって Cloud Function の HTTP トリガを叩くと、Cloud Function が Stripe を叩いて決済処理を行います。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173322.png" width="512" height="315" loading="lazy" />

クレジットカード情報を入力して Stripe からトークンを受け取る処理は [Stripe が用意している SDK](https://stripe.com/docs/stripe-js/elements/quickstart) をそのまま利用可能なので自分で実装するのはちょっとだけです。

それでは具体的な作り方を見ていきましょう。

## 作り方
### 1. Firebase Project の作成
[公式ドキュメント](https://firebase.google.com/docs/hosting/quickstart?hl=ja) の通りに Firebase CLI をインストールしてプロジェクトを新規生成します。
`firebase init` を叩いて、今回は Functions と Hosting を利用するので画像のように選択してセットアップを進めます。

(僕のターミナルのフォントがアレでせっかくのロゴがかわいそうな感じに)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173337.png" width="512" height="184" loading="lazy" />

なんか他にも色々聞かれますが[いい感じに](https://i.gyazo.com/71f03f9ebefbdb9f747f70209189b998.png)答えるとセットアップが完了し、Firebase ウェブコンソールからプロジェクトを作成して `firebase use --add` しろと言われます。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173347.png" width="512" height="165" loading="lazy" />

Firebase のコンソールをブラウザで開いてプロジェクトを好きな名前で作成します。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173359.png" width="363" height="512" loading="lazy" />

作ったらさっき `firebase init` して作ったディレクトリで `firebase use --add` してプロジェクトを紐付けます。

これでコードを書いて `firebase deploy` したらデプロイされる環境が整いました。

あと Cloud Function から Google サービス外へネットワークリクエストを送信するには Blaze プランにアップグレードしておく必要があるので設定しておきます。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173410.png" width="512" height="395" loading="lazy" />

### 2. Stripe の登録と API キーの取得
決済には Stripe を利用するので登録してコンソールから API キーを取得しておきます。キーにはテスト用と本番用がありますが、まずはテスト用のキーを使います。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173425.png" width="512" height="206" loading="lazy" />

### 3. ウェブページの実装
Firebase Hosting で配信するページを `public/index.html` に記述します。やることは決済ボタンを押したら Stripe のコンポーネントを表示して、トークンを受け取ったら Cloud Function を叩くだけなのでこれだけのシンプルな記述です。HTML ファイルにベタ書きしちゃいました。先ほど取得した Stripe API の公開鍵はこのソース内に貼り付けておきます。

https://github.com/morishin/payme/blob/master/public/index.html

```html
<body>
  <div id="message">
    <h2>Welcome</h2>
    <h1>Payment Example App</h1>
    <p>Click the button below to pay me</p>
    <a id="button" arget="_blank" href="https://firebase.google.com/docs/hosting/">Pay me</a>
  </div>

  <script>
    const STRIPE_PUBLIC_KEY = "YOUR_STRIPE_PUBLIC_KEY"; // TODO: PUT YOUR STRIPE PUBLIC KEY HERE
    const CHARGE_CLOUD_FUNCTION_TRIGGER_URL =
      "YOUR_CLOUD_FUNCTION_TRIGGER_URL"; // TODO: PUT YOUR FIREBASE FUNCTIONS URL HERE
    const DEFAULT_AMOUNT = 50;
    const AMOUNT_LIMIT = 1000000;
    const CURRENCY = "JPY";
    const requestCharge = async (token, amount, currency) => {
      const res = await fetch(CHARGE_CLOUD_FUNCTION_TRIGGER_URL, {
        method: "POST",
        body: JSON.stringify({
          token,
          charge: {
            amount,
            currency
          }
        })
      });
      const data = await res.json();
      data.body = JSON.parse(data.body);
      return data;
    };
    document.addEventListener("DOMContentLoaded", () => {
      const amount = Math.min(parseInt(location.pathname.substring(1), 10) || DEFAULT_AMOUNT, AMOUNT_LIMIT);
      const handler = StripeCheckout.configure({
        key: STRIPE_PUBLIC_KEY,
        locale: "auto",
        token: async token => {
          let res = await requestCharge(token, amount, CURRENCY);
          if (res.body.error) {
            console.error("Error: Failed to pay");
            console.error(res.body.error);
            return;
          }
          console.log("Success: Thank you");
        }
      });
      document.querySelector("#button").addEventListener("click", e => {
        e.preventDefault();
        handler.open({
          image: "https://g.morishin.me/icon.png",
          name: `Pay me ${CURRENCY} ${amount}`,
          amount,
          currency: CURRENCY,
          billingAddress: true,
          allowRememberMe: false
        });
      });
      document.querySelector("#button").innerText = `Pay me ${CURRENCY} ${amount}`;
    });
  </script>
</body>
```

### 4. 決済処理を行う Cloud Function の実装
Stripe API を叩いて決済処理を行う Cloud Function を `functions/src/index.ts` に記述します。メインの処理は `charge` の部分で、 `Functions.config().stripe.token` で取得した Stripe API キーの秘密鍵と、決済金額、領収書の送付先メールアドレスなどを渡して API を叩き、決済が正常に完了したら 200 を返して終了します。秘密鍵は 2. で Stripe のウェブコンソールで確認したもので、CLI から `firebase functions:config:set stripe.token="SECRET_KEY"` で設定します。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173449.png" width="512" height="50" loading="lazy" />

https://github.com/morishin/payme/blob/master/functions/src/index.ts

```typescript
import * as Functions from "firebase-functions";
import * as Admin from "firebase-admin";
import * as CORS from "cors";
import * as Stripe from "stripe";

Admin.initializeApp(Functions.config().firebase);

const charge = (request: Functions.Request, response: Functions.Response) => {
  const body = JSON.parse(request.body);
  const token = body.token.id;
  const email = body.token.email;
  const amount = body.charge.amount;
  const currency = body.charge.currency;

  // TODO: Remember to set token using >> $firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
  const stripe = new Stripe(Functions.config().stripe.token);
  stripe.charges
    .create({
      amount,
      currency,
      description: "payme",
      source: token,
      receipt_email: email
    })
    .then(charge => {
      send(response, 200, {
        message: "Success",
        charge
      });
    })
    .catch(error => {
      console.error(error);
      send(response, 500, {
        error: error.message
      });
    });
};

function send(response: Functions.Response, statusCode: number, body: any) {
  response.send({
    statusCode,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body)
  });
}

exports.charge = Functions.https.onRequest((request, response) => {
  const CORSRequestHandler = CORS({ origin: true });
  CORSRequestHandler(request, response, () => {
    if (request.method !== "POST") {
      send(response, 405, { error: "Invalid Request" });
    }
    try {
      charge(request, response);
    } catch (e) {
      console.log(e);
      send(response, 500, {
        error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`
      });
    }
  });
});
```

### 4. デプロイ
CLI から `firebase deploy --only functions` で Cloud Functions をデプロイします。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173504.png" width="512" height="207" loading="lazy" />

Cloud Functions のデプロイが完了するとウェブコンソールの Functions ページにデプロイした関数と、その HTTP トリガのエンドポイントが記載されています。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173517.png" width="512" height="202" loading="lazy" />

この URL を決済ページの HTML 内の `CHARGE_CLOUD_FUNCTION_TRIGGER_URL` に貼り付けたら、 `firebase deploy --only hosting` で Hosting もデプロイしましょう。デプロイが完了したらコンソールに Hosting のウェブサイトの URL が出てくるので、ブラウザで開いてサイトを確認しましょう。URL の末尾の数字で支払い金額を指定できます。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173531.png" width="512" height="359" loading="lazy" />

### 5. 動作確認
テスト環境の API キーを設定しているのでテスト用のクレジットカード情報で決済の動作確認ができます。[ドキュメント](https://stripe.com/docs/testing#cards)にあるテスト用のカード情報を使って、実際に決済してみましょう。

(氏名や住所入力は実装時のオプションで省けたりします)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173544.png" width="512" height="502" loading="lazy" />

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173551.png" width="512" height="349" loading="lazy" />

処理が正しく実行されると Stripe コンソールの支払いのページに完了した決済情報が表示されます。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20181215/20181215173600.png" width="512" height="323" loading="lazy" />

### 6. 本番移行
動作が確認できたら API キーを本番用に置き換えたものを設定して完成です🎉

## 注意点
- これで自分への投げ銭ページを作りたくなりますが、何らかの商品に対価を払うという形でなく、単に投げ銭ができるページというのは今の日本のルール的にはアウトらしいのでご注意ください
- Visa とかは対応してるんですが JCB カードを利用可能にするには別途申請が必要なようです
- Cloud Function の HTTP トリガはパブリックなインターネットに公開されていてエンドポイントもウェブページソース内から見れちゃうので悪い人が叩きまくることができます。いたずらされると Firebase への課金額が膨らみそうなので何らかの対策はした方が良さそうです。

## おわりに
このシステムによって無事にイベントの集金を事前決済で行うことができ、手数料も既存のサービスより抑えることができました。Stripe は SDK やドキュメントが大変整っており、最高最高と言いながらシュッと実装することができました。Firebase も本当に便利で、これぐらいの用途なら無料で使うことができるし、Hosting には独自ドメインも設定できるし、文句なしでした。ただ Cloud Functions の開発はちょっとつらくて、テストむずいしデプロイも異常に遅いことが稀によくありしばしば消耗しました。

いかがでしたでしょうか。世の中には色んな決済サービスがあり便利に利用できますが、手数料や決済の手間が気になる方は、ぜひこの記事を参考により良い決済ページを自作してみてはいかがでしょうか。

[CAMPHOR- Advent Calendar 2018](https://advent.camph.net/) の明日の担当は[ぷらす](https://mobile.twitter.com/plus_kyoto)です。お楽しみに。😉👋
