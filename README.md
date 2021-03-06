# Seul

[![Build Status](https://circleci.com/gh/MehdiGolchin/seul.png?style=shield)](https://circleci.com/gh/MehdiGolchin/seul) [![Coverage Status](https://coveralls.io/repos/github/MehdiGolchin/seul/badge.svg?branch=master)](https://coveralls.io/github/MehdiGolchin/seul?branch=master) [![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/MehdiGolchin/seul/blob/master/LICENSE)

Seul is a simple Task Runner for monorepos. It doesn't need lots of configuration, and you can install and learn it in less than five minutes.

### But What Is a Monorepo?
To understand what a monorepo is, Imagine you are working on a large-scale project which consists of tons of components. You might choose to have a new repository for each one because in this manner you divide your project into smaller chunks which means fast cloning, better access control, and tidier workspace. However, it also means you're going to have a hard time with debugging your dependencies and managing lots of repositories.

Well, dividing a big project into smaller modules is inevitable, although you can keep the related components in a mono repository. A monorepo is merely a repository that contains some associated projects.

### What Is Seul?
In contrast to the straightforward concept of monorepo, creating and managing a monorepo is not an easy task for JavaScript developers.

### Install
Seul has not yet been released. But you can build & use it on your computer, please follow the [Clone & Build section](#clone--build) section.

### Create a Monorepo
A monorepo has a straightforward structure. In fact, all you need is a packages directory. As its name implies it contains all of your node modules.

```shell
mkdir seul-test
cd seul-test
mkdir packages
```

### Show a List of Packages

To get an insight of your node modules use *packages* command. The following tree demonstrates the project structure.

```shell
.
└── packages
    ├── alpha
    │   ├── package.json
    │   └── yarn.lock
    └── beta
        ├── package.json
        └── yarn.lock
```

The command displays the information in a tabular way.

```
seul packages
name   version  path                                                  
-----  -------  -------------------------
alpha  1.0.0    /seul-test/packages/alpha
beta   2.0.0    /seul-test/packages/beta 
```

### Run a Command

Seul allows you to execute a command on all or specific packages. Here in this example I will install jest on all packages.

```shell
seul run "yarn add jest --dev"
```

If you want to execute a command on a specific package(s), pass its name after your command. In the following example, seul will install typescript on both alpha and beta packages.

```shell
seul run "yarn add typescript --dev" alpha beta
```

### More Complex Scripts

Indeed in a real world project you are using complicated scripts. You must define your scripts inside your repository descriptor called *packages.json*.

Here is a simple example of *packages.json* that uses a local typescript to compile the package.

```javascript
{
    "scripts": {
        "clean": "rm -rf dist",
        "build": [
            "@clean",
            "tsc"
        ]
    }
}
```

Now you can use run command again to build your project.

```shell
seul run build
```

### Clone & Build

To clone and build the project you need git and node installed on your computer. If you have the pre-requisites, choose a destination and run following command to start cloning.

```shell
git clone https://github.com/MehdiGolchin/seul.git
```

Then move into the project directory and use your prefered node package manager (npm or yarn) to install dependencies.

Install dependencies using npm:

```shell
cd seul
npm install
```

Or yarn:

```shell
cd seul
yarn install
```

If everything goes well, use your package manager again to build the project.

Build project using npm:

```shell
npm build
```

Or yarn:

```shell
yarn build
```

### Test

Seul uses jest as its testing framework. To run the unit tests use your package manager again and run *test* script.

Test project using npm:

```shell
npm test
```

Or yarn:

```shell
yarn test
```

### Link

The final step to build and run seul locally is linking. When you build the seul, typescript compiler will create a *dist* directory that contains compiled version of codes. All you have to do is running the command bellow inside this directory.

Link project using npm:

```shell
cd dist
npm link
```

Or yarn:

```shell
cd dist
yarn link
```
