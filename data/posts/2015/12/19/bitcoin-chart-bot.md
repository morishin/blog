---
keywords:
  - 開発
---

# Bitcoinのリアルタイムチャート画像を返すAPIを作ってSlackでHubotに吐かせる

この記事は <a href="http://advent.camph.net/" target="_blank">CAMPHOR- Advent Calendar 2015</a> 20日目の記事です。<br>
(CAMPHOR- についてはこちら https://camph.net/ )

こんにちは <a href="https://twitter.com/morishin127" target="_blank">@morishin127</a> です。<br>
近頃 CAMPHOR- メンバー間での割勘や立て替え時に Bitcoin を利用するのが流行っています。LINE Pay 的な使い方でしょうか。<br>
自分でいくらかの Bitcoin を持つようになると日々変化するレートが気になるので時々ググってチャートを見たりしていたのですが、bot に話しかけてチャートが得られたら便利そうと思いチャート画像を返すAPIを作成しました。

<img src="http://g.morishin.me/9f820904ca43af8a302a2c425507b36e.png" alt="bot" width="680" />

---

~~http://ticker.morishin.me/~~ https://ticker.arukascloud.io/ を叩けばリアルタイムのチャート画像が返ってきます。<br>
`?scale=15m`で15分足、`?scale=1d`で1日足になったりします。(デフォルトは5分足)

リポジトリはこちらです。

https://github.com/morishin/bitchart-api

[Dockerリポジトリ](https://hub.docker.com/r/morishin127/bitchart-api/)があるので

```shell
docker pull morishin127/bitchart-api
docker run -itd -p 80:8080 morishin127/bitchart-api
```

で動かせると思います。

## 実装

使ったもの

- Python 3
  - Bottle
  - pandas
  - matplotlib
- Docker

### レート情報の取得
Bitcoin のレートの取得には[coincheckのAPI](https://coincheck.jp/documents/exchange/api?locale=ja)を使わせてもらってます。<br>
https://coincheck.jp/api/ticker を叩くと下記の形式で現在時刻の価格情報が得られます。
```javascript
{
  "last": 55621,
  "bid": 55694,
  "ask": 55715,
  "high": 56552,
  "low": 54927,
  "volume": "1835.34189941",
  "timestamp": 1450547505
}
```

この API を毎分叩いて DB に last の値を INSERT していきます。

### pandas + matplotlib でチャートを描画

DB に INSERT するとともにその時点までのチャート画像を生成してファイルに保存しておきます。DB から SELECT したデータを pandas の DataFrame にし、 matplotlib の機能でロウソク足チャートを描画します。`matplotlib.finance.candlestick_ohlc` を利用しました。

ここまでの処理を一つのスクリプトにして crontab で毎分実行します。

<script src="https://gist.github.com/morishin/8647b913b968501ae846.js"></script>

### チャート画像の配信

Bottle で Web サーバーを立ち上げてリクエストが来たらファイルに保存されている画像を返します。

<script src="https://gist.github.com/morishin/25572ab19d54c7d5d329.js"></script>

### Docker
~~これを適当なサーバーにDockerでドーンしてそこに[ticker.morishin.me](http://ticker.morishin.me/)ドメインを振りました。~~<br>
自分のサーバーに置いていたのは閉じて、さくらの Arukas に移行しました → https://ticker.arukascloud.io/ <br>
Arukas の設定はこんな感じで `PORT=80` を指定したら起動できます。<br>
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20160924/20160924135147.png" width="480"/>

Dockerfileはこんな感じです。

<script src="https://gist.github.com/morishin/4cf1cd2c05d0be488479.js"></script>

依存ライブラリとかよくわからなかったのでこちらを参考にさせていただきました🙏
http://fits.hatenablog.com/entry/2015/10/29/212833

Docker を採用したのは手動での環境構築で挫折したからです... 自分で借りていた VPS (Debian) でサクッと動かそうとしたのですが virtualenv 上に matplotlib 等のライブラリをインストールするのに詰まって挫折してしまい、既に誰かが構築に成功している Dockerfile を使うのが楽なのではと思い Docker にしました。<br>
ちなみにその Debian マシンに docker-engine をインストールするのにも詰まってしまい(ょゎぃ)、結局 DigitalOcean で Docker 環境がプリインストールされたインスタンスをポチって立ち上げました。<br>
DigitalOcean の One-Click Apps めっちゃ便利やんけ...

<img src="https://cloud.githubusercontent.com/assets/1413408/11914661/dc70fb14-a6c9-11e5-8e43-42b7b8aabb6f.png" width="512"/>

### Hubot
これで下記のような hubot script を書いておくとチャットで Hubot にチャートを返してもらうことができます。

```coffee
module.exports = (robot) ->
  robot.hear /bitchart\s*(\d+[mhd])?/, (res) ->
    query = res.match[1] ? "5m"
    res.send "https://ticker.arukascloud.io/?scale=" + query
```

より詳しくは[リポジトリ](https://github.com/morishin/bitchart-api)をご覧ください。

明日は[keishake](http://shakezoomer.com/)の記事です。お楽しみに！
