const Discord = require('discord.js')
const client = new Discord.Client()

const { token, prefix } = require('./info.json')

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
	console.log('received a message')
})

client.login(token)