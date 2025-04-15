---
keywords:
  - 開発
---

# Released a Site Called "Things I’m Glad I Bought"

I released a website called "[Things I’m Glad I Bought](https://katteyokatta.morishin.me/)". Although it was released on Christmas Eve last year, I missed writing a release article.

https://twitter.com/morishin127/status/944830650195910656

It's been a little while since I created it, but I want to write down the background of its creation, the development process, and the reactions after the release while I still remember.

---

## Background
Sometimes I want to introduce things I’m glad I bought to others, and I would tweet or talk about them, but I thought it might be nice to have a place where such information could gather. Around the end of the year, there are many blog posts like "Summary of Things I’m Glad I Bought in 20XX," so there seems to be a demand for both wanting to introduce and wanting to see such information. I thought that if there was a space, even people without a blog could easily write, and by gathering information in one place, more people could see recommendations from various others.

I had a vague idea but didn’t have the timing to create it, so I kept it on the back burner. However, since Cookpad was holding the [2017 Lifestyle Product Award by Cookpad](https://product-award.cookpad.com/) at the end of the year, I thought, "Alright, I’ll submit this!" and started developing it little by little on holidays from November, releasing it on Christmas. Since I’m an employee at Cookpad, I asked in advance, "Is it okay for an employee to apply?" and they said that while they might not be able to give awards to employees, applying was not a problem, so I submitted it. I actually wanted to aim for the prize money, but I was simply happy to have people see the service I created and get feedback, so I thought it was fine.

## Development Process
### Service Design
In creating the service, I defined the users who would use it, their desires, and the value the service would provide. When formalizing this, I used the EOGS framework that Cookpad uses internally, as it is convenient, and wrote it in that format. There is a brief mention of EOGS in this article (http://techlife.cookpad.com/entry/2015/06/01/135804).

When I wrote the concept of "Things I’m Glad I Bought" in EOGS format, it looked like this. I divided the users into those who post and those who view, setting their respective desires and the value that could be provided. By formalizing it this way, it is convenient not to lose direction when considering specifications or improvements. It’s also good for aligning understanding when developing as a team, although this time it was solo development.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180521/20180521102030.png" width="512" height="200" loading="lazy" />

### Specification Decisions
Based on the aforementioned concept, I thought about what form the service should take and jotted down the necessary elements in a memo like this.

```md
- Things I’m Glad I Bought Posting Service
    - There are many blogs about things people are glad they bought
    - Make it easier for bloggers and increase readers
- Login
    - Twitter
    - User ID, User Name
- Register things I’m glad I bought
    - Product name, Product image, Link, Comment
    - Date of post
- Search Amazon by product name -> Amazon link
- For items not on Amazon, allow registration with free text, images, and URLs?
- Amazon links are affiliate links
    - Allow users to set their own affiliate ID?
    - If not set, my affiliate ID will be used
- Registered items can be listed on user pages
    - https://xxxxxxx/users/morishin127
- It might be interesting to see link click counts (like Nico Nico Market)
- Friends list
    - Sync with Twitter follows
- This person also said they were glad they bought this product
- Keyword search
- Since preparing storage for images is difficult, it might be better to only save Amazon image links in the DB

----

- Top page
- User page / My page
- Item details
- Item addition page
    - Search box / Search results / Comment editing
```

There were some features like the friends list that I ultimately didn’t implement, but I created it roughly according to the memo. I wrote implementation tasks based on the memo into issues and tackled them one by one whenever I could find development time on holidays or late at night on weekdays.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180521/20180521102038.png" width="512" height="476" loading="lazy" />

### Implementation
The structure is a standard Rails app. For user experience, such as pagination on the top screen and the search screen for adding products, I needed to implement it with JavaScript, so I tried using Vue.js for the first time.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180521/20180521102046.png" width="512" height="35" loading="lazy" />

It was also my first time using Rails 5, but it was nice that it supports webpack and various other features. The gems I added and used are as follows.

```rb
⋮
gem 'omniauth'
gem 'omniauth-twitter'
gem 'hamlit'
gem 'hamlit-rails'
gem 'rapa'
gem 'font-awesome-sass'
gem 'webpacker'
gem 'materialize-sass'
gem 'retryable'
gem 'google-analytics-rails'
gem 'rails_autolink'
gem 'meta-tags'
gem 'kaminari'
gem "typhoeus"
```

I was considering what to do about the server and deployment method, whether to use Docker or which cloud service to choose between GCP or AWS, but after consulting with a colleague, it turned out that Heroku was cheap, easy, and the best option, so I went with Heroku. As a result, I managed to stay within the free tier, and deploying was just a matter of doing a git push, which was incredibly easy and great. Even if I exceed the free tier, I would probably just pay normally.

For UI implementation, I used a framework called [Materialize](https://materializecss.com/). At first, I was determined to write all the CSS myself, but I gave up in two seconds and introduced the framework. It was convenient to use various components like buttons and cards as they were. I was particularly impressed by the convenience of [Toast](https://materializecss.com/toasts.html). Creating something like this that works on both PC and mobile seems quite challenging.

One major issue I faced during implementation was with the Product Advertising API used for Amazon product searches during new postings. This API returns an error about one out of every three times, even when I’m the only one using it during development, which is quite frustrating. Although I have a retry mechanism on the server application side, it still returns an error about one out of every five times. Originally, the API restrictions are supposed to be a bit strict, but even so, the errors are too frequent and painful. I ultimately couldn’t improve it, and it’s still an error fest.

## After Release
### Reactions
After releasing it on Christmas and tweeting about it, acquaintances retweeted and used it, sharing their summaries. It was nice to see reactions immediately after the release.

Here’s a summary of the reaction tweets right after the release↓ (Most of them are from followers and acquaintances, thank you 🙏💦)

<a class="twitter-timeline" data-width="512" data-height="768" data-partner="tweetdeck" data-theme="light" data-link-color="#F2676A" href="https://twitter.com/morishin127/timelines/997405546121580544?ref_src=twsrc%5Etfw">Reactions After the Release of "Things I’m Glad I Bought" - Curated tweets by morishin127</a>

### Usage Status
The day after the release was the peak of access, and it has been quite low since then.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180521/20180521102051.png" width="486" height="210" loading="lazy" />

Users can attach their affiliate links to the products they registered, but for products without user settings, my affiliate link is set, which generates revenue. The affiliate revenue is quite modest, totaling less than 20,000 yen so far. It might be high relative to the number of page views, but I’m not sure about the market rate.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20180521/20180521102056.png" width="512" height="366" loading="lazy" />

## Conclusion
In terms of posting, it seems like a service that will be used at the end of the year, so I want to improve and promote it as we approach the end of the year. I look forward to everyone’s use, as I want to gather quality information and lead a quality life.