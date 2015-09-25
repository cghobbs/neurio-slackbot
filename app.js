var express = require('express'),
    _ = require('underscore'),
    auth = require('./lib/auth'),
    Client = require('./lib/client'),
    schedule = require('node-schedule'),
    Slackbot = require('slackbot'),
    config = require('./config');

var app = express();
var slackbot = new Slackbot('neurio', config.slack_key);

var kettle_message = "The kettle is done boiling."
var coffee_message = "[Beta] The coffee is ready."

var kettle_jokes = ["Did you make enough for me?",
"If you're making a pot, I prefer something a little fruity... just sayin'.",
"I hope you didn't have to wait Oolong.",
"Did you hear the one about the tea that got away? It was a loose leaf.",
"Hit me with your best pot!"];

var coffee_jokes = ["Did you make enough for me?",
"No, I don't have a problem with caffeiene. I have a problem without caffeine!",
"I'll be honest, I haven't slept in years... and I owe it all to coffee.",
"Mmmmm. You know a day without coffee is like... something without... something.",
"BTW, I poured Redbull in my coffee this morning... I CAN SEE SOUNDS.",
"I'm not an addict, I only need coffee on days ending in 'y'.",
"Just remember, there is a time and place for decaf coffee. Never and in the trash.",
"Are you taking coffee orders? I'll have an austrian goat milk double-half-caf-half-decaf-soy milk cappuccino-extra hot with a dash of madagascar cinnamon. Please.",
"Today I will kick ass and make dreams come true. But first coffee."]

var server = app.listen(3000, function () {

  console.log('Neurio is prepared to help keep you caffeinated...');

  auth.simple(config.clientId, config.clientSecret).then(function (client) {

  	client.user().then(function (user) {

  		var locationId = user.locations[0].id;
  		var delay = 15000;
  		
  		setInterval(function(){
  			var now = new Date();
  			var since = new Date(now.getTime() - delay);
  			
  			client.applianceEventsRecent(locationId, since.toISOString()).then(function (events) {

          // Notify slack when a complete kettle event is found
  				e = _.find(events, function (e) {return e.appliance.id == "NJP9jz6QQm2HLjnpz9_Abw" && e.status == "complete"});
  				if (!(_.isUndefined(e))) {
            var message = kettle_message + " " + kettle_jokes[Math.floor(Math.random()*kettle_jokes.length)];
  					slackbot.send("#caffeine", message, function(err, res, body) { if(err) return; });
            console.log(message);
          }

          // When it looks like the coffee maker turns on, send a message 10 minutes from now
          e = _.find(events, function (e) {return e.appliance.id == "-mBxX-ZZSnyiHVuf2vhfsA" && e.status == "in_progress"});
          if (!(_.isUndefined(e))) {
            var date = new Date(now.getTime() + 1000*60*10);
            var message = coffee_message + " " + coffee_jokes[Math.floor(Math.random()*coffee_jokes.length)];
            var job = schedule.scheduleJob(date, function(){
              slackbot.send("#caffeine", message, function(err, res, body) { if(err) return; });
              console.log(message);
            });
            console.log("Coffee maker has started, message scheduled to send in 10 minutes.");
          }

  			});
  		}, delay);

  	}); //client.user

  }); //auth.simple

}); //server