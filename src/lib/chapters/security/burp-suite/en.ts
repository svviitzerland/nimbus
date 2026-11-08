import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Burp Suite',
	intro: [
		'Browsers usually send [[HTTP|web/http]] without showing the messages. <b>Burp Suite</b> helps security testers inspect and test them on authorized applications.',
		'In Burp, open <b>Proxy</b>, then <b>Open browser</b>. Its built in browser is configured to use Burp. Inspecting HTTPS requires the test browser to trust the proxy certificate.',
		'Enable <b>Intercept</b> and open a product. The request pauses at the inspection point. The browser waits because the server has not received the request yet.',
		'<b>Forward</b> releases the request. <b>Repeater</b> keeps a copy you can edit and resend. Change /products/1 to /products/2.',
		'Compare the product name and price in the response. A changed path requests a different item. In real testing, record the request, response, and conditions that changed the result.',
		'[ingat] <b>Proxy observes the journey. Repeater repeats the experiment.</b> Change one thing so the cause stays clear.'
	],
	reactions: {
		captured: 'The request is held in Proxy, before the simulated server reads it.',
		forwarded: 'The request arrived. The server returned product 1. Send a copy to Repeater.',
		changed:
			'The product and price changed after editing the path. You compared two experiments with one change.',
		same: 'This still requests the same product. Change the final number in the path to 2 to compare.',
		invalid:
			'Read the status and body. This model supports GET /products/1 or /products/2 with Host nimbus.com.'
	},
	labLabel: 'Your experiment',
	goal: 'Follow a request to its response',
	tasks: ['Capture a request', 'Forward it', 'Edit and resend'],
	hintLabel: 'Hint',
	hint: 'Open the product, Forward it, then send it to Repeater. Edit only the path and press Send.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		open: 'Open product in browser',
		intercept: 'Intercept on',
		tool: 'Burp tools',
		forwarded: 'Request forwarded',
		held: 'Request held, browser waiting',
		empty: 'Open a product to capture a request',
		forward: 'Forward',
		repeat: 'Send to Repeater',
		request: 'Editable request',
		edit: 'Change /products/1 to /products/2, then send.',
		send: 'Send',
		response: 'Server response',
		waiting: 'No response yet'
	}
};
