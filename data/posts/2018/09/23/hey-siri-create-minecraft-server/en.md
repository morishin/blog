---
keywords:
  - Minecraft
  - 開発
  - iOS
---

# Using Siri Shortcuts to "Hey Siri, Start a Minecraft Server"

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923035423.png" width="462" height="228" loading="lazy" />

With the release of iOS 12, Siri Shortcuts has become available. You can define processes in a GUI programming-like manner from the [“Shortcuts” app](https://itunes.apple.com/jp/app/workflow/id915249334?mt=8).

In the past, I created a Lambda Function to set up a Minecraft multiplayer server and wrote an article about invoking it from Slack's Slash Commands.

https://blog.morishin.me/posts/2017/02/21/minecraft-lambda-function

This time, I made it possible to invoke this Lambda Function from Siri Shortcuts instead of Slack, allowing you to start the server with the call <b>"Hey Siri, start a Minecraft server."</b>

---

Here’s how it works. (It seems to be executing multiple times, and error logs are flowing into Slack 🙇)

<iframe width="560" height="315" src="https://www.youtube.com/embed/OzKVTaXGVnM?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Mechanism

The mechanism is roughly as shown in the diagram below; I simply changed the endpoint of the API Gateway that was previously invoked from Slack's Slash Commands to be invoked from Siri Shortcuts.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923041522.png" width="512" height="262" loading="lazy" />

## Creating the Shortcut

Creating a Siri Shortcut is easy; you just need to send a POST request with parameters to the API Gateway endpoint, resulting in a short definition like the one in the image below. I connected an action that executes an HTTP request to "Get Contents of URL" under the action that specifies the URL, and simply specified the request method and parameters.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040443.jpg" width="252" height="512" loading="lazy" />

After that, just record a phrase to execute it with "Hey Siri," and you're done.

<div class="images-row mceNonEditable"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040816.png" width="288" height="512" loading="lazy" /><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180923/20180923040819.png" width="288" height="512" loading="lazy" /></div>

## Thoughts

Creating Siri Shortcuts is fun and easy, like GUI programming, all done on the iPhone! This time, I only sent an API request, but with control structures including condition branching, you can write a wide variety of processes, which opens up a lot of possibilities.