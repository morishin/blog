---
keywords:
  - 開発
  - Haskell
---

# Automatic Poem Generation Using Markov Chains in Haskell

![](https://i.gyazo.com/da57a0afc34fed284d39fffd62a97f5f.png)
## poem-generator
I wrote a program to automatically generate poems for studying Haskell.<br>
Since this is my first Haskell program, I think the code is a bit rough, but I would like to write an article about how I implemented it.

Here is the repository.

https://github.com/morishin/poem-generator

---

## Implementation
(The full source code is pasted at the bottom of the article)

This is the definition of the main function. It takes the source text as an argument and returns a generated poem by nicely connecting the words within it.
```haskell
generatePoem :: String -> IO String
generatePoem source = do
  mecab <- new ["mecab", "-l0"]
  nodeLines <- mapM (parseToNodes mecab) (lines source)
  let wordLines = map (filter (not . null) . map nodeSurface) nodeLines
  let allWords = intercalate ["\n"] wordLines

  let table = generateTable 3 (toWords allWords)

  begin <- initialWords table
  case begin of
    Nothing -> return ""
    Just ws -> chainWords table (tail ws) $ fromWords ws
```
First, the text received as an argument is split into a list of words `wordLines` for each line. For the splitting, I used the Haskell binding of the morphological analysis tool [MeCab](http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html), specifically [tanakh/hsmecab](https://github.com/tanakh/hsmecab) (I used a [fork](https://github.com/morishin/hsmecab) because there were some outdated parts).

If the source text consists of these three lines:
```
It seems that the cyark has been defeated...
Hehe... he is the weakest among the four heavenly kings...
To lose to mere humans is a disgrace to the demon race...
```
The lines are split into words like this:
```haskell
["サイ", "アーク", "が", "やら", "れ", "た", "よう", "だ", "な", "..."]
["フフフ", "...", "奴", "は", "四天王", "の", "中", "でも", "最", "弱", "..."]
["人間", "ごとき", "に", "負ける", "と", "は", "魔", "族", "の", "面汚し", "よ", "..."]
```
Then, I intercalate them with the newline string `"\n"` to combine them. This corresponds to `allWords` in the code.
```haskell
["サイ", "アーク", "が", "やら", "れ", "た", "よう", "だ", "な", "...", "\n", "フフフ", "...", "奴", "は", "四天王", "の", "中", "でも", "最", "弱", "...", "\n", "人間", "ごとき", "に", "負ける", "と", "は", "魔", "族", "の", "面汚し", "よ", "..."]
```
I wanted to add information about where the "beginning" and "end" of sentences are in this list of `String`, so I defined a new type:
```haskell
data Word = Begin | Middle String | End
```
This converts the `[String]` into the following `[Word]`:
```haskell
[Begin, Middle "サイ", Middle "アーク", ... , Middle "な", Middle "...", End, Begin, Middle "フフフ", ... , End]
```
Using `generateTable 3`, I create a table by cutting it into groups of three words.

1 | 2 | 3
---- | ---- | ---
(Beginning) | サイ | アーク
サイ | アーク | が
アーク | が | やら
が | やら | れ
 ⋮ | ⋮ | ⋮
だ | な | ...
な | ... | (End)
(Beginning) | フフフ | ...
フフフ | ... | 奴
 ⋮ | ⋮ | ⋮
よ | ... | (End)


Now we are ready. By repeatedly selecting rows from this table and connecting them, we can generate sentences.

Rows are selected based on the following rules:

1. The first selectable rows must start with (Beginning).
2. The prefix (the first two words) must match the suffix (the last two words) of the previously selected row.

In this example, the first selectable rows are:
```haskell
[Begin, Middle "サイ", Middle "アーク"]
[Begin, Middle "フフフ", Middle "..."]
[Begin, Middle "人間", Middle "ごとき"]
```
One of these is randomly selected.<br>
The `initialWords` in the code handles this operation.

If `[Begin, Middle "サイ", Middle "アーク"]` is selected, the next selectable rows will start with `[Middle "サイ", Middle "アーク"]`.<br>
In this case, there is only the row `[Middle "サイ", Middle "アーク", Middle "が"]`, but if there are multiple candidates, one will be randomly chosen from them.

By randomly selecting candidates like this and connecting them, the process ends when we reach a row that ends with `End` or when there are no more candidates.<br>
The `chainWords` in the code handles this operation, recursively selecting candidates and connecting them, returning the generated text as `IO String`.<br>
The reason it is `IO String` instead of `String` is that there is an operation that randomly selects candidates, and the return value changes each time the function is called.

In the example of the three lines of text, it is too short to produce multiple candidates, resulting in no randomness in the output. However, if the source text is something sufficiently long like a full novel, a variety of poems will emerge each time it is executed.<br>
The image at the beginning of the article shows text generated using Kenji Miyazawa's "Night on the Galactic Railroad" as the source. In another example, using Osamu Dazai's "Run, Melos!" as the source produced the following text.
![](https://i.gyazo.com/34aa3c366d06b0d08c2853a2fcbf2a56.png)

### Markov Chains
> A probability process where the next state depends on the history of the past N states, including the current state, is called an Nth-order Markov chain (or N-fold Markov chain, Nth Markov chain). -- [Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB%E3%82%B3%E3%83%95%E9%80%A3%E9%8E%96)

The implementation above selects the next word based on the previous two words, so it would be a second-order Markov chain, I guess. I don't really know.

## Thoughts
- I had no idea about the syntax, so I was constantly referring to [the Amazing Haskell Book](http://www.amazon.co.jp/dp/4274068854) while writing.
- I didn't really understand monads when I saw them in the book, but after writing, I got a bit of an understanding.
- The Atom plugins were great (language-haskell + ide-haskell + haskell-ghc-mod + autocomplete-haskell)
  ![](https://i.gyazo.com/c757348c91b64a80edbf63cd70c09194.gif)
- Thanks to [@ryota-ka](https://twitter.com/ryotakameoka) and [@lotz84](https://twitter.com/lotz84_) for teaching me various things when I didn't understand.
- Thanks to [@tanakah](https://twitter.com/tanakh?lang=ja) for creating the MeCab binding. 🙏

## Source Code
https://gist.github.com/77745b1424fdb1ba8ce1