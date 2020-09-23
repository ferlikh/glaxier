# glaxier
WebGL Augmented eXtended Integrated Environment REPL



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About](#about-the-project)
* [Installation](#installation)
* [Usage](#usage)



<!-- ABOUT THE PROJECT -->
## About The Project
This project allows you write, load + run THREE.js scenes more dynamically + efficiently by using functions to transform them.


<!-- GETTING STARTED -->
<!--
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
```sh
npm install npm@latest -g
```
-->

### Installation
 
```sh
git clone https://github.com/fredism/glaxier
cd glaxier
npm install
```

<br />


<!-- USAGE EXAMPLES -->
## Usage
Best way is running a watcher.
```
npm run watch
```

Then, in another terminal, run:
```
node index.js
```

Now you should see something like:
```
glxr>
```

Now try running a scene:
```
render('cube') // or render('sphere')
```
![alt text](https://github.com/fredism/glaxier/blob/master/assets/img/cube.png?raw=true)


Scenes can also be composed:
```
compose('cube', 'sphere')
```
![alt text](https://github.com/fredism/glaxier/blob/master/assets/img/composed.png?raw=true)

<br />
Give it a try!
