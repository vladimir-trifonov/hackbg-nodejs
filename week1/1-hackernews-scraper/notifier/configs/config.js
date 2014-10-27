module.exports = {
	port: 8090,
	usersPath: "../subscribers.json",
	confirmedEmailsPath: "../emails.json",
	itemsPath: "../articles.json",
	nodemailer: {
		auth: {
			user: 'node.course.mail@gmail.com',
			pass: 'node.course.mailnode.course.mail'
		},
		defaultOptions: {
			from: 'HackerNews Notifier App <node.course.mail@gmail.com>',
			subject: 'Keywords matches!'
		}
	}
}