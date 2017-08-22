const WebSocket = require('ws');
const Discord = require("discord.js");
const db = require(__dirname + "/db")
const client = new Discord.Client();
var options = require(__dirname + '/options');
ready = false
const wss = new WebSocket.Server({ host: 'localhost', port: 8080, verifyClient: LocalOnlyVerify});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    if(message != null) {
      let spl = message.split(' ')
      switch(spl.length) {
        case 3:
          switch(spl[0]) {
            case 'role_add':
              AddRole(spl[1], spl[2])
              break
            case 'role_remove':
              RemoveRole(spl[1], spl[2])
              break
          }
          break
        default:
          return
      }
    }
  });
});

client.on('ready', () => {
  ready = true
  console.log('bot connected.')
  db.PullQueue(function (queue, callback){
    if (queue != null) {
      for (i = 0; i < queue.length; i++) {
        if (queue[i].adding) {
          AddRole(queue[i].uid, queue[i].role)
        }
        else {
          RemoveRole(queue[i].uid, queue[i].role)
        }
      }
      callback()
    }
  })
});

function GetRole(roleName) {
  let retRole = undefined
  client.guilds.get(options.storageConfig.discord_guild_id).roles.forEach(
    function(role) {
      if (role.name.toUpperCase() == roleName.toUpperCase()) {
        retRole = role
        return
      }
    })
  return retRole
}

function AddRole(user, role) {
  if (ready) {
    client.guilds.get(options.storageConfig.discord_guild_id).members.get(user).addRole(GetRole(role))
  }
  else {
    db.WriteToRoleQueue(user, true, role)
  }
}

function RemoveRole(user, role) {
  if (ready) {
    client.guilds.get(options.storageConfig.discord_guild_id).members.get(user).removeRole(GetRole(role))
  }
  else {
    db.WriteToRoleQueue(user, false, role)
  }
}

function LocalOnlyVerify(info) {
  if(info.req.headers.host.split(':')[0] == '127.0.0.1' || !localOnly)
    return true
  return false
}

console.log('bot connecting')
client.login(options.storageConfig.discord_bot_token)
