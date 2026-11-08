import type { ServerText } from '../../types';

export const en: ServerText = {
	title: 'What are clients and servers?',
	intro: [
		'Every time you open a website, two parties are actually having a chat. One <b>asks</b>, the other <b>serves</b>.',
		'The one asking is called the <b>client</b>. That is your phone or laptop, through the browser you are using right now. Its job is to request a page and paint it onto your screen.',
		'The one serving is called the <b>server</b>. A computer somewhere that stays on 24 hours a day, waiting for requests to arrive and answering them.',
		'Both characters are right here, your phone and a server standing by. Open the website and watch the two of them chat.',
		'[ingat] The browser asks; the server serves. Both are programs running on computers.'
	],
	reactions: {
		served:
			'There it is. The client <b>asked</b> for the page, and the server <b>sent</b> it back. That simple chat happens every time you open any site.'
	},
	you: 'Your browser',
	server: 'Server',
	open: 'Open website',
	request: 'request page',
	response: 'send page',
	count: '{n} requests served'
};
