import type { HttpText } from './types';

export const en: HttpText = {
	title: 'What is HTTP',
	intro: [
		'Every time you open <b>nimbus.com</b>, two computers have a tiny chat. On one side is your <b>browser</b>, the app you use to visit websites. On the other side is the [[server|foundations/server]], the computer that keeps the site.',
		'They always talk with the same manners, called <b>HTTP</b> (short for HyperText Transfer Protocol). A <b>protocol</b> is just an agreed way of talking, like how every phone call starts with hello, so both sides always understand each other.',
		'The browser speaks first. Its message is a <b>request</b>, and it says which page it wants, like <b>/about</b>. That part is called the <b>path</b>. Watch the little envelope fly over to the server.',
		'Every request opens with a verb called the <b>method</b>. <b>GET</b> means please give me this, used for reading a page. <b>POST</b> means please take this, used for sending something, like a comment or a login.',
		'The server reads the request, finds the page, and sends a <b>response</b> back. The browser opens it and shows you the page. That whole round trip usually takes less than a blink.',
		'Right at the top of every response sits a <b>status code</b>, a three digit number saying how it went. 200 means all good, 301 means the page moved, 404 means it does not exist, and 500 means the server tripped over something.',
		"[ingat] You only need the first digit. <b>2 is fine, 3 is go elsewhere, 4 is your mistake, 5 is the server's mistake.</b> Say it once out loud and it sticks.",
		'[fyi] Plain HTTP travels as readable text, so anyone along the way could peek inside. The S in <b>HTTPS</b> locks the envelope with encryption, more on that in [[SSL and TLS|security/tls]]. An [[API|foundations/api]] speaks this same HTTP too, it just answers with data instead of pages.',
		'Want to send one yourself? Pick a page and watch which status code comes back. Or just sit back and enjoy the chat, that works too.'
	],
	reactions: {
		ok: '<b>200 OK</b>. The server found /about and sent it right back. A 2 at the front means everything went fine.',
		moved:
			'<b>301 Moved</b>. The old blog lives at a new address now, so the server tells the browser where to go instead. A 3 at the front means go look elsewhere, and the browser follows it by itself.',
		notfound:
			'<b>404 Not Found</b>. The server is perfectly healthy, it just has no page called /pricing. A 4 at the front means the request asked for something wrong, so the mistake is on the asking side.',
		broken:
			'<b>500 Internal Server Error</b>. Your request was fine this time, but the code behind /report crashed on the server. A 5 at the front means their side broke, not yours.'
	},
	steps: [
		{
			tag: 'Two sides',
			title: 'Browser and server',
			body: 'The <b>browser</b> on your laptop asks. The <b>server</b> keeps the site and answers. Every page you ever opened came from a chat like this.'
		},
		{
			tag: 'The rules',
			title: 'HTTP',
			body: 'One shared set of manners, so any browser in the world can talk to any server in the world.'
		},
		{
			tag: 'Asking',
			title: 'Request',
			body: 'A small message from the browser. It names the page it wants, like <b>/about</b>.'
		},
		{
			tag: 'The verb',
			title: 'Method',
			body: '<b>GET</b> reads something, <b>POST</b> sends something. Most pages you open are a quiet GET.'
		},
		{
			tag: 'Answering',
			title: 'Response',
			body: 'The reply from the server. It carries a status code first, and then the page itself.'
		},
		{
			tag: 'How it went',
			title: 'Status code',
			body: 'Three digits on top of every response. The first digit tells you the whole story.'
		},
		{
			tag: 'Make it stick',
			title: 'Read the first digit',
			body: "<b>2</b> fine, <b>3</b> go elsewhere, <b>4</b> your mistake, <b>5</b> the server's mistake."
		},
		{
			tag: 'Locked',
			title: 'HTTPS',
			body: 'The same chat, sealed shut. People along the way can see an envelope pass, but not what is inside.'
		},
		{
			tag: 'Optional',
			title: 'Send your own',
			body: 'Tap a page to request it. Each one comes back with a different first digit.'
		}
	],
	youLabel: 'Your browser',
	serverLabel: 'nimbus.com server',
	screen: {
		loading: 'Waiting for an answer',
		results: {
			ok: { title: 'About Nimbus', text: 'A cloud that teaches tech.' },
			moved: { title: 'This page moved', text: 'Following it to the new address.' },
			notfound: { title: 'Page not found', text: 'Nothing lives at this path.' },
			broken: { title: 'Something broke', text: 'The server tripped, not you.' }
		}
	},
	legend: ['2 fine', '3 go elsewhere', '4 your mistake', "5 server's mistake"],
	pagesLabel: 'Ask for a page'
};
