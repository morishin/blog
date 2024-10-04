---
keywords:
  - Minecraft
  - 開発
  - iOS
---

# Siri Shortcuts で「Hey Siri, マイクラサーバー立てて」

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923035423.png" width="462" height="228" loading="lazy" />

iOS 12 がリリースされ、Siri Shortcuts が使えるようになりました。
[「ショートカット」アプリ](https://itunes.apple.com/jp/app/workflow/id915249334?mt=8)から GUI プログラミングのような感じで処理を定義できます。

過去にマインクラフトのマルチプレイサーバーを立てる Lambda Function を作成し、Slack の Slash Commands から叩く記事を書きました。

https://blog.morishin.me/posts/2017/02/21/minecraft-lambda-function

今回はこの Lambda Function を Slack の代わりに Siri Shortcuts から叩けるようにして、<b>「Hey Siri, マイクラサーバー立てて」</b>の呼びかけでサーバーを立ててもらえるようにしました。

---

動作の様子です。(なんか多重実行されて Slack にエラーログ流れてるけど🙇)

<iframe width="560" height="315" src="https://www.youtube.com/embed/OzKVTaXGVnM?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## 仕組み

仕組みとしてはざっくり下図のようになっていて、これまで Slack の Slash Commands から叩いていた API Gateway のエンドポイントを Siri Shortcuts から叩くようにしただけです。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923041522.png" width="512" height="262" loading="lazy" />

## ショートカットの作成

Siri Shortcuts の作り方は簡単で、API Gateway のエンドポイントにパラメータ付きで POST リクエストを飛ばすだけでよいので、下の画像のような短い定義になりました。URL を指定するだけのアクションの下に、「URL の内容を取得」という HTTP リクエストを実行するアクションを接続して、リクエストメソッド・パラメータを指定しただけです。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040443.jpg" width="252" height="512" loading="lazy" />

あとは「Hey Siri,」で実行できるようにフレーズを録音して登録すれば完成です。

<div class="images-row mceNonEditable"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040816.png" width="288" height="512" loading="lazy" /><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040819.png" width="288" height="512" loading="lazy" /></div>

## 感想

Siri Shortcuts 作りは iPhone だけでお手軽に GUI プログラミングのような要領で出来て楽しいですね！今回は API リクエストを飛ばしたぐらいでしたが、条件分岐などの制御構文も含め、めちゃくちゃ色んな処理が書けて自由度が高いので夢が膨らみます。
