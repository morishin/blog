---
keywords:
  - 開発
  - Rails
---

# Separating ImageMagick into a Docker Container for Rails + MiniMagick Development Environment

## In Three Lines

- In the development of a Rails application, I prefer a setup where the Rails app runs only on the host machine, while middleware like MySQL and Redis runs in Docker containers (Docker for Mac).
- When trying to use MiniMagick in a Rails app, it is necessary to install ImageMagick in the environment running the Rails app, but the desired version may differ depending on the application being developed, the installation procedures may vary based on the developer's OS, and I generally want to avoid cluttering the local machine environment.
- I prepared a Docker container with ImageMagick installed and configured it to be used from the MiniMagick gem.

---

## Implementation

### Directory Structure

In addition to the usual Rails app structure, I added the script `dev/start` to run the application and `docker-compose.yml`, along with a configuration file `config/initializer/minimagick.rb` to allow MiniMagick to utilize the Docker container.

```txt
.
├── app
︙
└── config
│  └── initializers
│      └── minimagick.rb
├── dev
│   └── start
├── docker-compose.yml
└── tmp
    └── images
```

### config/initializers/minimagick.rb

MiniMagick executes the system's ImageMagick command internally, and there is an option to add a prefix to that command. By specifying `docker exec <container_name>` here, MiniMagick can use ImageMagick from the Docker container.
https://github.com/minimagick/minimagick/blob/d484786f35e91f107836d3c86aca61d50a35820b/lib/mini_magick/tool.rb#L126

```ruby
require "mini_magick"

if Rails.env.development?
  ::MiniMagick.configure { |config|
    config.cli = :imagemagick
    config.cli_prefix = %w[docker exec imagemagick]
  }
end
```

### docker-compose.yml

This configuration sets up a container for ImageMagick alongside other middleware like MySQL. This container is kept running, and commands are executed like `docker exec imagemagick <ImageMagick command>`. I used a Docker image for ImageMagick that I found by searching on Docker Hub: https://hub.docker.com/r/v4tech/imagemagick.

MiniMagick uses `Dir.tmpdir` for the location of the image files it handles, which means it utilizes the directory specified by the environment variable `TMPDIR` on Linux. Therefore, it is necessary to mount this directory from the host machine to the imagemagick container, which is specified in the `volumes`.

```yaml
version: '3.7'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: hoge
      MYSQL_USER: hoge
    ports:
      - "3307:3306"
  imagemagick:
    container_name: imagemagick
    image: v4tech/imagemagick
    volumes:
      - $TMPDIR:$TMPDIR
    tty: true
    command: "/bin/ash"
```

### dev/start

This script starts the container group and the Rails app while specifying the path for the environment variable `TMPDIR`.

```sh
#!/bin/sh -eu

SCRIPT_DIR=$PWD/$(dirname $0)
ROOT_DIR=$SCRIPT_DIR/..
TMPDIR="$ROOT_DIR/tmp/images" # Explicitly specify the TMPDIR path to share with the imagemagick container

docker-compose up -d
bin/rails server
```

With this implementation, MiniMagick will utilize ImageMagick inside the Docker container, allowing you to avoid installing ImageMagick on your local machine ☺️.

Note that this is specifically for development environments where you want to run the Rails app on the host machine. In production environments where the Rails app is executed as a Docker container, you can simply install ImageMagick in that container.