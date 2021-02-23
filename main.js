const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

const { token, prefix } = require('./info.json')

const time = new Date()

const embed = new Discord.MessageEmbed() // sets embed defaults
    .setColor("#39ff14") // neon green
//

const dataFile = './data.json'

let newUser = {
	id: '',
	mod: false,
	birthday: ''
}

let rVal = false
let index
let BDay

function load(file = String) {
	return JSON.parse(
		fs.readFileSync(file).toString()
	)
}

function save(json = String, file = String) {
	return fs.writeFileSync(
		file, 
		JSON.stringify(
			json, 
			null, 
			1
		)
	)
}

let data = load(dataFile)

function userInDatabase(id, bday) {
	data.forEach(obj => {
		Object.entries(obj).forEach(([key, value]) => {
			if (key === 'id') {
				if (value === id) {
					rVal = true
					index = data.findIndex(x => x.id === value)
					if(bday === true) {
						if (data[index].birthday) {
							BDay = data[index].birthday
						} else {
							return
						}
					}
				}
			}
		})
	})
}

/*channel ids: 
 * 756831344364879875
 * 749210894692515880
*/
function bDayCheck() {
	data.forEach(obj => {
		Object.entries(obj).forEach(([key, value]) => {
			if (key === 'id') {
				bdayid = value
			}

			if (key === 'birthday') {
				if (value !== "") {
					let date = value
					let dateArr = date.split('.')
					
					if (parseInt(dateArr[0]) === time.getDate() && parseInt(dateArr[1]) === time.getMonth() + 1) {
						embed.setTitle('Happy Birthday')
						embed.addField(`<@everyone> Today is <@${bdayid}>'s birthday`, 'Congratulations!!!')
						client.channels.cache.get('749210894692515880').send(embed)
						client.channels.cache.get('749210894692515880').send(embed)
						embed.fields = []
					}
				}
			}
		})
	})
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)

	repeatBDayCheck = setInterval(bDayCheck, 86400000)

	client.guilds.cache.forEach(guild => {
		guild.members.cache.forEach(member => {
			userInDatabase(member.id)
			if (rVal === true) {
				return
			} else {
				newUser.id = member.id.toString()
				data.push(newUser)
				save(data, dataFile)
				data = load(dataFile)
			}
		})
	})
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
			embed.addField('Fwkdn?! is currently running!', '(っ◔◡◔)っ')
			channel.send(embed)
			embed.fields = []
		} else if(cmnd === 'ban') {
			const toBan = msg.mentions.members.first()
			const reason = args[1]
			if(toBan && reason) {
				const resolvedToBan = msg.guild.member(toBan)
				if (resolvedToBan) {
					resolvedToBan
						.ban({
							reason: reason,
						})
						.then(() => {
							embed.setTitle('Success')
							embed.addField('Successfully banned a user', `${msg.author.username} banned ${resolvedToBan.user.username}`)
							channel.send(embed)
							embed.fields = []
						})
						.catch(err => {
							embed.setTitle('Error')
							embed.addField('Unable to ban user!!', 'The user may have higher priveledges than the bot!')
							channel.send(embed)
							embed.fields = []

							console.error(err)
						})
				} else {
					embed.setTitle('Error')
					embed.addField('This user isn\'t in this server', 'Try *>ban @[user to ban] [reason]*')
					channel.send(embed)
					embed.fields = []
				} 
			} else {
				embed.setTitle('Error')
				embed.addField('Some arguments are missing!!', 'Try *>ban @[user to ban] [reason]*')
				channel.send(embed)
				embed.fields = []
			}
		} else if(cmnd === 'kick') {
			const toKick = msg.mentions.members.first()
			const reason = args[1]
			if(toKick) {
				const resolvedToKick = msg.guild.member(toKick)
				if (resolvedToKick) {
					resolvedToKick
						.kick({
							reason: reason,
						})
						.then(() => {
							embed.setTitle('Success')
							embed.addField('Successfully kicked a user', `${msg.author.username} kicked ${resolvedToKick.user.username}`)
							channel.send(embed)
							embed.fields = []
						})
						.catch(err => {
							embed.setTitle('Error')
							embed.addField('Unable to kick user!!', 'The user may have higher priveledges than the bot!')
							channel.send(embed)
							embed.fields = []

							console.error(err)
						})
				} else {
					embed.setTitle('Error')
					embed.addField('This user isn\'t in this server', 'Try *>kick @[user to kick] [reason]*')
					channel.send(embed)
					embed.fields = []
				} 
			} else {
				embed.setTitle('Error')
				embed.addField('Some arguments are missing!!', 'Try *>kick @[user to kick] [reason]*')
				channel.send(embed)
				embed.fields = []
			}
		} else if(cmnd === 'addBDay') {
			userInDatabase(msg.author.id)
			if(rVal === true) {
				if (!args[0]) {
					embed.setTitle('Error')
					embed.addField('No date specified!', 'Use `>addBDay dd.mm`')
					channel.send(embed)
					embed.fields = []
					return
				}
				let date = args[0]
				let dateArr = date.split('.')

				if(dateArr[0].length > 2 || dateArr[0].length < 1 || dateArr[1].length > 2 || dateArr[1].length < 1 || dateArr.length > 2 || dateArr.length < 2 || parseInt(dateArr[0]) > 31 || parseInt(args[0]) < 1 || parseInt(args[1]) > 12 || parseInt(args[1]) < 1) {
					embed.setTitle('Error')
					embed.addField('Some values are wrong!', 'Try `>addBDay day.month`, day and month being numbers')
					channel.send(embed)
					embed.fields = []
				} else {
					data[index].birthday = args[0]
					save(data, dataFile)
					data = load(dataFile)
					embed.setTitle('Success')
					embed.addField('Successfully added your birthday!', 'You will now be congratulated on your birthday')
					channel.send(embed)
					embed.fields = []
				}
			} else {
				newUser.id = member.id.toString()
				data.push(newUser)
				save(data, dataFile)
				data = load(dataFile)
			}
		} else if(cmnd === 'delBDay') {
			userInDatabase(msg.author.id)
			if (rVal === true) {
				data[index].birthday = ""
				save(data, dataFile)
				data = load(dataFile)

				embed.setTitle('Success')
				embed.addField('Successfully removed your birthday', 'You won\'t be notified about your birthday anymore!')
				channel.send(embed)
				embed.fields = []
			} else {
				newUser.id = msg.author.id.toString()
				data.push(newUser)
				save(data, dataFile)
				data = load(dataFile)

				channel.send('Try again please!')
			}
		}
	}
})

client.login(token)
