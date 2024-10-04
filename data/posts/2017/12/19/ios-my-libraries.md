---
keywords:
  - iOS
  - Swift
---

# iOS 自分用ライブラリ紹介×6

この記事は [CAMPHOR- Advent Calendar 2017](https://advent.camph.net/) 19日目の記事です。

私用だったり業務用だったりで実装した iOS 開発向けのライブラリをいくつか切り出して公開したのでご紹介です。
誰かの役に立ったらうれしいです。

---

## BetterUserDefaults

https://github.com/morishin/BetterUserDefaults

Notification の `Notification.Name` のように UserDefaults のキーも文字列でなく `UserDefaults.Key` 型で定義したものを使えるようにしたもの。

```swift
import BetterUserDefaults

extension UserDefaults.Key {
    static let sampleKeyA = UserDefaults.Key("sampleKeyA")
    static let sampleKeyB = UserDefaults.Key("sampleKeyB")
}

UserDefaults.standard.set(true, for: .sampleKeyA)
UserDefaults.standard.set(123, for: .sampleKeyB)

UserDefaults.standard.bool(for: .sampleKeyA)       // true
UserDefaults.standard.integer(for: .sampleKeyB)    // 123
```

## UIViewBorders

https://github.com/morishin/UIViewBorders

UIView の四辺に任意の色・太さのボーダーが付けられる Extension 。ボーダー自体も UIView なので AutoLayout による親ビューの動的なサイズ変更にも対応してる。

```swift
view.addBorderViews(positions: [.left, .bottom], color: .red, width: 3)
```

<img alt="UIViewBorders" src="http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20171217/20171217124149.png?1513482153" width="320px" />

## KeyboardFriendlyScrolling

https://github.com/morishin/KeyboardFriendlyScrolling

キーボードの高さの分だけスクロールビューの `contentInset.bottom` を設定してくるもの。`scrollView` とキーボードのフレームを `window` 上の座標に変換・比較して被ってる高さを計算しているので `scrollView` が画面いっぱいじゃなくてもちゃんと動くはず。

```swift
import UIKit
import KeyboardFriendlyScrolling

class ViewController: UIViewController {
    private var keyboardFriendlyScrollController: KeyboardFriendlyScrollController?

    @IBOutlet private weak var scrollView: UIScrollView!

    override func viewDidLoad() {
        super.viewDidLoad()
        keyboardFriendlyScrollController = KeyboardFriendlyScrollController(viewController: self, scrollView: scrollView).start()
    }
}
```

<img src="https://user-images.githubusercontent.com/1413408/33512092-0efe68ee-d76c-11e7-848f-b1bd170eb3e7.gif" width="320px" />

## CopyLinkActivity

https://github.com/morishin/CopyLinkActivity

iOS の共有先に「リンクをコピー」ボタンを置くための UIActivity。

```swift
import UIKit
import CopyLinkActivity

class ViewController: UIViewController {
    @IBAction func didTapShareButton(_ sender: UIButton) {
        let linkURL = URL(string: "https://www.apple.com/")!
        let activityViewController = UIActivityViewController(activityItems: [linkURL], applicationActivities: [CopyLinkActivity()])
        activityViewController.completionWithItemsHandler = { [weak self] (activityType, completed, _, _) -> Void in
            if completed && activityType == CopyLinkActivity.defaultActivityType {
                let alert = UIAlertController(title: "Copied", message: linkURL.absoluteString, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true)
            }
        }
        present(activityViewController, animated: true)
    }
}
```

<img src="https://user-images.githubusercontent.com/1413408/33467848-094aaa38-d69b-11e7-8a55-2849abe7d8a3.gif" width="320px" />

標準で用意されている共有先にも「コピー」はあるけど iOS 11.1 でバグってて `activityItems` に文字列と URL を両方渡すと URL が無視されて文字列のみがクリップボードにコピーされてたりしたので URL のみをちゃんとコピーできるものを作った。

不具合の様子

https://twitter.com/hajipion/status/935129634533814272

## RFC3339DateFormatter

https://github.com/morishin/RFC3339DateFormatter

サーバーが「RFC3339 フォーマットで送るね〜」って言ってもわりと柔軟な仕様なので、揺れがあってもパースできるような DateFormatter を作った。仕様は [RFC 3339 - Date and Time on the Internet: Timestamps](https://tools.ietf.org/html/rfc3339#page-8) に従って実装している。

Date from String

```swift
import RFC3339DateFormatter

// with T, nanosecond
RFC3339DateFormatter.date(from: "2017-01-01T00:00:00.000Z")
RFC3339DateFormatter.date(from: "2017-01-01T09:00:00.000+09:00")
// with T
RFC3339DateFormatter.date(from: "2017-01-01T00:00:00Z")
RFC3339DateFormatter.date(from: "2017-01-01T09:00:00+09:00")
// with ` `, nanosecond
RFC3339DateFormatter.date(from: "2017-01-01 00:00:00.000Z")
RFC3339DateFormatter.date(from: "2017-01-01 09:00:00.000+09:00")
// with ` `
RFC3339DateFormatter.date(from: "2017-01-01 00:00:00Z")
RFC3339DateFormatter.date(from: "2017-01-01 09:00:00+09:00")
// different number of digits of nanosecond
RFC3339DateFormatter.date(from: "2017-01-01 00:00:00.0Z")
```

Date to String

```swift
import RFC3339DateFormatter

RFC3339DateFormatter.string(from: Date()) // "2017-12-01T06:25:11.029Z"
```

気持ち

https://twitter.com/morishin127/status/928818427577344000

## EasyButton

https://github.com/morishin/EasyButton

シンプルなボタンを簡単に作れるもの。メインの色を指定するとハイライト時の色も勝手に計算して設定してくれるのがステキポイント。

```swift
// Set a darker color than the background color to the highlighted background color automatically
let lightColorButton = UIButton.button(title: "Hello World", titleColor: .white, backgroundColor: .orange, cornerRadius: 6)

// Set a lighter color than the background color to the highlighted background color automatically
let darkColorButton = UIButton.button(title: "Hello World", titleColor: .white, backgroundColor: .darkGray, cornerRadius: 6)
```

<img src="https://user-images.githubusercontent.com/1413408/33931973-048ce58a-e035-11e7-930b-73fa7d04cda0.gif" width="320px" />

上記の他に下記の関数も生えるので単品でも使える。

```swift
extension UIButton {
    public func setBackgroundColor(color: UIColor, for state: UIControlState)
    public func setBackgroundColor(color: UIColor, highlightedColor: UIColor? = nil)
    public func setCornerRadius(radius: CGFloat)
    public func setup(title: String? = nil, titleColor: UIColor, backgroundColor: UIColor, highlightedColor: UIColor? = nil, cornerRadius: CGFloat = 0)
}
```

## アドベントカレンダー振り返り
振り返るとこの [Advent Calendar](https://advent.camph.net/) も2014年から毎年参加していて4年目になります。

### 2014

https://blog.camph.net/news/useful-yo/

https://tech.camph.net/python-guruguru/

### 2015

http://morishin.hatenablog.com/entry/bitcoin-chart-bot

### 2016

http://morishin.hatenablog.com/entry/marioai-2009

### 2017

→ この記事

来年もよろしくお願いいたします。
