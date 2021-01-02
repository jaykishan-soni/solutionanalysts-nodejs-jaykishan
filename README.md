# solutionanalysts-nodejs-jaykishan API

This project is based on post an articles and guest user can comment on an article and comment on comment of an articles too.

## Requirements

For development, you will only need Node.js and NPM (Node Package Manager) installed in your system.

### RabbitMQ

For implementing message queue, You need to install and run RabbitMQ in your system
For installing and run RabbitMQ, execute below docker command in your terminal window
      $ sudo docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

If you don't have installed docker yet, Please run below command first.
    $ sudo snap install docker
    $ sudo apt  install docker.io

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v10.16.3

    $ npm --version
    v6.9.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/jaykishan-soni/solutionanalysts-nodejs-jaykishan.git
    $ cd solutionanalysts-nodejs-jaykishan
    $ npm install

## Running the project

    $ npm start

## Simple build for production

    $ npm build

## Postman collection to check APIs
  You can import API collection from [Postman Collection Link](https://www.getpostman.com/collections/612cd85417ba1310aab7)