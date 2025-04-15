---
keywords:
  - React
  - Rails
  - 開発
---

# Migrated the "Things I Bought and Was Glad I Did" Site from Heroku (Rails) to Vercel (Next.js)

This article is the 18th entry in the [CAMPHOR - Advent Calendar 2022](https://advent.camph.net/).

I released and have been operating a website called "[Things I Bought and Was Glad I Did](https://katteyokatta.morishin.me/)" in 2017, and now, after five years since its release, I have completely rewritten it from scratch with a new tech stack for PaaS migration, so I’d like to share that story.

The source code is also publicly available.

https://github.com/morishin/katteyokatta.morishin.me

---

## What is "Things I Bought and Was Glad I Did"?

"Things I Bought and Was Glad I Did" is a service for posting and sharing items that were good purchases on Amazon. You can also turn the links to the products you post into your affiliate links. The purpose is to improve the quality of life by sharing things you like with others or learning about things that acquaintances enjoy. For more details, please see the [release article](https://blog.morishin.me/posts/2018/05/21/release-katteyokatta).

https://katteyokatta.morishin.me/

![](https://i.gyazo.com/b7edc6d526cdf3d90e68f96f41bc7b8f.png)

## Consideration for Migration Due to End of Heroku Free Plan

As mentioned in the release article, it was originally implemented as a Rails app and deployed on Heroku. I also used Heroku's Postgres and Redis as the data store.

>I was thinking about what to do with the server and deployment methods, whether to use Docker, whether to go with GCP or AWS for cloud services, but after consulting with a colleague, it seemed that Heroku was cheap, easy, and the best option, so I went with Heroku. As a result, I was just barely within the free tier, and deploying was just a matter of doing a git push, which was incredibly easy and great. Even if I went over the free tier, I thought I would probably just pay normally.

However, on August 25, 2022, Heroku announced the [end of the free plan](https://blog.heroku.com/next-chapter). Although I mentioned that I would probably just pay normally if I exceeded the free tier, upon hearing this news, I quickly changed my mind and began preparing for a night escape.

https://twitter.com/morishin127/status/1563321285202980865

As a hobby app developer, I spare no effort in trying to keep server costs free. I want to operate it for free at all costs. Initially, I looked for a place to migrate while keeping it as Rails, considering options like Render, Railway, and Fly.io, but they didn’t seem to offer free plans at first glance. At this point, I decided to stop being attached to Rails. Moreover, there were few options to keep the database free, and I could only think of Firestore (NoSQL) or [PlanetScale](https://planetscale.com/) (a MySQL-compatible DBaaS) with a free tier. AWS DynamoDB also has a decent free tier, right?

## Migration to Vercel + PlanetScale

I don’t dislike Rails, but I wanted to use JavaScript for UI representation in some parts, so I decided to migrate to [Next.js](https://nextjs.org/), which allows for SSR and can also provide APIs. I previously mentioned in a [Modern Web Frontend Study Group](https://techlife.cookpad.com/entry/2022/06/21/130736) that I felt it was tough to use Rails if I wanted to write even a little React.

<img src="https://i.gyazo.com/2c374afefcbdaa63e5f05d7f91e38534.png"/> <img src="https://i.gyazo.com/75a6d085b3e36cbda4b8005555318413.png"/>

It is feasible to write the API only in Rails, but considering that it would result in two applications, two programming languages, and double the maintenance costs for upgrades, it poses a significant disadvantage for individual developers. As mentioned earlier, there were few options for the database, and since I preferred RDB over NoSQL, I chose PlanetScale, which has a free tier and is MySQL compatible.

## New App Tech Stack (Next.js + Prisma + tRPC)

The old app was in Rails, using Vue.js for the UI parts that required interaction. The styling was done using [Materialize](https://materializecss.com/).

In the new app, I adopted Next.js, with [Prisma](https://www.prisma.io/) as the database client and [tRPC](https://trpc.io/) for the API server and client. The APIs accessed by the client are provided as Next.js API Routes, so there is only one backend application. For styling, I used [ChakraUI](https://chakra-ui.com/).

Initially, I started writing the API server and client using GraphQL and GraphQL Code Generator, but I discovered tRPC midway and rewrote everything. By the way, when I started, tRPC was at v9, but v10 was released during the process, so I had to rewrite some parts again... Using GraphQL Code Generator was very convenient as it automatically generated the necessary types and implementations for API clients (even React Hooks functions that call SWR or React Query) just by writing the GraphQL schema, but tRPC was even more convenient and didn't require code generation. It's great that both the server and client can be implemented in TypeScript. If there are mobile apps or similar on the client side, I would probably use GraphQL. With tRPC, the server-side implementation looks like [this](https://github.com/morishin/katteyokatta.morishin.me/blob/9b85ac253cf9be46e08ede6b3a188dad3c5acf73/lib/server/trpc/routers/amazonItemRouter.ts), and the client-side implementation looks like [this](https://github.com/morishin/katteyokatta.morishin.me/blob/9b85ac253cf9be46e08ede6b3a188dad3c5acf73/components/post/AmazonSearchResults.tsx#L18-L31). The ability to share types between the server and client without code generation is powerful.

ChakraUI provides a set of UI components and utilities for styling in a Tailwind-like manner. Additionally, ChakraUI depends on [emotion](https://emotion.sh/), which is also quite convenient as it allows for the creation of accessibility-aware components without much effort, and I hardly have to write CSS anymore. However, both emotion and ChakraUI have difficulties in supporting React Server Components due to their reliance on React Context, so they can currently only be used in Client Components. Therefore, if I rely on these, it will be difficult to migrate to the Next.js [app directory](https://beta.nextjs.org/docs/routing/fundamentals). Also, since the bundle size is large and the amount of JS executed at runtime is high, it impacts performance, but the development experience is so good that I think I will continue to rely on ChakraUI (and emotion) for a while in "Things I Bought and Was Glad I Did." I do have a desire to make it a zero-runtime library, though...

## Performance Tuning

Now that the implementation was mostly complete, I deployed it, and it was incredibly slow, so I did various tuning. First, I hadn’t set any indexes on the database, so I checked the slow queries and queries with many rows read in the PlanetScale console and added indexes. It's convenient to be able to view this kind of information in the web console.

![](https://i.gyazo.com/56af06f85c1e62455e82de155d8ed349.png)

Even so, the overall page display was slow, and when I looked at PageSpeed Insights, the [TTFB](https://web.dev/ttfb/) (Time To First Byte) was overwhelmingly slow. I had set all pages to SSR, but it seemed that the communication between Vercel and PlanetScale was slow. At first, I mistakenly set one of the regions to the Americas, causing the SQL to cross the ocean, so changing both regions to Tokyo improved things a bit. However, it was still quite slow, so I decided to stop using SSR for the main pages and switch to SSG (On-Demand ISR).

Even when switching to SSG, I had to quickly regenerate the page when users posted content. Therefore, I utilized Vercel's [On-Demand ISR](https://beta.nextjs.org/docs/data-fetching/revalidating#on-demand-revalidation). This mechanism allows for the regeneration of SSG pages to be requested at any time, and in "Things I Bought and Was Glad I Did," I set it up to regenerate the top page and the user page of the posting user at the time a user posts a product. ([Implementation](https://github.com/morishin/katteyokatta.morishin.me/blob/af296b2a24057bd12153ff2d434252b0adc78b7d/lib/server/revalidator.ts#L4-L14))

By switching to SSG, TTFB theoretically became the fastest, and page transitions became incredibly fast. Just hovering over links prefetches the content of the destination, and when clicked, it renders that content. For parts that need to dynamically render information like logged-in user data, I had to display a loading spinner, which can be somewhat unsightly, but the user experience is likely better than showing a completely white screen until all server requests are completed. The recent trend in performance improvements for React and Next.js is to handle server-side processing asynchronously where necessary, while showing users the rest of the content as quickly as possible, allowing for hydration to be completed for those parts so that they can be interacted with.

Additionally, PageSpeed Insights indicated that the image data size did not match the display size, so I tried using next-image, but it had a very limited free tier and I quickly ran out of usage, so I stopped.

https://twitter.com/morishin127/status/1595316821858877440

# Rails vs Next.js

Here are some things I was happy about when migrating from Rails to Next.js.

- Ability to create a hybrid of SSR and SSG
- Type Safety
- Ability to write rich UIs in JavaScript

While it is possible to write React + TypeScript in Rails, setting up and maintaining the development environment is quite challenging. I’ve done the tough work of removing Webpacker from existing Rails apps and switching to pure Webpack several times, and it is quite a daunting task. Additionally, considering migrating from Sprockets to Propshaft and selecting and maintaining other tools seems to be quite labor-intensive. I still don’t fully understand jsbundling-rails or importmap-rails.

On the flip side, there were also some challenges after switching to Next.js.

- No `perform_later`
- No ridgepole

Rails' `perform_later` is convenient and allows for easy execution of asynchronous jobs. When a product is posted on "Things I Bought and Was Glad I Did," I also tweet new posts from the [@katteyokatta_jp](https://twitter.com/katteyokatta_jp) account, but this POST request to the Twitter API is actually a process that would ideally be handled with an in-memory queue using perform_later. However, due to the lack of an easily accessible asynchronous job mechanism, I am currently handling it synchronously while processing user post requests.

[ridgepole](https://techlife.cookpad.com/entry/2014/08/28/194147) is a tool for managing the database schema of Rails applications, replacing the standard ActiveRecord migration mechanism. Prisma's schema management method is similar to ActiveRecord's, generating migration files whenever there are schema changes, but I prefer a format where there is just one schema definition file that humans edit, like ridgepole. May ridgepole become the world standard 🎋

# Thanks to Heroku

As someone who enjoys app development, I have run many personal development services on Heroku. They have been incredibly helpful by providing databases, Redis, and job scheduling execution infrastructure for free. Thank you for everything so far.

https://twitter.com/morishin127/status/1591977528574373888

# Promotion

The rewritten "Things I Bought and Was Glad I Did" is a great service that I created, so please take a look and try it out. I think the service name is a bit cheesy.

https://github.com/morishin/katteyokatta.morishin.me