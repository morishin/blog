---
keywords:
  - React
  - Rails
  - 開発
---

# 「買ってよかったもの」サイトを Heroku (Rails) から Vercel (Next.js) に移行しました

この記事は [CAMPHOR- Advent Calendar 2022](https://advent.camph.net/) の18日目の記事です。

2017年に「[買ってよかったもの](https://katteyokatta.morishin.me/)」というウェブサイトをリリースし運営していますが、リリースから5年経った今 PaaS 移行のため技術スタックも一新しフルスクラッチで書き直したのでその話をします。

ソースも公開しています。

https://github.com/morishin/katteyokatta.morishin.me

---

## 「買ってよかったもの」とは

「買ってよかったもの」は Amazon で買ってよかったものを投稿・共有するサービスです。自分が投稿した商品へのリンクは自分のアフィリエイトリンクにすることもできます。自分が気に入ったものを人に教えたり、知人が気に入っているものを教えてもらったりして生活の質を向上させることを目的としています。詳しくは[リリース記事](https://morishin.hatenablog.com/entry/release-katteyokatta)をご覧ください。

https://katteyokatta.morishin.me/

![](https://i.gyazo.com/b7edc6d526cdf3d90e68f96f41bc7b8f.png)

## Heroku 無料プラン終了に伴う移行検討

リリース記事で次のように述べていますが、元々は Rails アプリとして実装し Heroku にデプロイして動かしていました。またデータストアとして Postgres と Redis も Heroku のものを利用していました。

>サーバーやデプロイ手段はどうしようかな、やっぱり Docker 使うかな、クラウドサービスは GCP かな AWS かなとか考えてたけど、同僚に相談した結果 Heroku にドーンが安いし楽だし最高のようだったので Heroku にした。結果ぎりぎり無料枠に収まってるし、デプロイが git push するだけでとにかく楽で最高だった。無料枠に収まらなくなっても普通に課金しそう。

しかし 2022年8月25日に Heroku が[無料プランの終了をアナウンス](https://blog.heroku.com/next-chapter)しました。「無料枠に収まらなくなっても普通に課金しそう。」 などと言っていますが、このニュースを聞くや否や手のひらを返して夜逃げの準備を始めます。

https://twitter.com/morishin127/status/1563321285202980865

趣味アプリ開発者はサーバコストを無料にするための努力は惜しみません。なんとしても無料で運用したい。最初は Rails のまま移行できる先を探していて、Render、Railway、Fly.io などを検討しますがパッと見た感じ無料にはならなそうです。この時点で Rails にこだわるのはやめました。またアプリケーションサーバはともかく DB を無料にできる選択肢は少なく、Firestore (NoSQL) か [PlanetScale](https://planetscale.com/) (MySQL 互換の DBaaS) の無料枠ぐらいしか思いつきませんでした。AWS DynamoDB もまあまあ無料枠あるのかな?

## Vercel + PlanetScale への移行

Rails は嫌いじゃないけれど UI の表現に JavaScript を使いたい部分があり、TypeScript + React ベースのアプリにしたいと思い、SSR も可能で API も提供できる [Next.js](https://nextjs.org/) へ移行することに決めました。
以前[モダンウェブフロントエンド勉強会](https://techlife.cookpad.com/entry/2022/06/21/130736)というのでも話したんですが、ちょっとでも React を書きたかったらもう Rails はきついなと感じているためです。

<img src="https://i.gyazo.com/2c374afefcbdaa63e5f05d7f91e38534.png"/> <img src="https://i.gyazo.com/75a6d085b3e36cbda4b8005555318413.png"/>

API だけ Rails で書くというのはアリなんですが、アプリケーションが2つになる、使用言語が2つになる、アップグレード業などのメンテコストも2倍になると考えると個人開発者にはきついデメリットがあります。
データベースについては先述の通り選択肢が少なく、NoSQL より RDB が良かったので MySQL 互換で無料枠のある PlanetScale を選択しました。

## 新アプリの技術スタック (Next.js + Prisma + tRPC)

旧アプリは Rails で、フロントエンドで動きが必要な UI 部分に Vue.js を使っていました。スタイルは [Materialize](https://materializecss.com/) を使っていました。

新アプリでは Next.js、データベースクライアントとしては [Prisma](https://www.prisma.io/)、API サーバ・クライアントには [tRPC](https://trpc.io/) を採用しました。クライアントから叩かれる API は Next.js の API Routes として提供しているので、バックエンドのアプリケーションとしては1つしかありません。スタイルには [ChakraUI](https://chakra-ui.com/) を使いました。

API サーバ・クライアントは最初は GraphQL と GraphQL Code Generator を使って書き始めたのですが途中で tRPC の存在を知って全部書き直しました。ちなみに書き始めた時 tRPC は v9 だったんですが途中で v10 が出たのでまた一部リライトしました...。GraphQL Code Generator を使うと GraphQL スキーマを書くだけで必要な型や API クライアントの実装 (SWR や React Query を呼び出す React Hooks 関数までも) 自動で生成してくれて大変便利だったのですが、tRPC はそれ以上に便利でコード生成すら不要だったので採用しました。サーバもクライアントも共に TypeScript で実装できる時には良いですね。クライアントにモバイルアプリなどもいる場合は GraphQL を使うと思います。tRPC を使うとサーバ側は[このような実装](https://github.com/morishin/katteyokatta.morishin.me/blob/9b85ac253cf9be46e08ede6b3a188dad3c5acf73/lib/server/trpc/routers/amazonItemRouter.ts)になり、クライアント側は[このような実装](https://github.com/morishin/katteyokatta.morishin.me/blob/9b85ac253cf9be46e08ede6b3a188dad3c5acf73/components/post/AmazonSearchResults.tsx#L18-L31)になりました。コード生成なしにサーバとクライアントで型が共有できるのが強いですね。

ChakraUI は UI コンポーネント群と、Tailwind 風にスタイルを記述できるユーティリティを提供してくれます。また ChakraUI は [emotion](https://emotion.sh/) に依存しています。これもかなり便利で自分で工夫しなくてもアクセシビリティに配慮されたコンポーネントが記述できるし、CSS を書くことはほとんどなくなります。ただ emotion も ChakraUI も仕組み上 (React Context を使うため) React Server Component に対応させることは難しく、現状は Client Component でしか利用できません。そのためこれらに依存していると Next.js の [app directory](https://beta.nextjs.org/docs/routing/fundamentals) へ移行するのは難しいと思います。またバンドルサイズも大きくランタイムで実行される JS の量も多いためパフォーマンスには影響があるのですが、その分開発体験が良いため「買ってよかったもの」ではしばらくは ChakraUI (及び emotion) に依存していくと思います。Zero-runtime なライブラリにしたい気持ちもあるのですが...。

## パフォーマンスチューニング

さて、実装が一通り終わっていざデプロイしてみるとめちゃくちゃ遅かったので色々なチューニングをしました。まずデータベースに全然インデックスを貼っていなかったので PlanetScale のコンソールで遅いクエリや Rows read が多いクエリを見てインデックスを貼ったりしました。ウェブコンソールでこういうのが眺められるのは便利ですね。

![](https://i.gyazo.com/56af06f85c1e62455e82de155d8ed349.png)

それでも全体的にページ表示が遅く、PageSpeed Insights を見ると [TTFB](https://web.dev/ttfb/) (Time To First Byte) が圧倒的に遅かったです。全てのページを SSR にしていたのですが、どうやら Vercel と PlanetScale 間の通信が遅い様子。なんと最初ミスって片方のリージョンをアメリカ大陸にしてしまっていて SQL が海を渡っていたのでリージョンを両方 Tokyo にすると少しマシになりました。それでもかなり遅かったので、主要ページでは SSR をやめ SSG (On-Demand ISR) することにしました。

SSG するといってもユーザがコンテンツを投稿すると速やかにページを生成し直さなければなりません。そこで Vercel の [On-Demand ISR](https://beta.nextjs.org/docs/data-fetching/revalidating#on-demand-revalidation) を利用しました。これは SSG したページの再生成を好きなタイミングでリクエストすることができる仕組みで、「買ってよかったもの」ではユーザが商品を投稿したタイミングでトップページや投稿ユーザのユーザページを再生成するようにしています。 ([実装](https://github.com/morishin/katteyokatta.morishin.me/blob/af296b2a24057bd12153ff2d434252b0adc78b7d/lib/server/revalidator.ts#L4-L14))

SSG にすることで TTFB は理論上の最速になり、ページ遷移も爆速になりました。リンク先にマウスオーバーするだけで遷移先のコンテンツがプリフェッチされクリックするとそれが render されます。ログインユーザの情報など、都度サーバにリクエストをして動的に描画しなければならない部分のみローディングのぐるぐるを表示せざるをえなくなったため若干見苦しいのですが、サーバへのリクエストが全て済むまで真っ白の画面を見せられるよりはユーザ体験は良いはずです。昨今の React や Next.js のパフォーマンス改善の方向性としてもサーバに処理させないといけないところは非同期でさせておいて、それ以外のところは可能な限り早くユーザに見せ、そこだけでも Hydration を済ませて操作可能にするという解決策を追求しています。

あとは PageSpeed Insights に画像データのサイズが表示サイズに合ってないよと言われていたので next-image を使ってみたんですが、あれは無料枠が少なく一瞬で使えなくなったのでやめました。

https://twitter.com/morishin127/status/1595316821858877440

# Rails vs Next.js

Rails から Next.js に移行してうれしかったところはこのあたりです。

- SSR と SSG のハイブリッドができる
- Type Safe
- JavaScript でリッチな UI が書ける

Rails でも React + TypeScript を書くことはできますが、開発環境の構築もメンテナンスも大変です。既存の Rails アプリから Webpacker を剥がしピュアな Webpack を使うように変更する仕事を何度かやっていますがかなりタフな作業です。さらに Sprockets から Propshaft への移行を検討したり、その他のツールの選定やメンテナンスをやっていくのは骨が折れると思います。jsbundling-rails とか importmap-rails とか未だよくわかってない。

逆に Next.js にして困ったところもありました。

- `perform_later` が無い
- ridgepole が無い

Rails の `perform_later` は便利で、簡単に非同期ジョブを実行することができます。「買ってよかったもの」に商品が投稿された時に、[@katteyokatta_jp](https://twitter.com/katteyokatta_jp) アカウントからも新着投稿ツイートを流しているのですが、この Twitter API への POST リクエストは本当は In-Memory なキューでいいから perform_later したいような処理です。しかし手軽に利用できる非同期ジョブの仕組みが無いため今はユーザの投稿リクエストを処理する中で同期的に行っています。

[ridgepole](https://techlife.cookpad.com/entry/2014/08/28/194147) は Rails アプリのデータベースのスキーマを管理するツールで、ActiveRecord の標準のマイグレーションの仕組みを置き換えるものです。Prisma のスキーマ管理の方式は ActiveRecord のものと類似しており、スキーマの変更がある度にマイグレーションファイルが生成されるのですが、ridgepole のようにただ一つスキーマ定義ファイルがあり、それだけを人間が編集する形式が好ましいと思っています。ridgepole が世界標準になりますように🎋

# Heroku に感謝

アプリ開発が趣味の人間であり、これまで個人開発のサービスの多くは Heroku で動かしてきました。データベースや Redis、ジョブのスケジュール実行の基盤などまで無料で提供してくれており大変助かっておりました。これまでありがとうございました。

https://twitter.com/morishin127/status/1591977528574373888

# 宣伝

今回リライトした「買ってよかったもの」は、自分で作っておいてなんですがめっちゃ良いサービスなのでぜひ覗いてみて、使ってみてください。サービス名はちょっとダサいなとは思っています。

https://github.com/morishin/katteyokatta.morishin.me
