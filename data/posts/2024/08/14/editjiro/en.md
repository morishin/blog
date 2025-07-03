---
keywords:
  - Swift
  - 開発
---

# Editjiro


<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240814/20240814173050.png" width="128" height="128" loading="lazy" />

https://github.com/morishin/Editjiro


I created Editjiro, a clone app of [Editaro](https://editaro.com/), which is a text editor for writing drafts before posting to emails or chats.


---

<img src="/posts/2024/08/14/editjiro/editjiro.png" width="796" height="562"/>

I love the concept of Editaro, but I felt frustrated that it doesn't run on Apple Silicon and that it's built with Electron (the heaviness of Chromium), so I made a clone app as a native macOS application using Swift.

There are also sibling apps like [Draftan](https://github.com/hokaccha/draftan) and [Editabro](https://r7kamura.com/articles/2022-07-17-editabro), which shows the popularity of Editaro.

Even though it's a clone app, it is even simpler than the original, just having a text area where the written content is saved locally.

I built it with SwiftUI, and the implementation is almost just this. [github](https://github.com/morishin/Editjiro/blob/b283ffcd907db1facb8c1c7dc05abb40e9ed7162/Editjiro/ContentView.swift#L13-L29)

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


I drafted this article using Editjiro.

Download here (macOS): https://github.com/morishin/Editjiro/releases/latest
