const { Client, MessageAttachment} = require('discord.js');
const {token, prefix} = require('./config.json');
const client = new Client();

function sendError(message, error) {
  message.reply(error);
}

let url = [
  "https://chart.googleapis.com/chart?",
  "cht=qr",
  "choe=UTF-8",
]

client.login(token);

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  if(message.content.slice(1).split(' ')[0] === 'qr') {
    const regexp1 = new RegExp('"(.*?)"', 'i');
    const regexp2 = new RegExp("'(.*?)'", 'i');
    const result = message.content.trim().match(regexp1) || message.content.trim().match(regexp2);

    if(!result) {
      sendError(message, 'Not have any arguments')
      return;
    }

    const regSize = new RegExp('size=(\\d*[x]\\d*)', 'i');
    let size = message.content.match(regSize);
    if(size) url.push(`chs=${size[1]}`);
    else url.push('chs=200x200');

    let content = result[1].trim().replace(' ', '+');
    url.push(`chl=${content}`);

    message.channel.send(url.join('&'));
  }
})
