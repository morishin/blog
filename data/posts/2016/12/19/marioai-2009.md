---
keywords:
  - 開発
---

# 遺伝的アルゴリズムでやっていく Mario AI Competition 2009

この記事は [CAMPHOR- Advent Calendar 2016](http://advent.camph.net/) 19日目の記事です。

# Mario AI Competition 2009 とは
[Mario AI Competition 2009](http://julian.togelius.com/mariocompetition2009/index.php) は [Sergey Karakovskiy](https://scholar.google.com/citations?user=6cEAqn8AAAAJ&hl=ja) と [Julian Togelius](https://scholar.google.com/citations?user=lr4I9BwAAAAJ&hl=ja) という研究者の方が主催していたらしい大会で、スーパーマリオブラザーズ(を模したゲーム)を自動操作する AI を作ってスコアを競うというもの。スーパーマリオランではありません。

---

# やったこと
コードを読みながら手探りで動かしつつエージェントを実装し、簡単なステージをクリアするところまでできたのでやったことを紹介する。

- 準備
  - 公式からソースコードを zip で落としてきて開発環境を整備 (一番大変だった)
- 学習エージェントの実装
  - 遺伝的アルゴリズムによって動作を学習するエージェントを作成
- 結果
  - 1 世代 10 個体として学習させたところ 50 世代目あたりでゴールする個体が出てきた

世代 1
<iframe width="400" height="225" src="https://www.youtube.com/embed/DcbBqcn-LR4?rel=0" frameborder="0" allowfullscreen></iframe>

世代 40
<iframe width="400" height="225" src="https://www.youtube.com/embed/lmRZfCGzw0Q?rel=0" frameborder="0" allowfullscreen></iframe>

世代 50
<iframe width="400" height="225" src="https://www.youtube.com/embed/3bBGaMJ1uaA?rel=0" frameborder="0" allowfullscreen></iframe>

# 準備
スーパーマリオブラザーズのゲーム自体のプログラムもマリオを操作するエージェントのサンプルコードも Java で書かれていたけど、ゲームのプログラムはサーバーモードで実行できるオプションがあって、そのサーバーに対して [TCP 通信でマリオを操作することが可能](http://julian.togelius.com/mariocompetition2009/advanced.php)だったので、エージェントは任意の言語で作成することができるようになっていた。

プロジェクト内には Python で実装されたクライアントのサンプルがあったので、それを参考にして Python で学習エージェントを実装した。サンプルは Python 2 だったので初めに Python 3 に[変換](https://github.com/morishin/marioai-2009/commit/75475c1578674150a14a6eccb4048413eaeae761)し、その上で実装を行っている。

[公式](http://julian.togelius.com/mariocompetition2009/gettingstarted.php)に書いてあるコマンドをそのまま実行しても動かなかったので、実行できる方法を探って [README.md](https://github.com/morishin/marioai-2009/tree/yatteiku) に書いたりもした。

# 学習エージェントの実装
## マリオの行動選択
エージェントプログラムの入出力は下記の通り。
### 入力 (マリオの周囲の状態)
マリオの周りの[環境情報](https://github.com/morishin/marioai-2009/blob/master/src/ch/idsia/mario/environments/Environment.java)から使いたい以下の情報を抽出して入力とした。

- マリオの周囲 7 マスが障害物かどうか (7 bit)
- マリオがジャンプできる状態かどうか (1 bit)
- マリオが接地してるかどうか (1 bit)

<img width="200" src="https://g.morishin.me/6fe2b51593d10d4adb9f6ad3729b6d5b.png"/>

<img width="500" src="https://g.morishin.me/8597d6ca76811f184077b2075918ce4c.png" />

### 出力 (マリオの次の行動)
- ↓←→A(ジャンプ)B(ファイア/ダッシュ) をそれぞれ押すかどうか (5 bit)

<img width="330" src="https://g.morishin.me/4cd1bc55c06119f59f5865c559a6f484.png" />

## 遺伝的アルゴリズム
### 個体
入力と出力の組をひとつの遺伝子座で表現し、入出力の全パターンの情報を並べたものを遺伝子と見立てた。プログラム中ではただの int の配列。

<img width="400" src="https://g.morishin.me/81fa73d516152baee69d707cef45fb9e.png" />

### 選択・交叉・突然変異
試行と学習は下記の過程で行った。結果 50 世代目あたりでステージをクリアする個体を作ることができた。

1. 遺伝子座に乱数を振った初期個体を 10 体生成して第一世代とする
2. 第一世代にゲームをプレイさせてそれぞれのスコアを得る (スコアはマリオの移動距離が長いほど高い)
3. 一番スコアの高かった個体を 1 体そのまま次の世代へ残す (選択)
4. 親となる 2 個体を選出 (スコアが高かった個体ほど選ばれやすくする) して二点交叉させ子孫個体 2 体を生成する。これを繰り返して合計 9 体の子孫を生成し、先の 1 体と合わせて次の世代とする。
5. 子孫のうち 30% の個体を突然変異させる。突然変異は遺伝子座の組をランダムにいくつか選びその値を入れ替えた。
6. 生成された世代にゲームをプレイさせる。 -> 手順 3 に戻る

# ソースコード
ソースコードはここに置いた。

https://github.com/morishin/marioai-2009

ファイルが色々あるけど自分で実装したのは主にこのあたり。実装はきれいではないので読みたい人にはスミマセンという気持ち🙇

- 遺伝子(個体)のモデル https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/ga/individual.py
- 選択・交叉・突然変異の操作 https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/ga/controller.py
- 遺伝子情報を使ってマリオを操作するエージェント https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/agents/myagent.py
- 実際に実行するメインタスク https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/learn.py

# 所感
遺伝的アルゴリズムは交叉とか突然変異とか意味があるのか無いのかわからないようなことをやっていて正直適当な手法だなと思ったけど繰り返すことでそれなりに速く解に近づいていっているのは確かですごい。新幹線の形状や人工衛星のアンテナの形状の設計にも使われたりしたらしい。あと 2009 年に研究者の方が書かれたコードを読解するのが大変だった。
