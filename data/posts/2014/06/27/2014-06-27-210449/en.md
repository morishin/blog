---
keywords:
  - 開発
---

# Created an Alfred Workflow for searching Eijiro

<p><span style="color: #ff2600">As pointed out in the comments of the article, I was requested by the company Alcu, which operates Eijiro on the WEB, to delete the source code due to a violation of the terms of use, so I have removed it. The download link in the article is now invalid. I apologize for the violation. (Update: July 31, 2014)</span></p>

![gomennasai](http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20140731/20140731205629.png)

---

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20140627/20140627173410.png" alt="f:id:morishin127:20140627173410p:plain" title="f:id:morishin127:20140627173410p:plain" class="hatena-fotolife" itemprop="image"></span></p>

## Subscribed
I use [Alfred](http://www.alfredapp.com/) a lot, and I thought it would be great if I could open GitHub repositories quickly with Alfred, so I looked it up and found [gharlan/alfred-github-workflow](https://github.com/gharlan/alfred-github-workflow). However, I found out that the Workflow feature requires a subscription to Alfred, so I paid about 3000 yen.

It's super convenient.
<p><span itemscope itemtype="http://schema.org/Photograph"><img src="http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20140627/20140627171212.png" alt="f:id:morishin127:20140627171212p:plain" title="f:id:morishin127:20140627171212p:plain" class="hatena-fotolife" itemprop="image"></span></p>

## Created a Workflow
Since I paid for it, I wanted to use Workflows extensively, so I decided to create one myself. Workflows can be written in shell scripts, PHP, Python, Ruby, Perl, etc. The Google Suggest workflow that was in the app was written in PHP, so I wrote mine in PHP while mimicking that.
<p><span itemscope itemtype="http://schema.org/Photograph"><img src="http://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20140627/20140627171644.png" alt="f:id:morishin127:20140627171644p:plain" title="f:id:morishin127:20140627171644p:plain" class="hatena-fotolife" itemprop="image"></span></p>

## <s>Eijiro Search</s>

<s>I created a tool to search the online dictionary [Eijiro on the WEB](http://www.alc.co.jp/) on Alfred. It's convenient when you want to know the meaning of an English word or the usage of a certain word, as you can quickly look up meanings and example sentences.

English to Japanese

![EN->JA](http://gyazo.com/dc3f5800d4be667c9a1e9bf795c7d9de.gif)

Japanese to English

![JA->EN](http://gyazo.com/a48f99f023c4b0e94f3ab418aa48dc40.gif)

## Source Code
The source code is available at [morishin/alfred-eijiro-workflow](https://github.com/morishin/alfred-eijiro-workflow). If anyone wants to use it, please download it from here.</s>