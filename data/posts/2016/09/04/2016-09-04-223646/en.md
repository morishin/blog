---
keywords:
  - 開発
---

# Quickly Set Up Your Own nbviewer with Docker and nginx-proxy

When you want to share Jupyter notebooks with others, nbviewer is very convenient. There is an [official page](http://nbviewer.jupyter.org), but it seems you can easily set it up with Docker, so I decided to create my own.

---

1. Set up a record like nbviewer.example.com in your DNS settings pointing to the IP address of your Docker host.
2. Launch [nginx-proxy](https://github.com/jwilder/nginx-proxy) as per the official README<br><pre><code>$ docker run -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy</code></pre>
3. Launch nbviewer by specifying the domain in `VIRTUAL_HOST`<br><pre><code>$ docker run -d -e VIRTUAL_HOST=nbviewer.example.com -e GITHUB_API_TOKEN=<YOUR_API_TOKEN> jupyter/nbviewer</code></pre>
4. Open http://nbviewer.example.com in your browser.
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20160904/20160904223544.png" width="500"/>

That's it. [nginx-proxy](https://github.com/jwilder/nginx-proxy) is amazing.