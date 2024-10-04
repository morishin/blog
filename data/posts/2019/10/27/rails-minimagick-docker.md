---
keywords:
  - 開発
  - Rails
---

# Rails + MiniMagick の開発環境で ImageMagick を Docker コンテナに切り離す

## 3行

- Rails アプリの開発において、手元の開発環境では Rails アプリのみをホストマシン上で実行、MySQL や Redis などのミドルウェア類は Docker コンテナ (Docker for Mac) 上で実行するという構成が好き
- Rails アプリで MiniMagick を使おうとすると Rails アプリを実行している環境に ImageMagick をインストールする必要があるが、開発するアプリケーションによって利用したいバージョンが異なるかもしれないし、開発者の OS によってインストールの手順も異なったりするし、そもそもローカルマシンの環境を汚したくない
- ImageMagick をインストールした Docker コンテナを用意し、MiniMagick gem からそれを利用させるようにした


---


## 実装

### ディレクトリ構成

ふつうの Rails アプリの構成に、アプリケーションを実行するスクリプト `dev/start` と `docker-compose.yml` を追加し、MiniMagick が Docker コンテナを利用するための設定として `config/initializer/minimagick.rb` を追加している。

```txt
.
├── app
︙
└── config
│  └── initializers
│      └── minimagick.rb
├── dev
│   └── start
├── docker-compose.yml
└── tmp
    └── images
```

### config/initializers/minimagick.rb

MiniMagick は内部でシステムの ImageMagick コマンドを実行しているがそのコマンドに prefix を付加できるオプションが用意されており、ここに `docker exec <コンテナ名>` を指定することで MiniMagick から Docker コンテナの ImageMagick を利用するようにしている。
https://github.com/minimagick/minimagick/blob/d484786f35e91f107836d3c86aca61d50a35820b/lib/mini_magick/tool.rb#L126

```ruby
require "mini_magick"

if Rails.env.development?
  ::MiniMagick.configure { |config|
    config.cli = :imagemagick
    config.cli_prefix = %w[docker exec imagemagick]
  }
end
```

### docker-compose.yml

MySQL 等のミドルウェアと一緒に ImageMagick 用のコンテナも立てるようする。このコンテナは立ちっぱなしにしておいて、`docker exec imagemagick <ImageMagickコマンド>` のように実行するようにしている。ImageMagick が入った Docker イメージは Docker Hub で適当に検索して出てきたやつを使った https://hub.docker.com/r/v4tech/imagemagick

MiniMagick は扱う画像ファイルの置き場所に `Dir.tmpdir` 、つまり Linux では環境変数 `TMPDIR` で指定されたディレクトリを利用するので、ホストマシンのそのディレクトリを imagemagick コンテナにマウントして共有する必要があり、`volumes` にその旨を記述している。

```yaml
version: '3.7'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: hoge
      MYSQL_USER: hoge
    ports:
      - "3307:3306"
  imagemagick:
    container_name: imagemagick
    image: v4tech/imagemagick
    volumes:
      - $TMPDIR:$TMPDIR
    tty: true
    command: "/bin/ash"
```

### dev/start

環境変数 `TMPDIR` にパスを指定しつつコンテナ群と Rails アプリを起動するスクリプト。

```sh
#!/bin/sh -eu

SCRIPT_DIR=$PWD/$(dirname $0)
ROOT_DIR=$SCRIPT_DIR/..
TMPDIR="$ROOT_DIR/tmp/images" # imagemagick コンテナと共有するために TMPDIR のパスを明示的に指定

docker-compose up -d
bin/rails server
```

以上の実装で MiniMagick は Docker コンテナ内の ImageMagick を利用するようになり、ローカルマシンに ImageMagick をインストールせずに済む ☺️

なおこれは Rails アプリをホストマシンで動かしたい開発環境に限った話で、本番環境で Rails アプリを Docker コンテナとして実行している場合は普通にそのコンテナに ImageMagick をインストールしていればよい。
