
 const db = require("quick.db");
const Discord = require('discord.js');
const fynx = require("../ayarlar/bot.json");
exports.run = async (client, message, args) => {
let prefix = await db.fetch(`prefix.${message.guild.id}`) || fynx.prefix
let eklenti = new Discord.MessageEmbed()
.setColor('#ffffff')
.setAuthor(`K A R T E L Moderasyon Komutları`, client.user.avatarURL())
.addField(`__Ban__`,`<a:uakkalp:833583507854327828>   \`${prefix}ban\` Sunucunuzda Belirtiğiniz Kişiyi Yasaklar`,true)
.addField(`__Kick__`,`<a:uakkalp:833583507854327828>  \`${prefix}kick\` Sunucunuzda Belirtiğiniz Kişiyi Kickler`,true)
.addField(`__Ban Kaldırma__`,`<a:uakkalp:833583507854327828>  \`${prefix}unban\` yazarak Sunucunuzda Belirtiğiniz Kişinin Banını Açar`,true)
.addField(`__Reklam Engel__`,`<a:uakkalp:833583507854327828>   \`${prefix}reklamengel\` Reklam Yapılmasını Tamamen Yasaklar.`,true)
.setThumbnail(client.user.avatarURL)
 message.channel.send(eklenti)
  };
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };

  exports.help = {
    name: 'moderasyon',
    description: '[Mod Komut]',
    usage: 'moderasyon'
  };
