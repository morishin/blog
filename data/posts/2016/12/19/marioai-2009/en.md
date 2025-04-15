---
keywords:
  - 開発
---

# Mario AI Competition 2009 with Genetic Algorithm

This article is the 19th entry in the [CAMPHOR - Advent Calendar 2016](http://advent.camph.net/).

# What is Mario AI Competition 2009?
The [Mario AI Competition 2009](http://julian.togelius.com/mariocompetition2009/index.php) was a competition organized by researchers [Sergey Karakovskiy](https://scholar.google.com/citations?user=6cEAqn8AAAAJ&hl=en) and [Julian Togelius](https://scholar.google.com/citations?user=lr4I9BwAAAAJ&hl=en), where participants created AI to automatically control a game modeled after Super Mario Bros and compete for scores. This is not Super Mario Run.

---

# What I Did
While reading the code and experimenting, I implemented an agent and managed to clear a simple stage, so I will introduce what I did.

- Preparation
  - Downloaded the source code from the official site as a zip file and set up the development environment (this was the most challenging part).
- Implementation of the Learning Agent
  - Created an agent that learns to operate using a genetic algorithm.
- Results
  - After training with 10 individuals per generation, individuals that could reach the goal started to appear around the 50th generation.

Generation 1
<iframe width="400" height="225" src="https://www.youtube.com/embed/DcbBqcn-LR4?rel=0" frameborder="0" allowfullscreen></iframe>

Generation 40
<iframe width="400" height="225" src="https://www.youtube.com/embed/lmRZfCGzw0Q?rel=0" frameborder="0" allowfullscreen></iframe>

Generation 50
<iframe width="400" height="225" src="https://www.youtube.com/embed/3bBGaMJ1uaA?rel=0" frameborder="0" allowfullscreen></iframe>

# Preparation
The game program for Super Mario Bros and the sample code for the agent controlling Mario were both written in Java. However, the game program had an option to run in server mode, allowing [TCP communication to control Mario](http://julian.togelius.com/mariocompetition2009/advanced.php), which meant the agent could be created in any language.

There was a sample client implemented in Python within the project, so I used that as a reference to implement the learning agent in Python. The sample was in Python 2, so I initially [converted](https://github.com/morishin/marioai-2009/commit/75475c1578674150a14a6eccb4048413eaeae761) it to Python 3 and then proceeded with the implementation.

Even though I executed the commands as written in the [official documentation](http://julian.togelius.com/mariocompetition2009/gettingstarted.php), it didn't work, so I explored ways to execute it and documented them in [README.md](https://github.com/morishin/marioai-2009/tree/yatteiku).

# Implementation of the Learning Agent
## Mario's Action Selection
The input and output of the agent program are as follows.
### Input (Surrounding State of Mario)
I extracted the following information from the [environment information](https://github.com/morishin/marioai-2009/blob/master/src/ch/idsia/mario/environments/Environment.java) around Mario to use as input.

- Whether the 7 squares around Mario are obstacles (7 bits)
- Whether Mario can jump (1 bit)
- Whether Mario is grounded (1 bit)

<img width="200" src="https://g.morishin.me/6fe2b51593d10d4adb9f6ad3729b6d5b.png"/>

<img width="500" src="https://g.morishin.me/8597d6ca76811f184077b2075918ce4c.png" />

### Output (Mario's Next Action)
- Whether to press ↓←→A (jump) B (fire/dash) (5 bits)

<img width="330" src="https://g.morishin.me/4cd1bc55c06119f59f5865c559a6f484.png" />

## Genetic Algorithm
### Individual
I represented the combination of input and output as a single gene locus, considering the information of all input-output patterns as a gene. In the program, it is simply an array of ints.

<img width="400" src="https://g.morishin.me/81fa73d516152baee69d707cef45fb9e.png" />

### Selection, Crossover, and Mutation
The trials and learning were conducted through the following process. As a result, I was able to create individuals that cleared the stage around the 50th generation.

1. Generate 10 initial individuals with random genes to form the first generation.
2. Let the first generation play the game and obtain their scores (the score is higher the longer Mario travels).
3. Keep the individual with the highest score to the next generation (selection).
4. Select 2 individuals to be parents (individuals with higher scores are more likely to be chosen) and perform two-point crossover to generate 2 offspring. Repeat this to generate a total of 9 offspring, which will be combined with the 1 individual from step 3 to form the next generation.
5. Mutate 30% of the offspring. Mutation involves randomly selecting several gene loci and swapping their values.
6. Let the generated generation play the game. -> Return to step 3.

# Source Code
The source code is placed here.

https://github.com/morishin/marioai-2009

There are various files, but the parts I implemented mainly include the following. I apologize to those who want to read it as the implementation is not clean 🙇.

- Gene (Individual) Model: https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/ga/individual.py
- Selection, Crossover, and Mutation Operations: https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/ga/controller.py
- Agent that operates Mario using gene information: https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/agents/myagent.py
- Main task that actually executes: https://github.com/morishin/marioai-2009/blob/yatteiku/src/python/competition/learn.py

# Thoughts
I thought that genetic algorithms, with their crossover and mutation processes, seemed like a somewhat arbitrary method, and I wasn't sure if they had any real meaning. However, it is certainly impressive how they can approach solutions relatively quickly through repetition. It seems they have also been used in the design of shapes for Shinkansen and satellite antennas. Additionally, it was quite challenging to understand the code written by researchers back in 2009.