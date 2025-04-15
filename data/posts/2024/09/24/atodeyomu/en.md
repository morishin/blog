---
keywords:
  - 開発
  - React
---

# I Created a Web App for a "ato de yomu" Reading List

I created a web app for a "ato de yomu" (Japanese for “read later”) reading list.

https://atodeyomu.morishin.me/

I'm not sure if "reading list" is a common term, but it refers to the reading list feature that comes with Safari. The "ato de yomu" app has the following features:

* You can save web articles that you want to read later.
* You can keep a history of articles you have read.
* You can view and subscribe to other people's lists.

---

<figure class="figure-image figure-image-fotolife" title="App Screen"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924144235.png" width="600" height="545" loading="lazy" /><figcaption>App Screen</figcaption></figure>

This is my page.

https://atodeyomu.morishin.me/morishin


## Motivation

### As a Tool for Managing Unread Articles

I often save articles I come across on the internet to read later, but Safari's reading list was not very satisfactory. While it's easy to add articles when using Safari on iOS, it's not as convenient when using Chrome on a PC. Since I have to open it from Safari, it doesn't fit well with my lifestyle of using other browsers.

With "Read Later," you can add articles from the iOS share sheet by utilizing iOS shortcuts, and since it provides an article addition API, users can add articles in their preferred way. I'm a heavy user of Alfred, so I also provide an Alfred Workflow.

iOS Share Sheet | Alfred Workflow
---- | ----
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924145653.jpg" width="355" height="339" loading="lazy" /> | <img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924145712.png" width="600" height="135" loading="lazy" />


### As a Tool for Information Gathering

Another motivation was my desire to know about interesting web information that everyone is reading. Although I'm interested in information about new technologies, I'm not very good at catching information myself; I often just glance at what flows through 𝕏 or look at media like https://jser.info/ where individuals compile and share articles. JSer.info is a platform where [azu](https://x.com/azu_re) shares information collected from the internet, and I thought it would be interesting if highly sensitive engineers around me shared the articles they read, which led me to create a publicly available reading list on the internet. I wanted to create an app that allows users to share the articles they are reading! However, if the sharing side has no benefits, it wouldn't be used, so I aim for a form that naturally shares the reading list in a way that is beneficial for the users. I don't know if this will go as planned, but since I wanted this app for my own use, even if it doesn't become popular, that's fine too... Each user's page has an RSS feed URL, which can be subscribed to using reader apps or Slack. The reading list can also be set to private, allowing it to be used as a completely personal list.

## Technical Discussion

I considered frameworks like Rails, Next.js, Remix, and Hono, and ultimately chose Next.js v15 (still in RC at the time of development). The database is Supabase, and the app is deployed on Vercel, using Vercel Blob (object storage) as well. I initially started development with Hono + Cloudflare + D1 because I wanted to use Cloudflare D1, but I switched to Next.js after realizing the benefits of combining React 19 (still in RC at the time of development) with Next.js's Server Actions.

https://x.com/morishin127/status/1807593521396036039

https://x.com/morishin127/status/1807240643770728771

It's amazing to attach async to components and directly fetch data from the DB. To achieve this (or so I believe), a rather complex setup has emerged, and I honestly think that recent React and Next.js can be a bit daunting, but I like it.

<figure class="figure-image figure-image-fotolife" title="Using server components allows you to read data directly within components and render it."><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924154205.png" width="600" height="364" loading="lazy" /><figcaption>Using server components allows you to read data directly within components and render it. (<a href="https://ja.react.dev/reference/rsc/server-components">Source</a>)</figcaption></figure>

[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) are also impressive; you can write backend logic inside components and pass that function to the `<form>` action to make it work.

<figure class="figure-image figure-image-fotolife" title="Example of Server Actions"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20240924/20240924154655.png" width="600" height="400" loading="lazy" /><figcaption>Example of Server Actions (<a href="https://zenn.dev/uhyo/books/react-19-new/viewer/form-action#form%E3%81%A8server-actions%E3%81%A8%E3%81%AE%E9%96%A2%E4%BF%82">Source</a>)</figcaption></figure>

I found these aspects interesting and wanted to try them out, which ultimately led me to use Next.js.

I also struggled a lot with what to use for the database and schema management, but I decided to use Postgres and Prisma, hand-writing schema.prisma but not using Prisma's migration feature, opting instead to use [psqldef](https://github.com/sqldef/sqldef).

https://x.com/morishin127/status/1808044296664502477

I execute migrations with a script like this. It has become excellent to define and manage schemas declaratively without migration files.

```sh
$ npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output db/schema.sql
$ psqldef -U $POSTGRES_USER -p $POSTGRES_PORT $POSTGRES_DATABASE --enable-drop-table < db/schema.sql
```

I initially released the app with only English, but later implemented multilingual support, and now it can be displayed in Japanese as well.

https://x.com/morishin127/status/1869647972100964820

The source code is open, so if you're interested, please take a look.

https://github.com/morishin/atodeyomu.morishin.me