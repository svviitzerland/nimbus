import type { HttpText } from './types';

export const en: HttpText = {
	title: 'What is HTTP',
	intro: [
		'Open <b>nimbus.com</b> and the browser asks a [[server|foundations/server]] for data. <b>HTTP</b> defines how those messages are exchanged.',
		'The outgoing message is a <b>request</b>. <b>GET</b> requests data. <b>POST</b> submits data for processing, such as a new guestbook message.',
		'The <b>path</b> selects a resource such as /about. <b>Headers</b> carry metadata. The <b>body</b> carries content, such as your message.',
		'The server sends a <b>response</b>, starting with a status such as 200 OK or 404 Not Found. Inspect the raw message below as well as the visible page.',
		'POST to /messages, then GET the same path. The simulated server stores your message and includes it in the next response.',
		'[ingat] <b>2 succeeds, 3 redirects, 4 cannot fulfill the request, 5 has a server problem.</b> Read the response body for the specific cause.',
		'[fyi] <b>HTTPS</b> protects HTTP exchanges with [[TLS|security/tls]]. This lab shows HTTP/1.1 text for readability. HTTP/2 and HTTP/3 use different wire formats.',
		'Collect four responses. After reading and submitting, try a missing page and a report with a server failure.'
	],
	reactions: {
		ok: 'A <b>200 OK</b>. The server found the page and sent it back. Read the response from the top, the status line first, then headers like <b>Content-Type</b> telling the browser this is HTML, then the page itself.',
		list: 'GET on <b>/messages</b> brings back data, not a page. Content-Type says <b>application/json</b>, a tidy format that apps read easily. If you posted something earlier, spot it in the list.',
		created:
			'<b>201 Created</b>. With POST, your message rode inside the request <b>body</b> and the server stored it. Now switch back to GET on /messages and see it sitting there.',
		notfound:
			'404. The server cannot find /pricing. It may be a wrong path or a removed page, so check the address.',
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
		client: 'Starts with 4, the request cannot be fulfilled',
		server: 'Starts with 5, so the server broke'
	},
	allDone: 'Four HTTP responses inspected'
};
