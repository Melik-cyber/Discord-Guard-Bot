const db = require("quick.db");
const Discord = require('discord.js');
const fynx = require("../ayarlar/bot.json");
exports.run = async (client, message, args) => {
let prefix = await db.fetch(`prefix.${message.guild.id}`) || fynx.prefix
let eklenti = new Discord.MessageEmbed()
.setAuthor(`K A R T E L Yardım Menüsü`, client.user.avatarURL())
.setColor('#640323')
.addField(`__Genel Komutlar__`,`<a:YklenmeGif:826398963070271498>  \`${prefix}yardım\``,true)
.addField(`__Mod Komutları__`,`<a:kitapmor:833583505438015508>  \`${prefix}moderasyon\` `,true)
.addField(`__Guard Komutları__`,`<a:B_Dikkat:833583503144386601>  \`${prefix}guard\`  `,true)
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
    name: 'yardım',
    description: '[Genel Komut]',
    usage: 'yardım'
  };
