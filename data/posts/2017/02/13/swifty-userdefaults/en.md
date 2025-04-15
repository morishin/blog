---
keywords:
  - 開発
  - Swift
---

# Swift-like UserDefaults

## Notification in Swift 3

Starting from Swift 3, the [`Notification.Name`](https://developer.apple.com/reference/foundation/nsnotification.name) type was introduced, allowing the use of `Notification.Name` type values instead of raw strings for notification names.

---

```swift
extension Notification.Name {
    static let userLoggedOut = Notification.Name("UserLoggedOut")
}
let n = Notification(name: .userLoggedOut, object: nil)
```

Reference: [Proper Use of NotificationCenter in Swift 3 and Later](http://qiita.com/mono0926/items/754c5d2dbe431542c75e)

## Swift-like UserDefaults

Although UserDefaults still uses raw strings for keys, I thought it would be nice to handle them with an interface similar to the new Notification, so I wrote a lightweight library.

https://github.com/morishin/BetterUserDefaults

You can write it like this:
```swift
import BetterUserDefaults

extension UserDefaults.Key {
    static let someKey = UserDefaults.Key("someKey")
}

UserDefaults.standard.set(true, for: .someKey)
UserDefaults.standard.bool(for: .someKey) // true
```
Just like `Notification.Name`, you define and use key names with a type called `UserDefaults.Key`.

## Source Code
A simple code in just one file.
 [UserDefaults+Key.swift](https://github.com/morishin/BetterUserDefaults/blob/master/Sources/BetterUserDefaults/UserDefaults%2BKey.swift)

## Thoughts
It feels a bit off to add a library just for this, and I wish it could be like this in the standard library.

~~Also, I realized after writing this that there is a library with the exact same name doing something similar.~~
(I initially named mine SwiftyUserDefaults but renamed it to BetterUserDefaults)

https://github.com/radex/SwiftyUserDefaults