const Discord = require('discord.js')
const client = new Discord.Client()

const { token, prefix } = require('./info.json')

const embed = new Discord.MessageEmbed() // sets embed defaults
    .setColor("#39ff14") // neon green
    .setFooter("A discord bot in javascript by maik wilhelm")
    .setTimestamp(new Date())

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
	if (msg.author === client.user) {return}

	const channel = msg.channel

	if (msg.content === 'Fuck' || msg.mentions.has(client.user)) {
		embed.setTitle('Help')
		embed.addField('Prefix', `The prefix for this bot is ${'`' + prefix + '`'}`)
		channel.send(embed)
		embed.fields = []
	}

	if (msg.content.startsWith(prefix)) {
		if (msg.content === prefix) {
			embed.setTitle('General')
			embed.addField('Error', 'No command!! \nTry again!')
			channel.send(embed)
			embed.fields = []
		}

		let fullMessage = msg.content.substr(1)
		let splitMessage = fullMessage.split(' ')
		let cmnd = splitMessage[0]
		let args = splitMessage.slice(1)

		if(cmnd === 'help') {
			embed.setTitle('Help')
      embed.addField('Valid commands are:', '> help \n> gitProject \n> status')
			embed.addField('If you ever forget the prefix:', `> type ${'`Fuck`'} \n> ping the bot`)
			embed.addField('Prefix', `The prefix is ${'`' + prefix + '`'}`)
      channel.send(embed)
      embed.fields = []
		} else if(cmnd === 'gitProject') {
			channel.send('https://github.com/MikeCodes2586/fwkdn')
		} else if(cmnd === 'status') {
			embed.setTitle('Status')
			embed.addField('Fwfdn?! is currently running!', '(っ◔◡◔)っ')
			channel.send(embed)
			embed.fields = []
		}
	}
})

client.login(token)