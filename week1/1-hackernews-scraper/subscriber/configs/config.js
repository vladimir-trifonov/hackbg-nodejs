module.exports = {
	port: 8050,
	url: 'localhost',
	nodemailer: {
		auth: {
			user: 'node.course.mail@gmail.com',
			pass: 'node.course.mailnode.course.mail'
		},
		defaultOptions: {
			from: 'HackerNews Subscriber App <node.course.mail@gmail.com>',
			subject: 'Subscription Confirmation E-mail'
		}
	}
}