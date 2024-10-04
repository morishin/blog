---
keywords:
  - Swift
  - 開発
---

# エディ次郎


<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240814/20240814173050.png" width="128" height="128" loading="lazy" />

https://github.com/morishin/Editjiro


メールやチャットへ投稿する前に下書きを書くためのテキストエディタである[エディ太郎](https://editaro.com/)のクローンアプリ、エディ次郎を作りました。


---



エディ太郎のコンセプトは大好きなのですが、Apple Silicon で動かないことと Electron 製であること(Chromium の重さ)につらみを感じたので Swift 製のネイティブ macOS アプリケーションとしてクローンアプリを作りました。

他にも兄弟?(姉妹?)アプリに [Draftan](https://github.com/hokaccha/draftan) や[エディタブ郎](https://r7kamura.com/articles/2022-07-17-editabro)があり、エディ太郎の人気が窺えますね。

クローンアプリといっても本家よりもさらにシンプルで、ただテキストエリアがあって書いた内容がローカルに保存されているというだけです。

SwiftUI で構築しましたが、実装はほぼこれだけ。 [github](https://github.com/morishin/Editjiro/blob/b283ffcd907db1facb8c1c7dc05abb40e9ed7162/Editjiro/ContentView.swift#L13-L29)

```swift
struct ContentView: View {
    @AppStorage("text") private var text = ""
    @AppStorage("fontSize") private var fontSize: Double = 18
    @FocusState private var isFocused: Bool

    var body: some View {
        TextEditor(text: $text)
            .background(Color.editorBackground)
            .font(.system(size: fontSize))
            .foregroundStyle(Color.editorText)
            .focused($isFocused)
            .preferredColorScheme(.dark)
            .onAppear {
                isFocused = true
            }
    }
}
```


この記事もエディ次郎で下書きしました。

ダウンロードはこちら (macOS) : https://github.com/morishin/Editjiro/releases/latest

