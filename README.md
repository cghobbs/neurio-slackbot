# Neurio Slackbot

This simple node apps provides rudimentary integration between Neurio and Slack. Currently it monitors two specific appliances: our electric kettle and coffee maker. It updates our caffeine slack channel when either of those appliances finish.

## Installation

Once this repository has been cloned, navigate to the directory and run: 

```npm install```

You will need to make sure the following environment variables are set:

SLACK_KEY
CLIENT_ID (Neurio)
CLIENT_SECRET (Neurio)

## Starting the App

```node app.js```
