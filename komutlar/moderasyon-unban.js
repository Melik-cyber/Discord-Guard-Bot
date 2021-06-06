const Discord = require('discord.js');
const fs = require('fs');

exports.run = async (client, message, args) => {

  const db = require('quick.db');

  const fynx = require("../ayarlar/bot.json");
let prefix = await db.fetch(`prefix.${message.guild.id}`) || fynx.prefix;

  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`<:BanlandnzPng:827470297857916929>   **Bu komutu kullanabilmek için "\`Üyeleri Yasakla\`" yetkisine sahip olmalısın.**`);


  let user = args[0];
  let reason = args.slice(1).join(' ');
  if (db.has(`log_${message.guild.id}`) === false) return message.channel.send(`> **Mod Log Kanalı Ayarlanmamış | ${prefix}modlog #kanal**`);
  let modlog = message.guild.channels.cache.get(db.fetch(`log_${message.guild.id}`).replace("<#", "").replace(">", ""));
 if (isNaN(user)) return message.channel.send('<:BanlandnzPng:827470297857916929>  **Lütfen Banını Açmak İstediğiniz Üyeninin ID sini Girin**');
  if (reason.length < 1) return message.channel.send('<:BanlandnzPng:827470297857916929>  **Lütfen Sebep Giriniz**');


  const embed = new Discord.MessageEmbed()
  .setColor("#ffffff")
  .addField('<:BanlandnzPng:827470297857916929>  İşlem', 'Ban Kaldırma')
  .addField('<:BanlandnzPng:827470297857916929>  Banı Açılan Üye', `(${user})`)
  .addField('<:BanlandnzPng:827470297857916929>  Banı Açan Yetkili', `${message.author.username}#${message.author.discriminator}`)
  .addField('<:BanlandnzPng:827470297857916929>  Banı Açma Sebebi', "```" + reason + "```")
  modlog.send(embed);
  message.guild.members.unban(user);



  const embed2 = new Discord.MessageEmbed()
  .setColor("#ffffff")
  .setDescription(`<:BanlandnzPng:827470297857916929>  Belirtiğiniz İD'nin Banı Açıldı`)
  message.channel.send(embed2)


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'unabn',
  description: '[Admin Komutu]',
  usage: 'unban'
};
