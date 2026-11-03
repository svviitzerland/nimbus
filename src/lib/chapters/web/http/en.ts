import type { HttpText } from './types';

export const en: HttpText = {
	title: 'What is HTTP',
	intro: [
		'Every time you open <b>nimbus.com</b>, your browser and the [[server|foundations/server]] have a tiny conversation. The browser asks, the server answers. That conversation always follows the same manners, called <b>HTTP</b>.',
		'HTTP is short for HyperText Transfer Protocol. A <b>protocol</b> is simply an agreed way of talking, like how every phone call starts with hello. Both sides know the rules, so they always understand each other.',
		'Each question the browser asks is a <b>request</b>, and it opens with a <b>method</b>, a verb saying what you want. <b>GET</b> means please give me this, used for reading a page. <b>POST</b> means please take this, used for sending things like a comment or a login.',
		'After the method comes the <b>path</b>, which page you want, like <b>/about</b>. Then come the <b>headers</b>, little notes written on the envelope, such as which site you mean (Host) and what kind of answer you can read (Accept).',
		'The server replies with a <b>response</b>, and the very first thing in it is a <b>status code</b>, a three digit number. 200 means all good, 404 means that page does not exist, and 500 means the server itself tripped over something.',
		'[fyi] The first digit tells the whole story. 2xx is success, 3xx is go look somewhere else, 4xx means the request asked for something wrong (your side), and 5xx means the server broke (their side). An [[API|foundations/api]] speaks this exact same HTTP, it just answers with data instead of pages.',
		'[fyi] Plain HTTP travels as readable text, so anyone along the way could peek at it. The S in <b>HTTPS</b> wraps the whole conversation in encryption. More on that in [[SSL and TLS|security/tls]].',
		'Your turn! Pick a method and a path, send the request to nimbus.com, and read what comes back. Try to collect all four kinds of answers.'
	],
	reactions: {
		ok: 'A <b>200 OK</b>. The server found the page and sent it back. Read the response from the top, the status line first, then headers like <b>Content-Type</b> telling the browser this is HTML, then the page itself.',
		list: 'GET on <b>/messages</b> brings back data, not a page. Content-Type says <b>application/json</b>, a tidy format that apps read easily. If you posted something earlier, spot it in the list.',
		created:
			'<b>201 Created</b>. With POST, your message rode inside the request <b>body</b> and the server stored it. Now switch back to GET on /messages and see it sitting there.',
		notfound:
			'<b>404 Not Found</b>. The server is perfectly fine, it just has no page at /pricing. A code starting with 4 means the request asked for something that is not there.',
		notallowed:
			'<b>405 Method Not Allowed</b>. That page exists, but it only accepts reading. You cannot POST onto it, so the server politely says no, and its <b>Allow</b> header tells you what does work.',
		broken:
			'<b>500 Internal Server Error</b>. Your request was fine this time. The code behind /report crashed on the server, so a 5 at the front means their side, not yours.',
		done: 'All four answers collected! Method, path, headers, status code, that is HTTP. Your browser does this dozens of times for every page you open, quietly, in a blink.'
	},
	missionsLabel: 'Collect four answers',
	missions: {
		read: 'Read a page and get a 200',
		send: 'Send a message with POST',
		missing: 'Ask for a page that does not exist',
		broken: 'Catch the server tripping up'
	},
	methodLabel: 'Method',
	pathLabel: 'Path',
	bodyLabel: 'Your message',
	bodyDefault: 'Hi Nim!',
	pathHints: {
		'/': 'the home page',
		'/about': 'about Nimbus',
		'/messages': 'the guestbook',
		'/pricing': 'a pricing page, maybe',
		'/report': 'the monthly report'
	},
	send: 'Send request',
	sending: 'On its way',
	youLabel: 'Your browser',
	serverLabel: 'nimbus.com',
	requestLabel: 'Request',
	responseLabel: 'Response',
	waiting: 'Nothing back yet',
	screen: {
		home: 'Welcome to Nimbus',
		about: 'About Nimbus',
		aboutText: 'A cloud that teaches tech.',
		messages: 'Guestbook',
		created: 'Message sent',
		notFound: 'Page not found',
		broken: 'Something broke',
		notAllowed: 'Not allowed here'
	},
	statusNotes: {
		ok: 'Starts with 2, so it worked',
		client: 'Starts with 4, so the request asked for something wrong',
		server: 'Starts with 5, so the server broke'
	},
	allDone: 'All four answers collected, nice'
};
