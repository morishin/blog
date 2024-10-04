---
keywords:
  - 開発
---

# 開発で使ってる便利ツール

この記事は  [CAMPHOR- Advent Calendar 2020](https://advent.camph.net/)  の23日目の記事です。22日目は  [れおまる](https://twitter.com/_reo_g)  さんの「[ニキシー管の魅力](https://note.com/reo_g/n/nf019bd71db74) 」でした。ニッチ！！！！(賞賛)

CAMPHOR- Advent Calendar には初回の2014年から参加していて7度目の参加になります。

今回は普段の開発で便利に使っている周辺ツールを紹介します。他人の開発風景を見ていると色んな発見があって面白いので、自分の環境もコンテンツになるかもと思って書きました。他の人の記事も見てみたいのでよかったらみんな書いて。

※macOS を普段使いしているので macOS 用のアプリケーションも多く含みます。

---

## Alfred

[Alfred](https://www.alfredapp.com/) は macOS アプリで Spotlight のようにローカルのアプリケーションやファイルを検索したり、Workflow という機能で様々なアクションを定義してホットキーやキーワード入力をトリガーにして実行できるツールです。様々な用途に使っているのでこの記事に何度か出てきます。ウェブ検索もここからやってます。

## ウィンドウのサイズと位置をコントロールするやつ

[Shiftit](https://github.com/fikovnik/ShiftIt) はウィンドウのサイズと位置をショートカットキーから変更するツールです。ウィンドウを最大化したり、二つのアプリケーションウィンドウを並べたいときに左右に均等サイズで並べたり、あるウィンドウを外部ディスプレイに移動させたりといった操作をショートカットキーから行えるのが便利で使っています。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231512.gif" width="400" height="225" loading="lazy" />

## アクティブなアプリケーションを切り替えるやつ

[HyperSwitch](https://bahoom.com/hyperswitch) は⌘+Tabでのアプリ切り替えがちょっと便利になるやつです。アプリ単位じゃなくてウィンドウ単位で切り替えられたりプレビューが表示されてたりで使いやすい。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201222/20201222093901.png" width="600" height="269" loading="lazy" />

またアプリケーションの切り替えは [Alfred Workflow](https://www.alfredapp.com/workflows/) を作ってホットキーでも行えるようにしています。よく使うアプリケーションに対して⌘1〜5のキーを割り当てています。Workflow はこんな感じ。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231305.png" width="244" height="400" loading="lazy" />

あるアクティブなアプリケーションから直前にアクティブだったアプリケーションへ切り替えるなら HyperSwitch の⌘+Tabを1回押すだけなのでそれでパッパパッパと往復していますが、特定のアプリケーションに切り替えたい場合はホットキーを使っている感じです。ホットキー登録していない別のアプリケーションに切り替え/起動したい場合は普通に Alfred の窓にアプリケーション名を打って移動しています。これは別に Spotlight でも良いけど。

## 絵文字を入力するやつ

[meyer/alfred-emoji-workflow](https://github.com/meyer/alfred-emoji-workflow) は Alfred Workflow で絵文字を検索・入力するやつです。クエリを入力するとこんな感じで候補が出てくるので選ぶとクリップボードにコピーされます。かなりあいまいな検索が可能なので絵文字の正確な名前(とは)が分からなくても割と見つかります。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231505.png" width="400" height="347" loading="lazy" />

(:tofu_on_fire: がヒットしていてエラい)

## スニペットを素早く入力するやつ

[Quill](https://quill.morishin.me/) という自作のアプリを使っています。トリガーのキーワードと対応するスニペットを登録しておくと、キーワード入力時に自動的にスニペットに置換してくれます。スクショのような HTML タグの他に顔文字やメールアドレス・住所なども登録したりしています。

<img src="https://i.gyazo.com/190bbb1cf7d407792f675db5c6b66dae.gif" alt="Image from Gyazo" width="512"/>

同様の機能を提供するアプリとして Alfred, [Dash](https://kapeli.com/dash), [TextExpander](https://textexpander.com/) などがありますが、使い勝手が好みでなかったり有償だったりするので自作しました。

作った話はこちら。

https://morishin.hatenablog.com/entry/quill


## Slack のステータスに今やってることを反映させるやつ

[rrreeeyyy/slack-status-activity](https://github.com/rrreeeyyy/slack-status-activity) というアプリで現在アクティブなアプリケーションの情報を勤務先の Slack のステータスへ自動反映させています。

今コード書いてるとか Zoom ミーティング中であるとかが他のメンバーから見えるようになります。オフィスに出社していたときは目視で分かったけど、もうみんなリモートワークになってるから便利かなと思っています。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231313.png" width="358" height="108" loading="lazy" />

💡 Pro Tips ですが 'loginwindow' というアプリケーション名に「離席」を表す emoji を割り当てて置くと、画面をロックしているときはステータスが「離席」になって便利です。
(情報セキュリティ委員会のご指導により席を立つときは画面ロックをする癖があって自宅であっても抜けないのだ)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231356.png" width="249" height="105" loading="lazy" />

## VSCode プラグイン

テキストエディタは基本的に VSCode を使っているのでよく使うプラグインをいくつか紹介します。

### case を変えるやつ

[wmaurer.change-case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case)

Rails ってやつはファイル名とクラス名がケース違いで一致していないと動かないけどタイポしてても気づかないのでもう手打ちはやめました。

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231433.gif" width="400" height="194" loading="lazy" />

### ゲーミングカッコ

[CoenraadS.bracket-pair-colorizer-2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231319.png" width="240" height="64" loading="lazy" />

流行りのやつ。このﾂｲｰﾖを見て導入しました。

https://twitter.com/tanakh/status/1024131114649047041?s=20

### カンマで改行するやつ

[jzarzoso.break-from-comma](https://marketplace.visualstudio.com/items?itemName=jzarzoso.break-from-comma)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231401.gif" width="400" height="167" loading="lazy" />

### GitHub で開くやつ

[ziyasal.vscode-open-in-github](https://marketplace.visualstudio.com/items?itemName=ziyasal.vscode-open-in-github)

選択行を GitHub のウェブページで開いてくれます。

## git 関連

### git-rerere

過去に解消したコンフリクトを記憶してくれて、同様のコンフリクトが起きたときに自動で解消してくれるやつ。たまにしか発動しないけど発動したときのありがたみがすごい。とりあえず有効にしておくと良いと思います。

https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-Rerere


### peco 芸

ブランチ切り替えを peco でやったり、git add するファイルを peco で選んだり。

zsh 前提のスクリプトですがこんな感じで書いてました。

```sh
function peco-select-git-switch() {
    local selected_branch="$(git branch --sort=-committerdate | grep -v '^\*.*' | peco --query "$LBUFFER" | awk -F ' ' '{print $1}')"
    if [ -n $selected_branch ]; then
      BUFFER="git switch $selected_branch"
      CURSOR=$#BUFFER
      zle accept-line
    fi
}
zle -N peco-select-git-checkout
bindkey "^gc" peco-select-git-checkout
```

```sh
function peco-select-git-add() {
    local SELECTED_FILE_TO_ADD="$(git status -s | cut -c4- | \
                                  peco --query "$LBUFFER" | \
                                  awk -F ' ' '{ printf "\"%s\" ", $NF }')"
    if [ -n "$SELECTED_FILE_TO_ADD" ]; then
      BUFFER="git add $(echo "$SELECTED_FILE_TO_ADD" | tr '\n' ' ')"
      CURSOR=$#BUFFER
    fi
    zle accept-line
}
zle -N peco-select-git-add
bindkey "^ga" peco-select-git-add
```

## シェルのコマンド履歴検索するやつ

これも peco でこんな感じにしてる。

```sh
function peco-select-history() {
    local tac
    if which tac > /dev/null; then
        tac="tac"
    else
        tac="tail -r"
    fi
    BUFFER=$(history -n 1 | \
        eval $tac | \
        peco --query "$LBUFFER")
    CURSOR=$#BUFFER
    zle clear-screen
}
zle -N peco-select-history
bindkey '^r' peco-select-history
```

## cd のかしこいやつ

[wting/autojump](https://github.com/wting/autojump) というのを使っていて移動したことのあるディレクトリへ雑な入力で `cd` できる便利なやつです。

## 環境変数をコマンドに渡すやつ

クックパッド社では社内標準になっていますが [sorah/envchain](https://github.com/sorah/envchain) を使って macOS のキーチェーンに保存された秘匿値をシェル変数に設定してコマンドに渡しています。AWS コマンドに渡す秘匿値とかこれが無いと大変。

## sudo を Touch ID でやるやつ

[このあたり](https://dev.classmethod.jp/articles/mac-terminal-sudo-touch-id/)を参考に、ターミナルで管理者パスワードを求められた時にパスワード入力の代わりに Touch ID が使われるように設定しています。

## URL エンコードされた文字列を戻すやつ

Chrome で URL をコピーすると日本語が URL エンコードされてダサいので日本語 URL に戻してシェアすることが多いのですが、そういうときに [humr](https://github.com/motemen/node-humr) を使っています。日本語 URL のままの方がかっこよくない?(半角スペースを含んでる URL はあかん)

## 英かな切り替えるやつ

QMK Firmware 互換の[キーボード](https://scrapbox.io/morishin/Keyboard)を使っているので左⌘と右⌘の位置のキーを英かなに変えています。

https://github.com/morishin/qmk_firmware/blob/33ff789213a73d165fbd90d54620f3b08c0d4a29/keyboards/mint60/keymaps/morishin/keymap.c#L40

## おわり

なんか他にもあるような気もしますがこういうのを使いながらなんとか開発のどうでもいい部分のストレスを減らしています。他の人がどうしてるかも知りたいのでよかったら皆さんも記事を書いて教えてください！
