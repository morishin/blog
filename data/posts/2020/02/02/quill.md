---
keywords:
  - Firebase
  - 開発
  - Swift
---

# Quill というスニペット補完ツールを作りました

## 目次

これ👇

https://quill.morishin.me/

## デモ

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/388694912?color=26a69a&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>



---



## 機能

コードスニペットや単語・文章とそのトリガーになるテキストを登録しておくと、トリガーの入力時に入力文字列を置換してくれるアプリです。

例えば下図のように設定しておけば `` `img `` と入力すると瞬時に `` `img `` が `<img src="" width="320"/>` に置換されます。

<img src="https://i.gyazo.com/1b0b273724469e6530ed8bea4a7450ab.png" width="320"/>

issue や PR で頻繁に img タグを使いますが手打ちはしんどいので個人的には一番よく使うスニペットです。
他にも顔文字や自分の住所など入力がダルいものを登録したりしています。

## 使い方

[https://quill.morishin.me/](https://quill.morishin.me/) からダウンロードできます。

難しくて申し訳ないんですが、ダウンロードして起動しただけでは使えなくて、「システム環境設定 > セキュリティとプライバシー > アクセシビリティ」のアプリ一覧に Quill.app をヨッコイショとドラッグ&ドロップしてから起動していただく必要があります🙇

<img src="https://i.gyazo.com/8407883571c96dcfa90496cd6409e44b.png" width="320"/>

起動したら左下の「+」ボタンからトリガーのテキストを追加し、右のテキストエリアにスニペットを入力して「Save」をします。

<img src="https://i.gyazo.com/36c768d3481e72f44d8562626b735502.png" />

保存したらどこか適当なエディタにトリガーを入力してみてください。入力後テキストが置換されます。

<img src="https://i.gyazo.com/e537de1baa29622543a2659be42cc817.gif" width="320"/>

## ライセンス購入

最初はスニペットが一つしか登録できません。同じページの「PURCHASE LICENSE」ボタンから買い切りライセンス($5)を購入することができ、メールで送られてくるライセンスキーをアプリから入力していただくと、登録上限が無制限になります。

こういうメールが来るので、

<img src="https://i.gyazo.com/16415b4c99489546c2dea4e962b3c78d.png" width="480"/>

アプリのこの画面に入力します。

<img src="https://i.gyazo.com/8112cc8c9391980d340b83961cf56332.png" width="480"/>

## 開発の経緯

[Dash for macOS](https://kapeli.com/dash) というドキュメントブラウザアプリに付いている [Code Snippet Manager](https://kapeli.com/dash_guide#introductionToSnippets) の機能を便利に使っていたのですがドキュメントを見るという用途では自分が使わなくなりつつあったのと、ライセンスの更新が有料であったことから Dash はやめて Code Snippet Manager の機能だけ自作して使おうとなりました。

## 使った技術

### アプリ本体

Swift で書かれているふつうの macOS アプリです。Xcode で開発し Apple notary service で [Notarization](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution) した .app を zip で配布しています。課金や自動アップデートの仕組みを自作するのはしんどいと思っていたので最初は AppStore で公開しようとしたのですが、アクセシビリティの権限を付与する必要のあるアプリはストアで配信できないと言われ審査に通らなかったので、自前で配信しています。課金の仕組みはなんとか作ったんですが自動アップデートは作ってないです。

スニペットのデータはトライ木という構造で保持していて、キー入力の度にトライ木を探索しています。メインのロジック部分だけライブラリ化してオープンにしているので興味があればご覧ください。名前の発音は [try! Swift](https://www.tryswift.co/) と同じです。

https://github.com/morishin/trie-swift


### 課金

Stripe と Cloud Functions で実装しています。過去の記事で書いたものと同じ構成で作っているので詳細はこちらをご覧ください。

https://blog.morishin.me/posts/2018/12/17/stripe-firebase-payment


### ライセンス発行・配信

Cloud Functions で課金の成功のコールバックをフックにして、ライセンスキーの生成とメール配信を行っています。メール配信は [SendGrid](https://sendgrid.kke.co.jp/) を使いました。

SendGrid はこんな感じで Web コンソールからグラフィカルにメールテンプレートを作ることができてめっちゃ便利でした。コーディングが要らない！

<img src="https://i.gyazo.com/4642ca04547bfc3d9f547ae343d2d168.png" />

### ウェブページ

ふつうに HTML を書いて Firebase Hosting にデプロイしています。DNS, CDN は [CloudFlare](https://www.cloudflare.com/)。

## さいごに

便利なんでよかったら使ってみてください😊

https://quill.morishin.me/
