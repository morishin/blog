---
keywords:
  - 開発
  - Swift
---

# Swift っぽい UserDefaults

## Swift 3 の Notification

Swift 3 から [`Notification.Name`](https://developer.apple.com/reference/foundation/nsnotification.name) 型が追加され、Notification の名前に生の文字列ではなく `Notification.Name` 型の値を指定できるようになった。

---

```swift
extension Notification.Name {
    static let userLoggedOut = Notification.Name("UserLoggedOut")
}
let n = Notification(name: .userLoggedOut, object: nil)
```

参考: [Swift 3 以降の NotificationCenter の正しい使い方](http://qiita.com/mono0926/items/754c5d2dbe431542c75e)


## Swift っぽい UserDefaults

UserDefaults のキーはまだ生の文字列を使っているけど、新しい Notification のようなインターフェイスで扱えたらうれしいなと思って薄いライブラリを書いた。

https://github.com/morishin/BetterUserDefaults


こんな感じで書ける。
```swift
import BetterUserDefaults

extension UserDefaults.Key {
    static let someKey = UserDefaults.Key("someKey")
}

UserDefaults.standard.set(true, for: .someKey)
UserDefaults.standard.bool(for: .someKey) // true
```
`Notification.Name` と同じように `UserDefaults.Key` という型でキー名を定義して使う。

## ソースコード
1ファイルだけの簡単なコード。
 [UserDefaults+Key.swift](https://github.com/morishin/BetterUserDefaults/blob/master/Sources/BetterUserDefaults/UserDefaults%2BKey.swift)

## 所感
このためにライブラリ入れるのもアレだし標準でこんな感じになればいいな。

~~あと書いてから気付いたけど全く同名のライブラリがあって同じようなことしてた。~~
(僕の方も最初 SwiftyUserDefaults にしてたけど BetterUserDefaults にリネームした)

https://github.com/radex/SwiftyUserDefaults

