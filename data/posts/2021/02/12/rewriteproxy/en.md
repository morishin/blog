---
keywords:
  - Firebase
  - 開発
---

# Proxy to Emulate Firebase Hosting Rewrites Locally

Firebase Hosting has a feature called [rewrites](https://firebase.google.com/docs/hosting/full-config#rewrites), which allows you to configure your `firebase.json` file to achieve things like:

- Redirecting all paths to `/index.html` (useful for SPAs)
- Redirecting requests to `/items/1234` to `/items/id.html`
- Redirecting requests to `/api/get_item` to the HTTP trigger of the Cloud Functions `get_item` function

---

Additionally, by using the [cleanUrls](https://firebase.google.com/docs/hosting/full-config?hl=en) attribute, you can remove the `.html` extension from URLs. Accessing `/page` will retrieve the file `/page.html` uploaded to Hosting, while accessing `/page.html` will redirect to `/page` with a 301 redirect.

These behaviors are very convenient for creating sleek web applications and are often used, but they only work in applications deployed to the Firebase production environment. In the production environment, `/items/1234` returns `/item/id.html`, but in the development environment, `/item/1234` results in a 404 error, which can be frustrating.

https://twitter.com/morishin127/status/1330402595337330690

## rewriteproxy

To address this, I created a proxy that replicates the behavior of rewrites and cleanUrls in the development environment. It reads your local `firebase.json` and operates accordingly.

You can find the repository here.

https://github.com/morishin/rewriteproxy

It is a simple reverse proxy written using the `httputil.ReverseProxy` from Go's standard library. Here's how to use it:

```bash
$ rewriteproxy \
  --port=3000 \
  --firebase-json=/path/to/firebase.json \
  --web-app-url=http://localhost:1234 \
  --cloud-function-base-url=http://localhost:5001/your-project-id/us-central1
```

The `--web-app-url` is the URL of the web application you started locally. For example, if you are using [webpack-dev-server](https://webpack.js.org/configuration/dev-server/), it might be `http://localhost:8080`, or if you are using [parcel](https://parceljs.org/), it might be `http://localhost:1234`. The `--cloud-function-base-url` specifies the URL of the locally running Cloud Functions Emulator. This is what runs when you execute `yarn run serve` in the `functions/` directory of your Firebase project.

## Examples

### Path Rewriting

For example, if you write the configuration to redirect requests to `/items/1234` to `/items/id.html` in your `firebase.json`, and then start the proxy with the command above, accessing `http://localhost:3000/items/1234` will return the file hosted at `http://localhost:1234/items/id.html` in your web application.

![rewrite path](https://user-images.githubusercontent.com/1413408/101050973-4dcddb00-35c8-11eb-9ad2-07a5e4713f82.png)

### Cloud Functions

If you write the configuration to redirect requests to `/api/get_item` to the HTTP trigger of the Cloud Functions `get_item` function in your `firebase.json`, accessing `http://localhost:3000/api/get_item` will execute the local Cloud Functions emulator at `http://localhost:5001/your-project-id/us-central1/get_item`.

![cloud_functions](https://user-images.githubusercontent.com/1413408/101050971-4dcddb00-35c8-11eb-936c-5deb8e2604a4.png)

### cleanUrls

When `cleanUrls: true` is set, it will proxy URLs without `.html` to the web application with `.html` appended.

![clean_urls1](https://user-images.githubusercontent.com/1413408/101051746-29263300-35c9-11eb-8693-89014592d179.png)

Conversely, if you access with `.html` appended, it will redirect to the URL without `.html` with a 301 redirect and behave the same as mentioned above.

![clean_urls2](https://user-images.githubusercontent.com/1413408/101051730-275c6f80-35c9-11eb-8426-8ad7cb086c32.png)

### Root Path

Additionally, accessing `/` will be proxied to the web application's `/index.html`.

![root path](https://user-images.githubusercontent.com/1413408/101050970-4d354480-35c8-11eb-9b96-58d83d03a8f5.png)

## How to Integrate with Your Firebase Project

In your project directory, you should have `functions` and `public` directories. Create a `dev` directory (you can name it anything) at the same level and run `yarn add -D concurrently` inside it.

```sh
PROJECT_ROOT
├── firebase.json
├── functions # Implementation of Cloud Functions
├── public # Implementation of Hosting
└── dev
    ├── package.json
    ├── setup
    ├── start
    └── yarn.lock
```

Prepare the `start` script and set its contents like this. Feel free to modify the URLs and port numbers to your liking. I often run the parcel dev server on port `1235` and receive the rewriteproxy on `1234`. This way, when developing, you can run `dev/start` to start the web app dev server, Cloud Functions emulator, and rewriteproxy together.

```sh
#!/bin/sh -eux

cd "$(dirname "$0")"

./node_modules/.bin/concurrently --kill-others \
  -n public,functions,proxy \
  -c cyan,yellow,blue \
  "cd ../public && yarn run dev" \
  "cd ../functions && yarn run serve" \
  "$(go env GOPATH)/bin/rewriteproxy --firebase-json=../firebase.json --port=1234 --web-app-url=http://localhost:1235 --cloud-function-base-url=http://localhost:5001/YOUR-FIREBASE-PROJECT-ID/us-central1"
```

By the way, I think it would be convenient to set up `setup` like this.

```sh
#!/bin/sh -eu

cd "$(dirname "$0")"

# dev
cd ../dev
yarn install
go get github.com/morishin/rewriteproxy
cd -

# public
cd ../public
yarn install

# functions
cd ../functions
yarn install
```

## Feel Free to Use It

https://twitter.com/morishin127/status/1334681881829261312

If you are developing a web application using Firebase Hosting rewrites or cleanUrls, I think this will be useful, so feel free to use it.

The implementation of this rewriteproxy is minimal and only includes the features I often use from Firebase Hosting rewrites: "path rewriting," "proxying to Cloud Functions," and "removing .html." If you would like to use other features locally, I would appreciate it if you could open an issue or implement it and submit a PR.

https://twitter.com/morishin127/status/1410135081687998465