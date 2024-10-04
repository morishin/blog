---
keywords:
  - AWS
---

# #zoom-nomikai

この記事は [CAMPHOR- Advent Calendar 2019](https://advent.camph.net/) の8日目の記事です。7日目は [@asamas](https://twitter.com/asamas27) さんの「[スプラトゥーン2の戦績データを取得する+おまけ](https://qiita.com/asamas/items/ec8c9adab8d49b0aa1ec)」でした。

CAMPHOR- Advent Calendar には2014年から参加していて6度目の参加になります。今日は CAMPHOR- というコミュニティの Slack にある #zoom-nomikai チャンネルの話をします。

---

# CAMPHOR- とは

[CAMPHOR-](https://camph.net/) とはもともと京都の IT に興味のある学生のコミュニティで、そこの卒業生も含むオフライン＆オンラインのコミュニティを指しています。学生メンバーは京都大学近くの町屋 [CAMPHOR- HOUSE](https://camph.net/#house) を活動場所にしていて、卒業メンバーはオンラインのみまたは東京中目黒にあるコワーキングスペース CAMPHOR- BASE を活動場所にしています。オンラインでは Slack (または Discord) でコミュニケーションをしています。

6日目の記事が [@watambo](https://twitter.com/watambo) による CAMPHOR- BASE の紹介記事になっているので興味を持たれた方は 👉 https://note.com/viking/n/n8562bca82f95

# #zoom-nomikai とは

もともとは京都のコミュニティでしたが卒業メンバーの多くは京都を離れ東京、名古屋、アメリカなど様々な場所にいます。
京都の町屋でぬくぬくわいわいと作業をしていた時代を懐かしみ、最近ビデオ会議システムの [Zoom](http://zoom.us/) を利用した zoom-nomikai というオンライン飲み会を始めました。簡単に言うと複数人でビデオ通話をつないで家でビールを飲んでいるだけです。

<figure class="figure-image figure-image-fotolife" title="zoom-nomikaiの様子"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207180417.png" width="277" height="600" loading="lazy" /><figcaption>zoom-nomikai の様子</figcaption></figure>

以前は appear.in (現 whereby.com) を利用して似たようなことをしたことがありましたが、通話品質を求めて Zoom に移行しました。

<figure class="figure-image figure-image-fotolife" title="zoom-nomikai の誕生"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207180850.png" width="414" height="220" loading="lazy" /><figcaption>zoom-nomikai の誕生</figcaption></figure>

# 特徴

- 🌏 どこに住んでいても参加可能
- 👛 安い
- 😪 寝落ちが可能

物理的制約が無いのでどこに住んでいても自宅から一歩も出ずに開催・参加が可能です。物理的制約は無いと言ったけど時差はあるのでアメリカ在住のメンバーと話す時は向こうは早朝でコーヒーを飲んでいましたが。

家にあるものを飲むだけだし、別に飲まなくてもいいので基本料金無料。

たくさん飲んでも終電を気にする必要は無いしそのまま寝られて便利。

# Slack チャンネルと通知

家でビールでも飲むかという時に同じくそういう気分の他のメンバーを集められるように、Slack 上に #zoom-nomikai チャンネルと Zoom の入室通知を実装しています。

<figure class="figure-image figure-image-fotolife" title="Slack 通知"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181016.png" width="414" height="223" loading="lazy" /><figcaption>Slack 通知</figcaption></figure>

Zoom アプリケーションの通知機能は決してリッチでは無いのですが、「ホストの前に出席者がミーティングに参加した際」にホストのメールアドレスにメール通知を飛ばすことはできます。これを利用して Slack のチャンネルに通知メッセージを流すようにしました。

<figure class="figure-image figure-image-fotolife" title="Zoom の通知設定"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181043.png" width="260" height="171" loading="lazy" /><figcaption>Zoom の通知設定</figcaption></figure>

こういう流れで

<figure class="figure-image figure-image-fotolife" title="通知機能の構成"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191208/20191208000642.png" width="600" height="136" loading="lazy" /><figcaption>通知機能の構成</figcaption></figure>

Lambda はこういうの。

<figure class="figure-image figure-image-fotolife" title="Lambda"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181131.png" width="535" height="296" loading="lazy" /><figcaption>Lambda</figcaption></figure>

💡Lambda のおすすめ Tips なんですが、[axios](https://github.com/axios/axios) だけインストールした [Lambda Layer](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-layers.html) を作っておけば、こういうシンプルな HTTP リクエストだけをする Lambda ならウェブコンソール上だけでちゃちゃっと書いて完成するので便利です。

あと細かい Tips ですが SES は東京リージョンが無い(2019年時点)ので Lambda も東京リージョンではなく SES と同じリージョンを使う必要があるので注意してください。

こんなもの自分で作らなくても [Slack 標準のメールインテグレーション](https://slack.com/intl/ja-jp/help/articles/206819278-Slack-%E3%81%A7%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%92%E5%8F%97%E4%BF%A1%E3%81%99%E3%82%8B)を利用すればドーンなんですが、Slack の無料プランでは利用できる Slack App 数の上限が設けられているので Incoming Webhooks のみを利用する構成にしました👛

Webhook 機能なら Discord にもあるので、この構成なら Discord 上のコミュニティでも利用が可能です。

# さいごに

zoom-nomikai は家🏠とインターネット📱と缶ビール🍺があれば誰でもすぐに始められます。お近くのコミュニティにいかがでしょうか。
