---
keywords:
  - 開発
---

# Create an API that returns real-time Bitcoin chart images and make Hubot spit them out on Slack

This article is the 20th entry in the <a href="http://advent.camph.net/" target="_blank">CAMPHOR- Advent Calendar 2015</a>. <br>
(For more about CAMPHOR-, visit https://camph.net/)

Hello, I am <a href="https://twitter.com/morishin127" target="_blank">@morishin127</a>. <br>
Recently, it has become popular among CAMPHOR- members to use Bitcoin for splitting bills and reimbursements. It’s somewhat like using LINE Pay. <br>
Once I started holding some Bitcoin, I became interested in the daily fluctuating rates, so I would occasionally Google to check the charts. I thought it would be convenient to get the chart by talking to a bot, so I created an API that returns chart images.

<img src="http://g.morishin.me/9f820904ca43af8a302a2c425507b36e.png" alt="bot" width="680" />

---

By hitting ~~http://ticker.morishin.me/~~ https://ticker.arukascloud.io/, you can get real-time chart images. <br>
You can use `?scale=15m` for 15-minute candlesticks and `?scale=1d` for daily candlesticks. (The default is 5-minute candlesticks.)

Here is the repository.

https://github.com/morishin/bitchart-api

There is a [Docker repository](https://hub.docker.com/r/morishin127/bitchart-api/), so

```shell
docker pull morishin127/bitchart-api
docker run -itd -p 80:8080 morishin127/bitchart-api
```

should get it running.

## Implementation

What I used:

- Python 3
  - Bottle
  - pandas
  - matplotlib
- Docker

### Obtaining Rate Information
I used the [coincheck API](https://coincheck.jp/documents/exchange/api?locale=en) to get the Bitcoin rate. <br>
By hitting https://coincheck.jp/api/ticker, you can obtain the current price information in the following format:
```javascript
{
  "last": 55621,
  "bid": 55694,
  "ask": 55715,
  "high": 56552,
  "low": 54927,
  "volume": "1835.34189941",
  "timestamp": 1450547505
}
```

This API is called every minute to INSERT the last value into the database.

### Drawing Charts with pandas + matplotlib

As I INSERT into the database, I also generate and save chart images up to that point. The data selected from the database is converted into a pandas DataFrame, and a candlestick chart is drawn using matplotlib's functionality. I used `matplotlib.finance.candlestick_ohlc`.

I combined all these processes into a single script and set it to run every minute using crontab.

<script src="https://gist.github.com/morishin/8647b913b968501ae846.js"></script>

### Distributing Chart Images

I set up a web server with Bottle, and when a request comes in, it returns the images saved in files.

<script src="https://gist.github.com/morishin/25572ab19d54c7d5d329.js"></script>

### Docker
~~I deployed this on a suitable server using Docker and pointed the domain to [ticker.morishin.me](http://ticker.morishin.me/).~~ <br>
I closed the server I was using and migrated to Sakura's Arukas → https://ticker.arukascloud.io/ <br>
The Arukas setup looks like this, and you can start it by specifying `PORT=80`. <br>
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20160924/20160924135147.png" width="480"/>

The Dockerfile looks like this.

<script src="https://gist.github.com/morishin/4cf1cd2c05d0be488479.js"></script>

I wasn't sure about the dependency libraries, so I referred to this 🙏
http://fits.hatenablog.com/entry/2015/10/29/212833

I chose Docker because I got stuck with manual environment setup... I tried to get it running smoothly on my rented VPS (Debian), but I got stuck installing libraries like matplotlib on virtualenv, so I thought it would be easier to use a Dockerfile that someone else had already successfully built. <br>
By the way, I also got stuck installing docker-engine on that Debian machine (weak), and eventually, I ended up purchasing an instance with a pre-installed Docker environment on DigitalOcean. <br>
DigitalOcean's One-Click Apps are super convenient...

<img src="https://cloud.githubusercontent.com/assets/1413408/11914661/dc70fb14-a6c9-11e5-8e43-42b7b8aabb6f.png" width="512"/>

### Hubot
With this, you can write a Hubot script like the one below to have Hubot return charts in chat.

```coffee
module.exports = (robot) ->
  robot.hear /bitchart\s*(\d+[mhd])?/, (res) ->
    query = res.match[1] ? "5m"
    res.send "https://ticker.arukascloud.io/?scale=" + query
```

For more details, please check the [repository](https://github.com/morishin/bitchart-api).

Tomorrow's article will be about [keishake](http://shakezoomer.com/). Stay tuned!