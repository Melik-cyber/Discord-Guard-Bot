const Discord = require('discord.js');
const moment = require('moment');
const chalk = require('chalk');
const { prefix } = require('../ayarlar/bot.json')

module.exports = client => {
  var degisenOynuyor = [

    "K A R T E L ",
    "G U A R D B O T",
    "B Y   M E L İ K"

  ]

  setInterval(function() {
    var degisenOynuyor1 = degisenOynuyor[Math.floor(Math.random() * (degisenOynuyor.length))]
    client.user.setActivity(`${degisenOynuyor1}`);

}, 2 * 2000);

  client.user.setStatus("idle"); //dnd, idle, online, offline

}
