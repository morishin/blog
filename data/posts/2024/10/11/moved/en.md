---
keywords:
  - 開発
---

# I Created My Own Blog and Migrated

I decided to leave Hatena Blog, which I had been using for about 10 years since 2014, and move to a self-made (big lie) blog system.

---

The self-made part is a lie; I forked the repository of a friend ([@ryota-ka](https://x.com/ryotakameoka)) who had created his own blog and migrated, and I was able to build my new blog without doing any implementation myself. OSS is the best ^^.

https://blog.ryota-ka.me/posts/2022/02/13/my-own-blogging-system

There have been platforms like Hatena Blog and Ameba Blog since ancient times, so you don't need to write your own code to have a blog. Recently, note has become popular, and for information sharing aimed at engineers, Qiita and Zenn are also trending.

I usually write blog posts not to share technical insights but to show off what I've created, so Qiita and Zenn don't suit me, and I had been using Hatena Blog for a long time.

I think Hatena Blog is a well-made application with a good writing experience and decent performance, but the ads are tough! I don't use an ad blocker, and I don't mind ads appearing on others' blogs, but it bothers me to see ads plastered all over my own blog, which is my space. I said the performance isn't bad, but that refers to server response; the degradation of client-side performance and experience due to the presence of ads cannot be ignored.

I have considered using Hatena Blog Pro, but now that I can build my own blog just by forking someone else's repository, there is no longer any reason to continue using Hatena Blog by paying for it.

The forked repository [ryota-ka/blog](https://github.com/ryota-ka/blog) is written in Next.js (SSG), and fortunately, since it's a framework I'm familiar with, it was easy to add features and change the design. I wasn't familiar with Tailwind CSS due to differences in musicality, though...

This article doesn't have sections, so they don't appear, but the table of contents appears next to the article body and follows the scroll, links to web pages turn into cards, tweets can be easily embedded, and there's dark mode support—it's well done. If you host it on Vercel, it gets deployed just by doing a git push, and it's free.

Thank you, Internet.