---
keywords:
  - Firebase
  - 開発
---

# Firebase Hostingのリライトをローカルでエミュレートするプロキシ

Firebase Hosting には[リライト](https://firebase.google.com/docs/hosting/full-config#rewrites)という機能があって、設定ファイル(`firebase.json`)を書くことで例えば

- 全てのパスを `/index.html` へ向ける (SPA などで使う)
- `/items/1234` へのリクエストを `/items/id.html` へ向ける
- `/api/get_item` へのリクエストを Cloud Functions の `get_item` 関数の HTTP トリガへ向ける

といったことが実現できます。

---

また [cleanUrls](https://firebase.google.com/docs/hosting/full-config?hl=ja) 属性を使用することで URL から `.html` 拡張子を取り除くことができます。`/page` へのアクセスは Hosting にアップロードされた `/page.html` のファイルを取得するようになり、`/page.html` へのアクセスは `/page` へ 301 リダイレクトされるようになります。

これらの挙動はシュッとしたウェブアプリを作るためには大変便利でよく利用しますが、Firebase 本番環境へデプロイされたアプリケーションでしか効きません。本番環境では `/items/1234` は `/item/id.html` を返してくれるけど開発環境では `/item/1234` は 404 になるといったつらみが生じます。

https://twitter.com/morishin127/status/1330402595337330690

## rewriteproxy

そこで開発環境でもリライトと cleanUrls の挙動を再現してくれるプロキシを作りました。お手元の `firebase.json` を読み込んで動作します。

リポジトリはこちら。

https://github.com/morishin/rewriteproxy

Go の標準ライブラリにある `httputil.ReverseProxy` を使って書いたシンプルなリバースプロキシになっています。
使い方はこんな感じ。

```bash
$ rewriteproxy \
  --port=3000 \
  --firebase-json=/path/to/firebase.json \
  --web-app-url=http://localhost:1234 \
  --cloud-function-base-url=http://localhost:5001/your-project-id/us-central1
```

`--web-app-url` はローカルで起動したウェブアプリの URL です。[webpack-dev-server](https://webpack.js.org/configuration/dev-server/) なら `http://localhost:8080` だったり、[parcel](https://parceljs.org/) なら `http://localhost:1234` だったりするでしょう。`--cloud-function-base-url` はローカルで起動した Cloud Functions Emulator の URL を指定します。Firebase プロジェクトの初期状態で `functions/` 以下で `yarn run serve` を叩くと立ち上がるやつです。

## 例

### パスの書き換え

例えば
>`/items/1234` へのリクエストを `/items/id.html` へ向ける

という設定を `firebase.json` に書いた上で、上記コマンドでプロキシを起動しブラウザから `http://localhost:3000/items/1234` へアクセスすると、ウェブアプリの `http://localhost:1234/items/id.html` でホストされているファイルがブラウザに返るようになります。

![rewrite path](https://user-images.githubusercontent.com/1413408/101050973-4dcddb00-35c8-11eb-9ad2-07a5e4713f82.png)

### Cloud Functions

>`/api/get_item` へのリクエストを Cloud Functions の `get_item` 関数の HTTP トリガへ向ける

という設定を `firebase.json` に書いた上で `http://localhost:3000/api/get_item` へアクセスすると、ローカルの Cloud Functions エミュレータの `http://localhost:5001/your-project-id/us-central1/get_item` が実行されます。

![cloud_functions](https://user-images.githubusercontent.com/1413408/101050971-4dcddb00-35c8-11eb-936c-5deb8e2604a4.png)

### cleanUrls

`cleanUrls: true` にしていると `.html` 無しの URL を `.html` 付きにしてウェブアプリへプロキシしてくれます。

![clean_urls1](https://user-images.githubusercontent.com/1413408/101051746-29263300-35c9-11eb-8693-89014592d179.png)

逆に `.html` 付きでアクセスすると `.html` 無しの URL へ 301 リダイレクトした上で先述のものと同じ挙動をします。

![clean_urls2](https://user-images.githubusercontent.com/1413408/101051730-275c6f80-35c9-11eb-8426-8ad7cb086c32.png)

### Root path

また `/` へのアクセスはウェブアプリの `/index.html` へプロキシされます。

![root path](https://user-images.githubusercontent.com/1413408/101050970-4d354480-35c8-11eb-9b96-58d83d03a8f5.png)

## お手元の Firebase プロジェクトへの組み込み方

プロジェクトのディレクトリには `functions`, `public` ディレクトリがあると思いますが同階層に `dev` ディレクトリ(名前はなんでもいい)を用意して中で `yarn add -D concurrently` だけしておきます。

```sh
PROJECT_ROOT
├── firebase.json
├── functions # Cloud Functions の実装
├── public # Hosting の実装
└── dev
    ├── package.json
    ├── setup
    ├── start
    └── yarn.lock
```

`start` スクリプトを用意して中身をこんな感じにします。URL やポート番号はお好みのものにしてください。自分はよく parcel dev サーバを `1235` で起動して rewriteproxy を `1234` で受けます。これで開発時には `dev/start` を叩けばウェブアプリの dev サーバと Cloud Functions エミュレータと rewriteproxy が一緒に起動します。

```sh
#!/bin/sh -eux

cd "$(dirname "$0")"

./node_modules/.bin/concurrently --kill-others \
  -n public,functions,proxy \
  -c cyan,yellow,blue \
  "cd ../public && yarn run dev" \
  "cd ../functions && yarn run serve" \
  "$(go env GOPATH)/bin/rewriteproxy --firebase-json=../firebase.json --port=1234 --web-app-url=http://localhost:1235 --cloud-function-base-url=http://localhost:5001/YOUR-FIREBASE-PROJECT-ID/us-central1"
```

ちなみに `setup` はこんな感じにしておくと便利だと思います。

```sh
#!/bin/sh -eu

cd "$(dirname "$0")"

# dev
cd ../dev
yarn install
go get github.com/morishin/rewriteproxy
cd -

# public
cd ../public
yarn install

# functions
cd ../functions
yarn install
```

## よければご利用ください

https://twitter.com/morishin127/status/1334681881829261312

Firebase Hosting のリライトや `cleanUrls` を使ったウェブアプリを開発されている方には便利かと思うのでよかったらお使いください。

この rewriteproxy の実装はミニマムで、 Firebase Hosting のリライトに備わっている機能のうち自分がよく使う「パスの書き換え」「Cloud Functions へのプロキシ」「.html を消す」という機能しか実装されていません。その他の機能もローカルで使いたいという方は issue を立てたり実装して PR を出したりしていただければ幸いです。

https://twitter.com/morishin127/status/1410135081687998465
