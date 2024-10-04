---
keywords:
  - 開発
  - React
---

# React Hooks の感想

React Hooks は最初は何が嬉しくてこんな書き方をしないといけないのか訳がわからなかったけど、しばらく使ってみた実感として大きなメリットは2つで

- クラスを使わなくて良くなる
- コンポーネントのステートやライフサイクルに結合していた処理を Hooks 関数の形で切り出して、複数のコンポーネントで使い回せるようになる

と理解した。


---


クラスを使うのがなんで辛いかは下の動画でも言われているけど、端的に言うと Hard for humans であること。`this` がむずいし `bind` が大変。

<figure class="figure-image figure-image-fotolife" title="Hard for humans"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20200423/20200423233813.png" width="419" height="233" loading="lazy" /><figcaption>Hard for humans</figcaption></figure>

<iframe width="560" height="315" src="https://www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

後者の話は Custom Hooks を使ったり書いたりしてみると分かりやすいけど、例えば次のようなコンポーネントの State を操作するようなロジックが関数としてコンポーネントと切り離して定義できるのが嬉しいということ。

https://github.com/jaredLunde/react-hook/tree/c50c3f58bffda8dc448e1a5ef539add9164d5d43/packages/toggle

クラスで定義されたコンポーネントだとどうしても `this.state` や `this.setState` を使って書くことになるため、コンポーネントクラスと密結合な実装になり、ポータブルに他のコンポーネントでも使い回せる処理として切り出すことが難しい。

逆に Hooks のデメリットというか入門のハードルとして、インターフェイスを見ただけだと内部実装のブラックボックス感が強くて挙動がよく分からないのがしんどかった。

このあたりの記事を読むと Hooks の気持ちになれて、モヤモヤせずに書けるようになったのでおすすめ。

個人的にファンである Netlify のブログ。Hooks 自体のミニ再現実装をしながら丁寧に解説してくれている。

https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/

こちらもそんな感じで丁寧な図解をしてくれている。

https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e

躓きがちな `useEffect` にフォーカスを当てた長編記事。これは読まなくてもいい気がするけど面白い。

https://overreacted.io/ja/a-complete-guide-to-useeffect/

クラスコンポーネントでも機能的には困らないけど、これからエコシステムも Hooks 中心になっていくだろうから、自分で書く実装も Hooks を使っていくのが良さそう。

あと Hooks には依存配列ってやつがあるけど僕はあれの書き漏らしを無限にやって無限にハマってたので [React Hooks のルール](https://github.com/jaredLunde/react-hook/tree/c50c3f58bffda8dc448e1a5ef539add9164d5d43/packages/toggle)をチェックしてくれる Linter は必須だった。すぐに入れるべき。

https://www.npmjs.com/package/eslint-plugin-react-hooks

