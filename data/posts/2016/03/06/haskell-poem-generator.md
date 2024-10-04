---
keywords:
  - 開発
  - Haskell
---

# Haskell でマルコフ連鎖を用いたポエムの自動生成

![](https://i.gyazo.com/da57a0afc34fed284d39fffd62a97f5f.png)
## poem-generator
Haskell の勉強のためにポエムを自動生成するプログラムを書いてみました。<br>
初めて書いた Haskell のプログラムなので拙いコードだと思いますが、どう実装したかを記事にしておこうと思います。

リポジトリはこちらです。

https://github.com/morishin/poem-generator

---

## 実装
(ソースコード全文は記事の下の方に貼っています)

メインとなる関数の定義です。ソースとなるテキストを引数にとり、その中の単語をいい感じに繋ぎ合わせて生成したポエムを返します。
```haskell
generatePoem :: String -> IO String
generatePoem source = do
  mecab <- new ["mecab", "-l0"]
  nodeLines <- mapM (parseToNodes mecab) (lines source)
  let wordLines = map (filter (not . null) . map nodeSurface) nodeLines
  let allWords = intercalate ["\n"] wordLines

  let table = generateTable 3 (toWords allWords)

  begin <- initialWords table
  case begin of
    Nothing -> return ""
    Just ws -> chainWords table (tail ws) $ fromWords ws
```
まず引数に受け取ったテキストの各行を単語単位で分割されたリスト `wordLines` にします。分割には形態素解析ツールである [MeCab](http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html) の Haskell バインディングである [tanakh/hsmecab](https://github.com/tanakh/hsmecab) を用いました (ちょっと古い部分があったので [Fork したもの](https://github.com/morishin/hsmecab)を使っています)。

ソーステキストがこの3行の文章だとすると
```
サイアークがやられたようだな...
フフフ...奴は四天王の中でも最弱...
人間ごときに負けるとは魔族の面汚しよ...
```
このように各行を単語単位に分割して
```haskell
["サイ", "アーク", "が", "やら", "れ", "た", "よう", "だ", "な", "..."]
["フフフ", "...", "奴", "は", "四天王", "の", "中", "でも", "最", "弱", "..."]
["人間", "ごとき", "に", "負ける", "と", "は", "魔", "族", "の", "面汚し", "よ", "..."]
```
`intercalate` で間に改行文字列 `"\n"` を挟んでがっちゃんこします。これがコード内の `allWords` に当たります。
```haskell
["サイ", "アーク", "が", "やら", "れ", "た", "よう", "だ", "な", "...", "\n", "フフフ", "...", "奴", "は", "四天王", "の", "中", "でも", "最", "弱", "...", "\n", "人間", "ごとき", "に", "負ける", "と", "は", "魔", "族", "の", "面汚し", "よ", "..."]
```
この `String` のリストにさらに「文頭」と「文末」がどこにあるかという情報を持たせたかったので、新たに
```haskell
data Word = Begin | Middle String | End
```
という型を定義して `[String]` を次のような `[Word]` に変換しました。
```haskell
[Begin, Middle "サイ", Middle "アーク", ... , Middle "な", Middle "...", End, Begin, Middle "フフフ", ... , End]
```
これを`generateTable 3`で3語毎に切り出して次のようなテーブルを作ります。

1 | 2 | 3
---- | ---- | ---
(文頭) | サイ | アーク
サイ | アーク | が
アーク | が | やら
が | やら | れ
 ⋮ | ⋮ | ⋮
だ | な | ...
な | ... | (文末)
(文頭) | フフフ | ...
フフフ | ... | 奴
 ⋮ | ⋮ | ⋮
よ | ... | (文末)


これで準備が整いました。このテーブルから行を繰り返し選んで繋ぎ合わせていくことで文章を生成します。

行は次のルールで選んでいきます。

1. 最初に選べるのは (文頭) で始まる行のみ
2. 接頭語(前半の2語)が、前回選んだ行の接尾語(後半の2語)と等しい行

今回の例の場合、最初に選べるのは
```haskell
[Begin, Middle "サイ", Middle "アーク"]
[Begin, Middle "フフフ", Middle "..."]
[Begin, Middle "人間", Middle "ごとき"]
```
のどれかで、ここからランダムでひとつ選びます。<br>
コード中の `initialWords` がこの操作に当たります。

`[Begin, Middle "サイ", Middle "アーク"]` を選んだとすると、次に選べるのは `[Middle "サイ", Middle "アーク"` から始まる行です。<br>
この例では `[Middle "サイ", Middle "アーク", Middle "が"]` の行しかありませんが、複数候補がある場合にはその中からランダムにひとつ選びます。

このようにして候補をランダムに選択しながら繋げていき、 `End` で終わる行に辿り着く or 候補が無くなってしまったら終了します。<br>
コード中の `chainWords` がこの操作に当たり、再帰呼び出しによって繰り返し候補を選び繋ぎ合わせていき、生成された文章を`IO String`として返します。<br>
これが `String` ではなく `IO String` なのはランダムに候補を選択するという操作があり、関数を呼び出すたびに戻り値が変わるためです。

例に挙げた3行の文章では短すぎて候補が複数生まれず出力にランダム性が無いのですが、ソーステキストを小説の全文などの十分に長いものにすると実行する度に多彩なポエムが飛び出すようになります。<br>
記事冒頭の画像は宮沢賢治の『銀河鉄道の夜』をソースにして生成した文章です。別の例だと、太宰治の『走れメロス』をソースにするとこのような文章が得られました。
![](https://i.gyazo.com/34aa3c366d06b0d08c2853a2fcbf2a56.png)

### マルコフ連鎖
> 次の状態が現在を含めた過去N個の状態履歴に依存して決まる確率過程を、N階マルコフ連鎖（もしくは、N重マルコフ連鎖、N次マルコフ連鎖）という。 -- [Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB%E3%82%B3%E3%83%95%E9%80%A3%E9%8E%96)より

上記の実装は、次の語を前の2語によって選んでいるので2重マルコフ連鎖になるのでしょうか。しらんけど。

## 感想
- 構文とか全然わからなかったから[すごいH本](http://www.amazon.co.jp/dp/4274068854)を常に参照しながら書いてた
- 本で見たときはモナドよくわかってなかったけど書いてみたらちょっとわかった
- Atom のプラグイン良かった  (language-haskell + ide-haskell + haskell-ghc-mod + autocomplete-haskell)
  ![](https://i.gyazo.com/c757348c91b64a80edbf63cd70c09194.gif)
- わからない時にいろいろ教えてくれた [@ryota-ka](https://twitter.com/ryotakameoka) と [@lotz84](https://twitter.com/lotz84_) に感謝 🙏
- MeCab バインディングを作ってくださっていた [@tanakah](https://twitter.com/tanakh?lang=ja) に感謝 🙏

## ソースコード
https://gist.github.com/77745b1424fdb1ba8ce1

