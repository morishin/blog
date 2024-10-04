---
keywords:
  - 開発
  - Minecraft
  - Python
  - AWS
---

# Minecraft のマルチプレイ用サーバをプレイ時だけ稼働させるための Lambda Function

## 三行
- Minecraft サーバはメモリ2GB以上のインスタンスが欲しいけど VPS を借りると月2000円ぐらいかかるところが多い
- プレイ時だけ稼働させればよいので Slack からインスタンスを立てて遊び終わったらデータを退避させて壊せるようにした
- $0.03 / hour で遊べる


---

## [minecraft-lambda-function](https://github.com/morishin/minecraft-lambda-function)
Minecraft サーバをプレイ時だけ稼働させるために下記の機能を持つ AWS Lambda Function を作った。

- `create`: DigitalOcean にサーバインスタンスの生成 → S3 からプレイデータ(`world`ディレクトリ)のダウンロード → Minecraft サーバの起動 → IP アドレスを Slack に通知
- `upload`: S3 へプレイデータをアップロード
- `destroy`: インスタンスの破壊

https://twitter.com/morishin127/status/818309827709411328


## インターフェイス
Slack の Slash Commands で対応する Function を呼び出す。

- `/minecraft create`
- `/minecraft upload`
- `/minecraft destroy`

![インターフェイスの図](https://cloud.githubusercontent.com/assets/1413408/21756755/aaf11ad6-d668-11e6-82e1-9513630b1083.png)

## アーキテクチャ
Lambda Function は図のような構成で動いている。
Minecraft サーバアプリケーション自体は [itzg/minecraft-server](https://hub.docker.com/r/itzg/minecraft-server/) という Docker イメージを利用して動かしている。環境変数に S3 上の world.zip の URL を渡すだけでそのプレイデータで起動されて便利。

### create⚒
![create](https://cloud.githubusercontent.com/assets/1413408/21756322/2dda13ea-d663-11e6-9c16-53fe50475df0.png)

### upload🚀
![upload](https://cloud.githubusercontent.com/assets/1413408/21756340/7fe91df2-d663-11e6-9a93-c88b85ffa6a2.png)

### destroy💥
![destroy](https://cloud.githubusercontent.com/assets/1413408/21756324/2de341cc-d663-11e6-8b41-e28ffcf22af4.png)

## Slack からの実行
Slack の Slash Commands から Lambda Function を実行するために API Gateway を利用した。

1. API Gateway にエンドポイントを作成して POST したら minecraft-lambda-function を実行するように設定。
2. Lambda Function はパラメータを JSON で受け取りたいのだけど Slack Slash Commands は JSON で送ってくれないので API Gateway で Body Mapping Template を設定。
  ![Body Mapping Template](https://cloud.githubusercontent.com/assets/1413408/21756702/fbec5258-d667-11e6-97b5-8c32ac4bb5cb.png)
  このようにした。
  ```txt
  #set($httpPost = $input.path('$').split("&"))
{
\#foreach( $keyValue in $httpPost )
 \#set($data = $keyValue.split("="))
 "$data[0]" : "$data[1]"\#if( $foreach.hasNext ),\#end
\#end
}
```
3. Slack Slash Commands を設定
  URL に API Gateway のエンドポイントの URL を設定する。ここで設定する Token は Lambda Function に渡される JSON データに含まれる。(Lambda Function 側の環境変数にも同じ Token を設定しておいて Function 内で照合することで、Slack Slash Commands 以外からのリクエストを無視する)
  ![Slack Slash Commands](https://cloud.githubusercontent.com/assets/1413408/21756993/9e921bfc-d66b-11e6-91d9-e80829ae960b.png)
4. Slack から `/minecraft create` を実行すると
  ```json
{"token": "*****", "text": "create"}
```
というパラメータで Lambda Function が実行されるようになる 🎉

## 動作
Slash Commands 自体のログは残らないけどこんな感じのログになる。
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20170220/20170220005920.png" width="512" height="141" loading="lazy" />

## 料金
$0.03 / hour で遊んだ時間分しかかかってないのでお安い 💰
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20170220/20170220010515.png" width="512" height="249" loading="lazy" />

## 感想
最高便利！！！！！！！！

## 余談
Lambda のデプロイパッケージのビルドを macOS 上で行なっても Lambda 上で動かず苦戦した際の知見です。

http://qiita.com/morishin/items/cfba9ed41a73158b38f6
