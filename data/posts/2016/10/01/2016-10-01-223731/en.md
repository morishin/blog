---
keywords:
  - 開発
---

# Notify the Notification Center when a long-running zsh command has finished

This will notify the Notification Center only when a command execution takes more than 5 seconds.

![image](https://i.gyazo.com/23202ae6ababb6337271749784d3258b.gif)

---

## Required
Install [terminal-notifier](https://github.com/julienXX/terminal-notifier)
```sh
brew install terminal-notifier
```

## Source
Add the following to `.zshrc` in `preexec` and `precmd`
```sh
function preexec () {
   _prev_cmd_start_time=$SECONDS
   _cmd_is_running=true
}

function precmd() {
  if $_cmd_is_running ; then
    _prev_cmd_exec_time=$((SECONDS - _prev_cmd_start_time))
    if ((_prev_cmd_exec_time > 5)); then
      terminal-notifier -message "Command execution finished"
    fi
  fi
  _cmd_is_running=false
}
```

Since `terminal-notifier` can activate an app when the notification is clicked by passing the app's Bundle ID to the `-activate` option, it is convenient to set it up as follows.
```sh
terminal-notifier -message "Command execution finished" -activate com.apple.Terminal # For iTerm2, use com.googlecode.iterm2
```