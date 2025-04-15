---
keywords:
  - AWS
---

# #zoom-nomikai

This article is the 8th entry of the [CAMPHOR- Advent Calendar 2019](https://advent.camph.net/). The 7th entry was by [@asamas](https://twitter.com/asamas27) titled “[Obtaining Splatoon 2 Battle Data + Bonus](https://qiita.com/asamas/items/ec8c9adab8d49b0aa1ec)”.

I have been participating in the CAMPHOR- Advent Calendar since 2014, and this is my sixth time. Today, I will talk about the #zoom-nomikai channel in the CAMPHOR- community's Slack.

---

# What is CAMPHOR-

[CAMPHOR-](https://camph.net/) is originally a community for students interested in IT in Kyoto, which includes both graduates and current students in an offline and online setting. Student members use the town house [CAMPHOR- HOUSE](https://camph.net/#house) near Kyoto University as their activity space, while graduates either participate online or use the coworking space CAMPHOR- BASE located in Nakameguro, Tokyo. Communication occurs online via Slack (or Discord).

The 6th day's article was an introduction to CAMPHOR- BASE by [@watambo](https://twitter.com/watambo), so if you are interested, check it out 👉 https://note.com/viking/n/n8562bca82f95

# What is #zoom-nomikai

Originally a Kyoto-based community, many of the graduate members have moved away to various places such as Tokyo, Nagoya, and the United States. Nostalgic for the days spent working together in the cozy town house in Kyoto, we recently started an online drinking party called zoom-nomikai using the video conferencing system [Zoom](http://zoom.us/). Simply put, it's just a group of people connecting via video call and drinking beer at home.

<figure class="figure-image figure-image-fotolife" title="Scene of zoom-nomikai"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207180417.png" width="277" height="600" loading="lazy" /><figcaption>Scene of zoom-nomikai</figcaption></figure>

Previously, we used appear.in (now whereby.com) to do something similar, but we switched to Zoom for better call quality.

<figure class="figure-image figure-image-fotolife" title="Birth of zoom-nomikai"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207180850.png" width="414" height="220" loading="lazy" /><figcaption>Birth of zoom-nomikai</figcaption></figure>

# Features

- 🌏 Anyone can participate regardless of where they live
- 👛 Affordable
- 😪 You can fall asleep

Since there are no physical constraints, anyone can host or participate from home without stepping outside. Although I said there are no physical constraints, there is a time difference, so when talking with members in the U.S., they might be having coffee in the early morning.

You only drink what you have at home, and you don’t have to drink at all, so there’s no basic fee.

You don’t have to worry about the last train even if you drink a lot, and you can just go to sleep afterward, which is convenient.

# Slack Channel and Notifications

To gather other members who are also in the mood for a drink at home, we have implemented the #zoom-nomikai channel on Slack along with notifications for joining Zoom.

<figure class="figure-image figure-image-fotolife" title="Slack Notification"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181016.png" width="414" height="223" loading="lazy" /><figcaption>Slack Notification</figcaption></figure>

The notification feature of the Zoom application is not particularly rich, but it can send an email notification to the host's email address when "participants join the meeting before the host." We utilized this to send notification messages to the Slack channel.

<figure class="figure-image figure-image-fotolife" title="Zoom Notification Settings"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181043.png" width="260" height="171" loading="lazy" /><figcaption>Zoom Notification Settings</figcaption></figure>

This is the flow of notifications:

<figure class="figure-image figure-image-fotolife" title="Notification Function Structure"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191208/20191208000642.png" width="600" height="136" loading="lazy" /><figcaption>Notification Function Structure</figcaption></figure>

Lambda looks like this.

<figure class="figure-image figure-image-fotolife" title="Lambda"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20191207/20191207181131.png" width="535" height="296" loading="lazy" /><figcaption>Lambda</figcaption></figure>

💡 A recommended tip for Lambda is to create a [Lambda Layer](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-layers.html) with only [axios](https://github.com/axios/axios) installed. This way, you can quickly write and complete a simple HTTP request Lambda directly in the web console, which is convenient.

Also, a minor tip is that SES does not have a Tokyo region (as of 2019), so you need to use the same region as SES instead of the Tokyo region for Lambda.

You could use the standard [Slack email integration](https://slack.com/intl/ja-jp/help/articles/206819278-Slack-%E3%81%A7%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%92%E5%8F%97%E4%BF%A1%E3%81%99%E3%82%8B) without creating something like this, but since there is a limit on the number of Slack Apps you can use on the free Slack plan, I opted for a configuration that only uses Incoming Webhooks 👛

The webhook feature is also available in Discord, so this configuration can be used in a Discord community as well.

# Conclusion

zoom-nomikai can be started by anyone with a home🏠, internet📱, and canned beer🍺. How about joining a nearby community?