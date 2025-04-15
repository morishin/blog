---
keywords:
  - 開発
---

# Useful Tools for Development

This article is the 23rd entry in the [CAMPHOR- Advent Calendar 2020](https://advent.camph.net/). The 22nd entry was by [Reomaru](https://twitter.com/_reo_g) titled "[The Charm of Nixie Tubes](https://note.com/reo_g/n/nf019bd71db74)." Niche!!!! (applause)

I have participated in the CAMPHOR- Advent Calendar since its first edition in 2014, making this my seventh participation.

This time, I will introduce some peripheral tools that I find useful in my everyday development. Observing other people's development environments often leads to various discoveries, so I thought my own setup might also be a valuable piece of content. I would love to see what others are using, so please feel free to share your articles as well.

*Note: Since I primarily use macOS, many of the applications mentioned are for macOS.*

---

## Alfred

[Alfred](https://www.alfredapp.com/) is a macOS application that allows you to search for local applications and files like Spotlight, and it can execute various actions defined through a feature called Workflow, triggered by hotkeys or keyword input. I use it for various purposes, so it will appear several times in this article. I also perform web searches from here.

## Tool for Controlling Window Size and Position

[Shiftit](https://github.com/fikovnik/ShiftIt) is a tool that allows you to change the size and position of windows using shortcut keys. It is convenient for maximizing windows, arranging two application windows side by side with equal sizes, or moving a window to an external display, all done via shortcut keys.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231512.gif" width="400" height="225" loading="lazy" />

## Tool for Switching Active Applications

[HyperSwitch](https://bahoom.com/hyperswitch) enhances the application switching experience with ⌘+Tab. It allows you to switch not just by application but by window, and it displays previews, making it user-friendly.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201222/20201222093901.png" width="600" height="269" loading="lazy" />

I also create an [Alfred Workflow](https://www.alfredapp.com/workflows/) to switch applications using hotkeys. I assign keys ⌘1 to 5 to frequently used applications. The Workflow looks like this.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231305.png" width="244" height="400" loading="lazy" />

When switching from one active application to the previously active one, I just press HyperSwitch's ⌘+Tab once, allowing for quick back-and-forth. However, for switching to specific applications, I use hotkeys. If I want to switch to or launch an application that doesn't have a hotkey registered, I simply type the application name in Alfred's window. Spotlight could also work for this.

## Tool for Inputting Emojis

[meyer/alfred-emoji-workflow](https://github.com/meyer/alfred-emoji-workflow) is an Alfred Workflow that allows you to search and input emojis. When you input a query, it shows suggestions like this, and selecting one copies it to the clipboard. It supports quite vague searches, so you can often find emojis even if you don't know their exact names.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231505.png" width="400" height="347" loading="lazy" />

(:tofu_on_fire: is a hit and it's great)

## Tool for Quickly Inputting Snippets

I use a self-made application called [Quill](https://quill.morishin.me/). By registering trigger keywords and corresponding snippets, it automatically replaces the keywords with snippets when you input them. In addition to HTML tags like in the screenshot, I also register emoticons, email addresses, and addresses.

<img src="https://i.gyazo.com/190bbb1cf7d407792f675db5c6b66dae.gif" alt="Image from Gyazo" width="512"/>

Other applications that provide similar functionality include Alfred, [Dash](https://kapeli.com/dash), and [TextExpander](https://textexpander.com/), but I found their usability lacking or they were paid, so I created my own.

You can read about how I made it here.

https://blog.morishin.me/posts/2020/02/02/quill


## Tool for Reflecting Current Activities in Slack Status

I use an application called [rrreeeyyy/slack-status-activity](https://github.com/rrreeeyyy/slack-status-activity) to automatically reflect the information of the currently active application in my workplace's Slack status.

This allows other members to see if I'm currently coding or in a Zoom meeting. When I was in the office, it was easy to tell visually, but since everyone has moved to remote work, I think this is quite convenient.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231313.png" width="358" height="108" loading="lazy" />

💡 Pro Tip: If you assign an emoji representing "away" to the application name 'loginwindow', your status will show as "away" when your screen is locked, which is convenient. (Due to guidance from the Information Security Committee, I have a habit of locking my screen when I leave my seat, even at home.)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231356.png" width="249" height="105" loading="lazy" />

## VSCode Plugins

I primarily use VSCode as my text editor, so I will introduce some frequently used plugins.

### Tool for Changing Case

[wmaurer.change-case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case)

In Rails, if the file name and class name do not match in case, it won't work, but since I often don't notice typos, I've stopped typing them manually.

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231433.gif" width="400" height="194" loading="lazy" />

### Gaming Parentheses

[CoenraadS.bracket-pair-colorizer-2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231319.png" width="240" height="64" loading="lazy" />

This is a trendy one. I implemented it after seeing this tweet.

https://twitter.com/tanakh/status/1024131114649047041?s=20

### Tool for Breaking Lines at Commas

[jzarzoso.break-from-comma](https://marketplace.visualstudio.com/items?itemName=jzarzoso.break-from-comma)

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20201221/20201221231401.gif" width="400" height="167" loading="lazy" />

### Tool for Opening in GitHub

[ziyasal.vscode-open-in-github](https://marketplace.visualstudio.com/items?itemName=ziyasal.vscode-open-in-github)

This opens the selected lines in a GitHub web page.

## Git Related

### git-rerere

This tool remembers conflicts that have been resolved in the past and automatically resolves similar conflicts when they occur again. It doesn't activate often, but when it does, it's incredibly helpful. I think it's good to enable it just in case.

https://git-scm.com/book/en/v2/Git-Tools-Rerere


### Peco Tricks

I use peco to switch branches and select files to git add.

Here’s how I wrote the scripts, assuming zsh.

```sh
function peco-select-git-switch() {
    local selected_branch="$(git branch --sort=-committerdate | grep -v '^\*.*' | peco --query "$LBUFFER" | awk -F ' ' '{print $1}')"
    if [ -n $selected_branch ]; then
      BUFFER="git switch $selected_branch"
      CURSOR=$#BUFFER
      zle accept-line
    fi
}
zle -N peco-select-git-checkout
bindkey "^gc" peco-select-git-checkout
```

```sh
function peco-select-git-add() {
    local SELECTED_FILE_TO_ADD="$(git status -s | cut -c4- | \
                                  peco --query "$LBUFFER" | \
                                  awk -F ' ' '{ printf "\"%s\" ", $NF }')"
    if [ -n "$SELECTED_FILE_TO_ADD" ]; then
      BUFFER="git add $(echo "$SELECTED_FILE_TO_ADD" | tr '\n' ' ')"
      CURSOR=$#BUFFER
    fi
    zle accept-line
}
zle -N peco-select-git-add
bindkey "^ga" peco-select-git-add
```

## Tool for Searching Shell Command History

I also use peco for this, like so.

```sh
function peco-select-history() {
    local tac
    if which tac > /dev/null; then
        tac="tac"
    else
        tac="tail -r"
    fi
    BUFFER=$(history -n 1 | \
        eval $tac | \
        peco --query "$LBUFFER")
    CURSOR=$#BUFFER
    zle clear-screen
}
zle -N peco-select-history
bindkey '^r' peco-select-history
```

## Smart `cd` Tool

I use [wting/autojump](https://github.com/wting/autojump), which allows you to `cd` to directories you've previously visited with minimal input.

## Tool for Passing Environment Variables to Commands

At Cookpad, we use [sorah/envchain](https://github.com/sorah/envchain) as a company standard to set secret values stored in macOS's keychain as shell variables and pass them to commands. It's essential for passing secret values to AWS commands.

## Tool for Using Touch ID with sudo

Referring to [this article](https://dev.classmethod.jp/articles/mac-terminal-sudo-touch-id/), I have configured my terminal to use Touch ID instead of entering a password when prompted for the administrator password.

## Tool for Decoding URL Encoded Strings

When I copy URLs in Chrome, Japanese text gets URL encoded and looks awkward, so I often use [humr](https://github.com/motemen/node-humr) to revert them back to Japanese URLs for sharing. Isn't it cooler to keep them in Japanese? (URLs containing half-width spaces are a no-go)

## Tool for Switching Between English and Japanese Input

I use a [keyboard](https://scrapbox.io/morishin/Keyboard) compatible with QMK Firmware, which allows me to switch the keys for left ⌘ and right ⌘ between English and Japanese input.

https://github.com/morishin/qmk_firmware/blob/33ff789213a73d165fbd90d54620f3b08c0d4a29/keyboards/mint60/keymaps/morishin/keymap.c#L40

## Conclusion

I feel like there are other tools I use as well, but with these, I manage to reduce the stress of the trivial parts of development. I'm curious about how others do it, so please feel free to write articles and share your experiences!