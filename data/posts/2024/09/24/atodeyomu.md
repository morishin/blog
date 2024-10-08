---
keywords:
  - 開発
  - React
---

# 「ato de yomu」というリーディングリストのWebアプリを作りました

「ato de yomu」(あとで読む) というリーディングリストのWebアプリを作りました。

https://atodeyomu.morishin.me/

リーディングリストというのが一般的な用語かわかりませんが、Safari についてるリーディングリスト機能のイメージです。ato de yomu には次の機能があります。

* あとで読みたいウェブの記事を保存しておける
* 読んだ記事の履歴を残せる
* 他人のリストを閲覧・購読できる

---

<figure class="figure-image figure-image-fotolife" title="アプリ画面"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924144235.png" width="600" height="545" loading="lazy" /><figcaption>アプリ画面</figcaption></figure>

僕のページはこれです。

https://atodeyomu.morishin.me/morishin


## 動機

### 未読管理ツールとして

インターネットで見かけた記事をあとで読もうと思って保存しておくことがよくあるのですが、Safari のリーディングリストはイマイチでした。iOS で Safari を使っている時ならサクッと追加できるのですが、PC で Chrome を使っている時だとそうもいきません。開くのも Safari からなので他のブラウザを使う生活にはフィットしませんでした。

ato de yomu は iOS ショートカットを利用することで iOS の共有シートから記事を追加できる上、記事追加 API を公開しているためユーザーの好むやり方で記事を追加することができます。僕は Alfred ヘビーユーザーなので Alfred Workflow も提供しています。

iOS 共有シート | Alfred Workflow
---- | ----
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924145653.jpg" width="355" height="339" loading="lazy" /> | <img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924145712.png" width="600" height="135" loading="lazy" />


### 情報収集ツールとして

もう一つはみんなが読んでるおもしろウェブ情報を知りたいというものでした。僕は新しい技術の情報に興味があるものの自分で情報をキャッチするのは上手ではなくたまたま𝕏に流れてきたものを眺めたり、https://jser.info/ のような個人が記事をまとめてシェアしてくれているメディアを見たりしていました。JSer.info は [azu](https://x.com/azu_re) さんという方が個人的にインターネットから収集した情報をシェアしてくださっているものですが、同じように周りのアンテナ感度の高いすご腕エンジニアのみなさんが自分の読んだ記事を発信していたら面白そうだなと思ったのがきっかけで、インターネットに公開できるリーディングリストという形にしました。自分が読んでいる記事を発信できます！っていうアプリを作っても発信側にメリットが無く使われる訳がないので、リーディングリストという使う側に実利のある形で自然に発信されることを狙っています。そんな狙い通りにいくかはわかりませんが、自分が自分用に使うためだけでも欲しいアプリだったので流行らなくてもそれもまたヨシ...。各ユーザーのページには RSS フィードの URL があり、リーダーアプリや Slack などで購読することができます。リーディングリストは非公開にすることもできるので、完全に自分用のリストとしてご利用いただくことも可能です。

## 技術的な話

フレームワークは Rails、Next.js、Remix、Hono あたりを検討して Next.js v15 (開発時点ではまだ RC) にしました。データベースは Supabase、アプリのデプロイ先は Vercel で、Vercel Blob (オブジェクトストレージ) も使っています。Cloudflare D1 が使いたくて最初は Hono + Cloudflare + D1 で開発し始めたんですが、React 19 (開発時点ではまだ RC) と Next.js の Server Actions の組み合わせに良さを感じて乗り換えました。

https://x.com/morishin127/status/1807593521396036039

https://x.com/morishin127/status/1807240643770728771

コンポーネントに async つけて直接 DB からデータ取ってくるインターフェース、すごいねんな。これを実現するため(だと僕が勝手に思い込んでいる)に、かなり複雑なものが出来上がっていて最近の React や Next.js は正直とっつきづらいとは思うのですが、僕は好きです。

<figure class="figure-image figure-image-fotolife" title="サーバコンポーネントを使用することで、コンポーネントの中で直接データを読み取ってレンダーできます。"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924154205.png" width="600" height="364" loading="lazy" /><figcaption>サーバコンポーネントを使用することで、コンポーネントの中で直接データを読み取ってレンダーできます。 (<a href="https://ja.react.dev/reference/rsc/server-components">出典</a>)</figcaption></figure>

[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) もすごくて、コンポーネントの中にバックエンドのロジック書いて、その関数を `<form>` の action に渡したら動くねんな。

<figure class="figure-image figure-image-fotolife" title="Server Actions の例"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924154655.png" width="600" height="400" loading="lazy" /><figcaption>Server Actions の例　(<a href="https://zenn.dev/uhyo/books/react-19-new/viewer/form-action#form%E3%81%A8server-actions%E3%81%A8%E3%81%AE%E9%96%A2%E4%BF%82">出典</a>)</figcaption></figure>

このへんが面白くて使ってみたくなったので結局 Next.js を使う運びとなりました。

データベースに何を使うかとスキーマ管理についても散々悩んだのですが、Postgres と Prisma を使い、schema.prisma を手書きするけど prisma のマイグレーション機能は使わずに [psqldef](https://github.com/sqldef/sqldef) を利用するという方式にしました。

https://x.com/morishin127/status/1808044296664502477

こういう感じのスクリプトでマイグレーションを実行しています。マイグレーションファイル無しでスキーマを宣言的に定義・管理できて最高になりました。

```sh
$ npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output db/schema.sql
$ psqldef -U $POSTGRES_USER -p $POSTGRES_PORT $POSTGRES_DATABASE --enable-drop-table < db/schema.sql
```

ソースはオープンにしているので、興味がある方はご覧ください。

https://github.com/morishin/atodeyomu.morishin.me

