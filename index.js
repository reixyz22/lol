require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!';
const users = [];
const ping = [];
let count = 0;
let countgame = 0;
let xrandomindex = [];
let msg = 0;

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function shuffleassign(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = xrandomindex[i];
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const cmd = message.content.slice(prefix.length).trim().split(' ')[0];

  if (cmd === 'q') {
    if (ping.includes(message.author)) {
      message.channel.send("You are already in the queue!");
    } else {
      users[count] = message.author.username;
      ping[count] = message.author;
      count++;
      message.channel.send("You have been added to the queue.");
    }
  }

  else if (cmd === 'r') {
    const index = ping.indexOf(message.author);
    if (index > -1) {
      users.splice(index, 1);
      ping.splice(index, 1);
      count--;
      message.channel.send("You have been removed from the queue.");
    } else {
      message.channel.send("You are not in the queue!");
    }
  }

  else if (cmd === 'n') {
    if (count > 1) {
      if (countgame === count - 1) {
        message.channel.send("**The queue is being shuffled.**");
        xrandomindex = [...Array(ping.length).keys()];
        shuffle(xrandomindex);
        shuffleassign(ping);
        shuffleassign(users);
        countgame = 0;
      }
      message.channel.send(`${ping[countgame]} is currently asking ${ping[countgame + 1]}`);
      countgame++;
      msg = count - countgame;
    } else {
      message.channel.send("**Too few players to start the game.**");
    }
  }

  else if (cmd === 's') {
    if (count > 1) {
      if (message.author === ping[countgame]) {
        message.channel.send(`${users[countgame + 1]} has been removed`);
        users.splice(countgame + 1, 1);
        ping.splice(countgame + 1, 1);
      } else {
        message.channel.send(`${users[countgame]} has been removed.`);
        users.splice(countgame, 1);
        ping.splice(countgame, 1);
      }
      count--;

      if (count > 1) {
        if (countgame === count - 1) {
          message.channel.send("**The queue is being shuffled.**");
          xrandomindex = [...Array(ping.length).keys()];
          shuffle(xrandomindex);
          shuffleassign(ping);
          shuffleassign(users);
          countgame = 0;
        }
        message.channel.send(`${ping[countgame]} is currently asking ${ping[countgame + 1]}`);
        countgame++;
        msg = count - countgame;
      } else {
        message.channel.send("**Too few players to start the game.**");
      }
    } else {
      message.channel.send("**Too few players to start the game.**");
    }
  }

  else if (cmd === 'd') {
    message.channel.send("**The current queue is:**");
    message.channel.send(users.join('\n'));
    message.channel.send(`${count} Players currently in queue.\n${msg} T/D Remaining until next randomization.`);
  }

  else if (cmd === 'bug') {
    message.channel.send("!q");
  }

  else if (cmd === 'p') {
    message.channel.send("**The queue has been purged.**");
    users.length = 0;
    ping.length = 0;
    count = 0;
    msg = 0;
  }
});

client.login(process.env.BOT_TOKEN);
