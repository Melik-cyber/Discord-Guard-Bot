const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Jimp = require("jimp");
const db = require("quick.db");
const token = process.env.token;
var prefix = process.env.prefix;

client.on("ready", () => {
  console.log(`Bot suan bu isimle aktif: ${client.user.tag}!`);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

///////////// KOMUTLAR BAŞ

/////////////////// ROL KORUMA //////////////////////////////

client.on('guildMemberUpdate', async (oldMember, newMember) => {
let guild = oldMember.guild || newMember.guild;
  
    let chimp = await guild.fetchAuditLogs({type: 'MEMBER_ROLES_UPDATE'});
  
    if(chimp) {
      
let asd = []

oldMember.roles.cache.forEach(c => {
if(!newMember.roles.cache.has(c.id)) {
require('quick.db').delete(`${guild.id}.${c.id}.${oldMember.id}`)
}
})
newMember.roles.cache.forEach(c => {
if(!oldMember.roles.cache.has(c.id)) {
require('quick.db').set(`${guild.id}.${c.id}.${newMember.id}`, 'eklendi')
}
  
})
    
    }
})

client.on('roleDelete', async role => {
let guild = role.guild;
  
  let e = await guild.fetchAuditLogs({type: 'ROLE_DELETE'});
  let member = guild.members.cache.get(e.entries.first().executor.id);
  //if(member.hasPermission("ADMINISTRATOR")) return;
        
  let mention = role.mentionable;
  let hoist = role.hoist;
  let color = role.hexColor;
  let name = role.name;
  let perms = role.permissions;
  let position = role.position;
  role.guild.roles.create({
    name: name,
    color: color,
    hoist: hoist,
    position: position,
    permissions: perms,
    mentionable: mention
  }).then(async rol => {
    
  guild.members.cache.forEach(async u => {
  const dat = await require('quick.db').fetch(`${guild.id}.${role.id}.${u.id}`)
  if(dat) {

  guild.members.cache.get(u.id).roles.add(rol.id)
  }
    
  })
client.channels.cache.get(ayarlar.rolKorumaLogKanalID).send(new Discord.MessageEmbed().setAuthor(guild.name, guild.iconURL()).setTitle(`Bir rol silindi!`)
.setDescription(`${rol.name} isimli rol ${member} tarafından silindi ve bende tekrardan rolü oluşturdum, önceden role sahip olan tüm kişilere rolü geri verdim.`))
  })
  
})


/////////////////// ROL KORUMA //////////////////////////////

////////////////// EMOJİ KORUMA ////////////////////////////

client.on("emojiDelete", async (emoji, message) => {
  
  let kanal = await db.fetch(`emotek_${emoji.guild.id}`);
  if (!kanal) return;
  
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
    
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
    
   let embbed = new Discord.MessageEmbed()
   .setColor('RANDOM')
   .setTitle(`Bir Emoji Silindi`)
   .setDescription(`Silinen Emoji: ${emoji.name}, Emoji Koruma Sistemi Açık Olduğundan Tekrar Eklendi!`)
   client.channels.cache.get(kanal).send(embbed)
  
  }

});

////////////////// EMOJİ KORUMA ////////////////////////////

///////////////// KANAL KORUMA /////////////////////////////

client.on("channelDelete", async channel => {
  const logs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(audit => audit.entries.first())
  const deleter = await channel.guild.members.cache.get(logs.executor.id);
  if(deleter.hasPermission("ADMINISTRATOR")) return; 
  channel.clone(undefined, true, true, "Kanal silme koruması sistemi").then(async klon => {
    
    let guild = channel.guild;
    let logs = guild.channels.cache.find(ch => ch.id === ayarlar.kanalKorumaLogKanalID);
    
    const embed = new Discord.MessageEmbed()
      .setDescription(`Silinen Kanal: <#${klon.id}> (Yeniden oluşturuldu!)\nSilen Kişi: ${deleter.user}`)
      .setColor('RED')
      .setAuthor(deleter.user.tag, deleter.user.displayAvatarURL())
      logs.send(embed);
    
    await klon.setParent(channel.parent);
    await klon.setPosition(channel.position);
  })
})


///////////////// KANAL KORUMA /////////////////////////////

////////////// KOMUTLAR SON
////////////// ALTI ELLEME
require("./util/eventLoader")(client);


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(token);
