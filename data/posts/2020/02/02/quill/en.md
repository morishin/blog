---
keywords:
  - Firebase
  - 開発
  - Swift
---

# I created a snippet completion tool called Quill

## Table of Contents

Here👇

https://quill.morishin.me/

## Demo

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/388694912?color=26a69a&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>



---



## Features

This app allows you to register code snippets, words, and sentences along with their trigger text, which will replace the input string when the trigger is typed.

For example, if you set it up as shown in the image below, typing `` `img `` will instantly replace it with `` `img `` as `<img src="" width="320"/>`.

<img src="https://i.gyazo.com/1b0b273724469e6530ed8bea4a7450ab.png" width="320"/>

I frequently use the img tag in issues and PRs, but typing it out is tedious, so this is my most used snippet. I also register other things that are cumbersome to type, like emoticons and my address.

## How to Use

You can download it from [https://quill.morishin.me/](https://quill.morishin.me/).

I apologize for the complexity, but just downloading and launching it won’t make it usable. You need to drag and drop Quill.app into the app list under "System Preferences > Security & Privacy > Accessibility" before launching it 🙇

<img src="https://i.gyazo.com/8407883571c96dcfa90496cd6409e44b.png" width="320"/>

Once launched, click the "+" button in the bottom left to add the trigger text, input the snippet in the text area on the right, and click "Save."

<img src="https://i.gyazo.com/36c768d3481e72f44d8562626b735502.png" />

After saving, try typing the trigger in any suitable editor. The text will be replaced after input.

<img src="https://i.gyazo.com/e537de1baa29622543a2659be42cc817.gif" width="320"/>

## License Purchase

Initially, you can only register one snippet. You can purchase a one-time license ($5) from the "PURCHASE LICENSE" button on the same page, and by entering the license key sent to you via email into the app, the registration limit will become unlimited.

You will receive an email like this:

<img src="https://i.gyazo.com/16415b4c99489546c2dea4e962b3c78d.png" width="480"/>

Enter it on this screen in the app.

<img src="https://i.gyazo.com/8112cc8c9391980d340b83961cf56332.png" width="480"/>

## Development Background

I was using the Code Snippet Manager feature of the documentation browser app [Dash for macOS](https://kapeli.com/dash) conveniently, but I was starting to use it less for viewing documents, and since the license renewal was paid, I decided to stop using Dash and create my own version of the Code Snippet Manager feature.

## Technologies Used

### Main Application

It is a regular macOS app written in Swift. I developed it in Xcode and distributed the .app that was notarized with Apple notary service [Notarization](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution) as a zip file. I thought it would be tough to create my own billing and automatic update mechanisms, so I initially tried to publish it on the App Store, but I was told that apps requiring accessibility permissions cannot be distributed through the store, so I am distributing it myself. I managed to create a billing system, but I haven't implemented automatic updates.

The snippet data is stored in a trie structure, and I search the trie with each key input. The main logic part is library-ized and open-sourced, so feel free to check it out if you're interested. The pronunciation of the name is the same as [try! Swift](https://www.tryswift.co/).

https://github.com/morishin/trie-swift


### Billing

I implemented it using Stripe and Cloud Functions. It is built with the same structure as what I wrote in a past article, so please check there for details.

https://blog.morishin.me/posts/2018/12/17/stripe-firebase-payment


### License Issuance and Distribution

I hook the successful payment callback in Cloud Functions to generate and email the license key. I used [SendGrid](https://sendgrid.kke.co.jp/) for email distribution.

With SendGrid, you can create email templates graphically from the web console like this, which was super convenient. No coding required!

<img src="https://i.gyazo.com/4642ca04547bfc3d9f547ae343d2d168.png" />

### Web Page

I simply wrote HTML and deployed it to Firebase Hosting. DNS and CDN are provided by [CloudFlare](https://www.cloudflare.com/).

## Finally

It's convenient, so please give it a try if you'd like 😊

https://quill.morishin.me/