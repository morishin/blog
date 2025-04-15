---
keywords:
  - 開発
  - Minecraft
  - Python
  - AWS
---

# Lambda Function to Run Minecraft Multiplayer Server Only During Playtime

## Three Lines
- A Minecraft server requires an instance with at least 2GB of memory, but renting a VPS often costs around 2000 yen per month.
- Since it only needs to run during playtime, I set it up to launch an instance from Slack, save data after playing, and then destroy it.
- You can play for $0.03 / hour.

---

## [minecraft-lambda-function](https://github.com/morishin/minecraft-lambda-function)
I created an AWS Lambda Function with the following features to run a Minecraft server only during playtime.

- `create`: Generate a server instance on DigitalOcean → Download play data (`world` directory) from S3 → Start the Minecraft server → Notify the IP address to Slack
- `upload`: Upload play data to S3
- `destroy`: Destroy the instance

https://twitter.com/morishin127/status/818309827709411328

## Interface
Call the corresponding function using Slack's Slash Commands.

- `/minecraft create`
- `/minecraft upload`
- `/minecraft destroy`

![Interface Diagram](https://cloud.githubusercontent.com/assets/1413408/21756755/aaf11ad6-d668-11e6-82e1-9513630b1083.png)

## Architecture
The Lambda Function operates with the structure shown in the diagram. The Minecraft server application itself runs using the Docker image [itzg/minecraft-server](https://hub.docker.com/r/itzg/minecraft-server/). It is convenient to start it with the URL of `world.zip` on S3 passed as an environment variable.

### create⚒
![create](https://cloud.githubusercontent.com/assets/1413408/21756322/2dda13ea-d663-11e6-9c16-53fe50475df0.png)

### upload🚀
![upload](https://cloud.githubusercontent.com/assets/1413408/21756340/7fe91df2-d663-11e6-9a93-c88b85ffa6a2.png)

### destroy💥
![destroy](https://cloud.githubusercontent.com/assets/1413408/21756324/2de341cc-d663-11e6-8b41-e28ffcf22af4.png)

## Execution from Slack
To execute the Lambda Function from Slack's Slash Commands, I used API Gateway.

1. Create an endpoint in API Gateway and set it up to execute the minecraft-lambda-function when POSTed.
2. The Lambda Function wants to receive parameters in JSON, but Slack Slash Commands do not send them in JSON, so I set up a Body Mapping Template in API Gateway.
  ![Body Mapping Template](https://cloud.githubusercontent.com/assets/1413408/21756702/fbec5258-d667-11e6-97b5-8c32ac4bb5cb.png)
  It looks like this.
  ```txt
  #set($httpPost = $input.path('$').split("&"))
{
\#foreach( $keyValue in $httpPost )
 \#set($data = $keyValue.split("="))
 "$data[0]" : "$data[1]"\#if( $foreach.hasNext ),\#end
\#end
}
```
3. Set up the Slack Slash Commands
  Set the URL to the API Gateway endpoint URL. The Token set here will be included in the JSON data passed to the Lambda Function. (By also setting the same Token in the environment variables on the Lambda Function side and verifying it within the Function, requests from sources other than Slack Slash Commands can be ignored.)
  ![Slack Slash Commands](https://cloud.githubusercontent.com/assets/1413408/21756993/9e921bfc-d66b-11e6-91d9-e80829ae960b.png)
4. When you execute `/minecraft create` from Slack,
  ```json
{"token": "*****", "text": "create"}
```
the Lambda Function will be executed with these parameters 🎉

## Operation
Although the logs of the Slash Commands themselves are not retained, the logs look something like this.
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20170220/20170220005920.png" width="512" height="141" loading="lazy" />

## Cost
It only costs for the time played at $0.03 / hour, so it's inexpensive 💰
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/m/morishin127/20170220/20170220010515.png" width="512" height="249" loading="lazy" />

## Impressions
Super convenient!!!!!!!

## Aside
This is a lesson learned when I struggled with building the Lambda deployment package on macOS and it didn't work on Lambda.

http://qiita.com/morishin/items/cfba9ed41a73158b38f6