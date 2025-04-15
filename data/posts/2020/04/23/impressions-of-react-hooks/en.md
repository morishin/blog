---
keywords:
  - 開発
  - React
---

# Impressions of React Hooks

At first, I didn't understand why I had to write code this way or what was so great about it, but after using it for a while, I realized there are two major benefits:

- You don't have to use classes.
- You can extract the logic that was tightly coupled with the component's state and lifecycle into Hooks functions, making it reusable across multiple components.

---

The reason why using classes can be painful is mentioned in the video below, but to put it simply, it's "Hard for humans." The `this` keyword is tricky, and `bind` can be cumbersome.

<figure class="figure-image figure-image-fotolife" title="Hard for humans"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20200423/20200423233813.png" width="419" height="233" loading="lazy" /><figcaption>Hard for humans</figcaption></figure>

<iframe width="560" height="315" src="https://www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The latter point becomes clearer when you try using or writing Custom Hooks. For example, the logic that manipulates the state of a component can be defined as a function separate from the component itself, which is a great advantage.

https://github.com/jaredLunde/react-hook/tree/c50c3f58bffda8dc448e1a5ef539add9164d5d43/packages/toggle

In a class-defined component, you inevitably end up using `this.state` and `this.setState`, which leads to a tightly coupled implementation with the component class, making it difficult to extract logic that can be reused in other components.

On the contrary, one downside or hurdle of Hooks is that just looking at the interface can give a strong sense of black-box implementation, making it hard to understand the behavior.

Reading articles around this topic helped me get into the mindset of Hooks, allowing me to write without confusion, so I recommend them.

A blog from Netlify, which I am a fan of, provides a detailed explanation while implementing a mini recreation of Hooks.

https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/

This one also provides a thorough explanation with nice illustrations.

https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e

A long article focusing on the often tricky `useEffect`. I feel like you don't necessarily have to read it, but it's interesting.

https://overreacted.io/ja/a-complete-guide-to-useeffect/

While you can functionally manage with class components, the ecosystem will likely become more Hooks-centric moving forward, so it seems beneficial to use Hooks in your own implementations.

Additionally, Hooks have a dependency array, and I found myself endlessly forgetting to write it, which led to many issues. Therefore, a Linter that checks the [Rules of React Hooks](https://github.com/jaredLunde/react-hook/tree/c50c3f58bffda8dc448e1a5ef539add9164d5d43/packages/toggle) is essential. You should set it up right away.

https://www.npmjs.com/package/eslint-plugin-react-hooks