const Discord = require('discord.js');
const fs = require('fs');

const ayarlar = require('../ayarlar/bot.json');

exports.run = async(client, message, args) => {

  let prefix = await require('quick.db').fetch(`prefix.${message.guild.id}`) || ayarlar.prefix


  const db = require('quick.db');



  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send('<a:YanpSnennleGif:827470142581637142>  **Gerekli izniniz bulunmuyor**')


  let user = message.mentions.users.first();
  let reason = args.slice(1).join(' ');
  if (message.mentions.users.size < 1) return message.channel.send('<a:YanpSnennleGif:827470142581637142>  **Lütfen Kicklemek İstediğiniz Kullanıcıyı Etiketleyin**');
  if (reason.length < 1) return message.channel.send('<a:YanpSnennleGif:827470142581637142>   **Kickleme Sebebinizi Giriniz**');
  if (user.id === message.author.id) return message.channel.send('<a:dannsss:836860406328197150>  **Kendini Kickleyeceğine Kendin Çıksana ?**');

  const embed = new Discord.MessageEmbed()
  .setColor("#ffffff")
  .addField('<a:dannsss:836860406328197150>  İşlem', 'Sunucudan Kickleme')
  .addField('<a:dannsss:836860406328197150>  Kicklenen Üye', `${user.tag} (${user.id})`)
  .addField('<a:dannsss:836860406328197150>  Kickleyen Yetkili', `${message.author.username}#${message.author.discriminator}`)
  .addField('<a:dannsss:836860406328197150>  Kick Sebebi', "```" + reason + "```")
  modlog.send(embed);

  message.guild.member(user).kick();

  const embed2 = new Discord.MessageEmbed()
  .setColor("#ffffff")
  .setDescription(`<a:dannsss:836860406328197150>  **Kullanıcı Başarıyla Kicklendi**`)
  message.channel.send(embed2)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'kick',
  description: '[Admin Komutu]',
  usage: 'kick'
};
