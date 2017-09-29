/*
 * BeefyBot by Atticus Zambrana
 * 
 * All code is written by and Owned by Atticus Zambrana
 * 
 * One of my most loved projects ever, I love programing in JS and Java, and
 * I really like Discord.
 */
console.log("Loading Discord.js...");
const Discord = require("discord.js");
console.log("Loading File-System...");
const fs = require("fs");
console.log("Loading Config file...");
const configFile = require("./config.json");
console.log("Getting Discord.js Ready...");
const client = new Discord.Client();
console.log("Setting up UAC...");
const pre = "[AngusBeef Network]: ";
console.log("Setting Prefix...");
const prefix = configFile.prefix;
console.log("Logging in to Official Discord Servers...");
client.login(configFile.token);

function log(message, sender) {
    console.log(pre + sender + "> " + message);
}
console.log("Setting up Points...");
let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));
if(configFile.useDatabase == true) {
	console.log("Setting up Database...");
	try {
		let database = JSON.parse(fs.readFileSync("./database.json", "utf-8"));
	}
	catch (err){
		console.log("==============================");
		console.log("Unable to Connect to Database!");
		console.log("Make sure the database is there");
		console.log("and in correct JSON Format!");
		console.log("==============================");
	}
}
  client.on("ready", () => {
      log("AngusBeef Network Bot Ready!", "System");
      // Used to set the game that the bot is playing...
      client.user.setGame(configFile.game);
	  // Change it in the config file
  });
  
client.on("message", message => {
  if (message.author.bot) return;
  // When a user sends a message, check if they have their points stored
  // If not, make it
  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0,
  };
 
  let userData = points[message.author.id];
  let config = configFile;

  let curLevel = Math.floor(0.3 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`Hey! You"ve leveled up to level **${curLevel}**!`);
    log("A User has leveled up!", "Points");
  }
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });
  client.on("message", message => {
      // Every time the user sends a message, they get a point
      //userData.points++;
	  userData.points = userData.points + 1;
  });
  
  // Main Bot commands
  // To get your level and points
  if (message.content.startsWith(prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
    log("user asked for their level", "Points");
  }
  // Really weird command
  if (message.content.startsWith(prefix + "date")) {
	  // Grab the arguments
      const args = message.content.split(/\s+/g).slice(1);
	  let homecoming = false;
      let age = args[0]; // yes, start at 0, not 1.
      let sex = args[1];
      let thisLocation = args[2];
	  if(age < 15) {
		  // Your too young
		  message.reply(`Oh, a little too young for me, your only ${age}`);
	  }
	  else {
		  // Older then 15
		  if(age > 20) {
			  // Your too old
			  message.reply(`Well... I kinda think your a bit old for me, I mean your ${age}`);
		  }
		  else {
			  // Your between 15-20
			  if(homecoming == true) {
				  message.reply(`Hey, I see you're a ${age} year old ${sex} from ${thisLocation}. Wanna be my date to Homecoming?`);
			  }
			  else {
				  message.reply(`Hey, I see you're a ${age} year old ${sex} from ${thisLocation}. Wanna date?`);
			  }
		  }
	  }
  }
  // Say Command
  if(message.content.startsWith(prefix + "say")) {
	  const args = message.content.split(/\s+/g).slice(1);
	  message.channel.send(`${args}`);
  }
  
  // Rape me Command
  if (message.content.startsWith(prefix + "rapeme")) {
	  message.reply("just got raped by a dolphin...");
	  log("Someone just got raped", "RPP");
  }
  // Command that lets you stab someone
  if (message.content.startsWith(prefix + "stab")) {
      log("a user has just stabbed someone!", "SECURITY");
      let target = message.mentions.members.first();
	  if (target == null) {
		  message.reply("You have to @mention someone to stab!");
	  }
      var randomNum = Math.floor(Math.random() * 4);
      if (randomNum == 1) {
        message.reply(`Has Stabbed ${target}!`);  
      }
      else if (randomNum == 2) {
          message.reply(`Just Stabbed ${target} to death!`);
      }

      else if (randomNum == 3) {
          message.reply(`The Police are after you for stabbing ${target}!`);
      }
	  else if (randomNum == 4) {
		  message.reply(`Just Killed ${target} and loves death!`);
	  }
  }
  /*
  if(message.content.startsWith(prefix + "joke")) {
	  let randJoke = Math.floor(Math.random() * 5);
	  if(randJoke == 0) {
		  message.channel.send("Your life...");
		  message.channel.send("its a huge joke...");
	  }
	  else if(randJoke == 1) {
		  
	  }
	  //message.channel.send();
  }
  */
  // Obama Command
  if (message.content.startsWith(prefix + "obama")) {
	  message.reply("Obama will get hit by a tractor!");
	  message.reply("Literally a TRACTOR!");
	  log("Someone hit Obama with a tractor", "SECURITY");
  }
  // Setconfig command
  if(message.content.startsWith(prefix + "setconfig")) {
	let AdminRole = message.guild.roles.find("name", "Admin");
	let OwnerRole = message.guild.roles.find("name", "Owner");
	let sender = message.author;
	if (!sender.roles.has(AdminRole.id)) {
		message.reply("Access Denied");
		log(`${sender.author} tried to set a config value, but doesn't have permission!`, "UAC");
		return;
	}
	else if (!sender.roles.has(OwnerRole.id)) {
		message.reply("Access Denied");
		log(`${sender} tried to set a config value, but doesn't have permission!`, "UAC");
		return;
	}
	else {
		const args = message.content.split(/\s+/g).slice(1);
		let configs = args[0];
		let value = args[1];
		config.configs = value;
		message.reply("Config value successfully set!");
		log(`${sender} has just set a config value!`, "CONSOLE");
	  fs.writeFile("./config.json", JSON.stringify(config), (err) => {
		if (err) console.error(err);
	  });
	  return;
	}
  }
	if(message.content.startsWith(prefix + "version")) {
		let thisVersion = configFile.version;
		message.reply("I am running BeefyBot version " + thisVersion);
	}
	if(message.content.startsWith(prefix + "invite")) {
		message.channel.send("Here is a link to invite me to your server!");
		message.channel.send("https://discordapp.com/oauth2/authorize?client_id=339851824238559252&scope=bot&permissions=8");
	}
  // Moderation Commands
  // Kick Command
  if(message.content.startsWith(prefix + "kick")) {
	let JrModRole = message.guild.roles.find("name", "Jr. Mod");
	let ModRole = message.guild.roles.find("name", "Moderator");
	let AdminRole = message.guild.roles.find("name", "Admin");
	let OwnerRole = message.guild.roles.find("name", "Owner");
	  if (!message.author.roles.has(ModRole.id) || !message.author.roles.has(AdminRole.id) || !message.author.roles.has(OwnerRole.id)) {
		return message.reply("Access Denied");
		log(`${message.author} tried to kick, but doesn't have permission!`, "UAC");
	  }
	  if(message.mentions.users.size === 0) {
		  return message.reply("You must define a user to kick!");
	  }
	  let target = message.guild.member(message.mentions.users.first());
	  if(!target) {
		  return message.reply("User not found!");
	  }
	  if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
		  return message.reply("I don't have permission node (KICK_MEMBERS) ");
	  }
	  message.channel.send(`Player ${target} has been kicked by ${message.author}!`);
	  target.kick();
	  log(`${message.author} has kicked ${target}!`, "UAC");
  }
  if(message.content.startsWith(prefix + "setgame")) {
	  const args = message.content.split(/\s+/g).slice(1);
	  client.user.setGame(args);
	  message.reply("Successfully set the game!");
	  
  }
  // Help Command
  if(message.content.startsWith(prefix + "help")) {
      message.author.send("===== BeefyBot Help =====");
      message.author.send("&level - Show your current points and level");
      message.author.send("&avatar - Gives you a link to your avatar");
      message.author.send("&date <your age> <your gender> <your location> - date the bot");
      message.author.send("&stab <your target> - stab someone");
	  message.author.send("&rapeme - Get raped");
	  message.author.send("&obama - Hit Obama with a tractor");
	  message.author.send("&version - See the Version of BeefyBot");
	  message.author.send("&invite - Invite BeefyBot to your server!");
	  message.author.send("===== Moderation Commands =====");
	  message.author.send("&kick <user> - Kick a user");
  }
});