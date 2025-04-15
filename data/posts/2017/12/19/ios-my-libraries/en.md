---
keywords:
  - iOS
  - Swift
---

# Introduction to My Personal Libraries ×6

This article is the 19th entry of the [CAMPHOR - Advent Calendar 2017](https://advent.camph.net/).

I have extracted and published several libraries implemented for iOS development, whether for personal use or for work. I hope they can be helpful to someone.

---

## BetterUserDefaults

https://github.com/morishin/BetterUserDefaults

This allows you to use a `UserDefaults.Key` type to define UserDefaults keys instead of using strings, similar to `Notification.Name`.

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

An extension that allows you to add borders of arbitrary color and thickness to the four sides of a UIView. The border itself is also a UIView, so it supports dynamic resizing of the parent view through AutoLayout.

```swift
view.addBorderViews(positions: [.left, .bottom], color: .red, width: 3)
```

<img alt="UIViewBorders" src="http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20171217/20171217124149.png?1513482153" width="320px" />

## KeyboardFriendlyScrolling

https://github.com/morishin/KeyboardFriendlyScrolling

This sets the `contentInset.bottom` of the scroll view to the height of the keyboard. It calculates the overlapping height by converting and comparing the frames of the `scrollView` and the keyboard to the coordinates on the `window`, so it should work properly even if the `scrollView` does not fill the entire screen.

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

A UIActivity to place a "Copy Link" button in the iOS share options.

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

While the standard share options include "Copy," there was a bug in iOS 11.1 where passing both a string and a URL to `activityItems` would cause the URL to be ignored, and only the string would be copied to the clipboard. Therefore, I created one that can properly copy only the URL.

Details of the bug

https://twitter.com/hajipion/status/935129634533814272

## RFC3339DateFormatter

https://github.com/morishin/RFC3339DateFormatter

Even though the server says, "I'll send it in RFC3339 format," the specification is quite flexible, so I created a DateFormatter that can parse it even with variations. The implementation follows the specifications of [RFC 3339 - Date and Time on the Internet: Timestamps](https://tools.ietf.org/html/rfc3339#page-8).

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

Feelings

https://twitter.com/morishin127/status/928818427577344000

## EasyButton

https://github.com/morishin/EasyButton

A simple way to create buttons easily. When you specify the main color, it automatically calculates and sets the highlighted color, which is a nice feature.

```swift
// Set a darker color than the background color to the highlighted background color automatically
let lightColorButton = UIButton.button(title: "Hello World", titleColor: .white, backgroundColor: .orange, cornerRadius: 6)

// Set a lighter color than the background color to the highlighted background color automatically
let darkColorButton = UIButton.button(title: "Hello World", titleColor: .white, backgroundColor: .darkGray, cornerRadius: 6)
```

<img src="https://user-images.githubusercontent.com/1413408/33931973-048ce58a-e035-11e7-930b-73fa7d04cda0.gif" width="320px" />

In addition to the above, the following functions are also available, so it can be used independently.

```swift
extension UIButton {
    public func setBackgroundColor(color: UIColor, for state: UIControlState)
    public func setBackgroundColor(color: UIColor, highlightedColor: UIColor? = nil)
    public func setCornerRadius(radius: CGFloat)
    public func setup(title: String? = nil, titleColor: UIColor, backgroundColor: UIColor, highlightedColor: UIColor? = nil, cornerRadius: CGFloat = 0)
}
```

## Reflection on the Advent Calendar
Looking back, I have participated in this [Advent Calendar](https://advent.camph.net/) every year since 2014, making it my fourth year.

### 2014

https://blog.camph.net/news/useful-yo/

https://tech.camph.net/python-guruguru/

### 2015

http://blog.morishin.me/posts/2015/12/19/bitcoin-chart-bot

### 2016

http://blog.morishin.me/posts/2016/12/19/marioai-2009

### 2017

→ This article

I look forward to next year as well.