import type { ExperimentText } from '../../types';
export const en: ExperimentText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope:
		'Local URL and redirect model, with no network fetching. Production defenses also need DNS, IPv6, special addresses, size limits, and timeouts.',
	title: 'SSRF',
	intro: [
		'Nimbus has an image preview feature. A visitor supplies a URL and the <b>server</b> fetches the image. Convenient, but the server may reach places a public visitor cannot.',
		'<b>SSRF</b>, server side request forgery, occurs when user input causes unintended server requests. Targets can include internal services or addresses local to the server itself.',
		'Try 127.0.0.1 in this lab. It is <b>loopback</b>, the machine sending the request. Because the sender is the Nimbus server, it points to that server, not the visitor’s laptop.',
		'Restrict allowed destinations. Checking only the first URL is insufficient in this example. An allowed starting address redirects the server to an internal service.',
		'Choose validation at every destination and try the redirect again. Real applications need to check schemes, hosts, resolved IPs, and redirects, alongside restrictions on server egress.',
		'[ingat] <b>CSRF directs a browser; SSRF directs a server.</b> A trust boundary changes when visitor input drives actions behind the scenes.'
	],
	reactions: {
		internal:
			'The server retrieved its local admin page and returned it through the preview feature. Visitor input crossed into a restricted destination.',
		redirect:
			'The first URL passed, but the next hop points to loopback. A one time check missed the final destination.',
		blocked:
			'The internal destination was rejected before fetching it. Now try the public image to verify intended preview behavior.',
		image:
			'The public image loaded. A useful protection restricts destinations while preserving legitimate functionality.'
	},
	goal: 'Constrain the image fetcher’s journey',
	tasks: [
		'Observe internal access',
		'Try the redirect bypass',
		'Validate every destination',
		'Test the public image'
	],
	hint: 'Fetch the internal target without restrictions. Try the redirect with first URL checking. Validate every destination, retry, then fetch the public image.',
	labels: {
		fetch: 'Fetch preview',
		target: 'Visitor supplied URL',
		guard: 'Destination checks',
		image: 'Public Nimbus image',
		internal: 'Internal loopback service',
		redirect: 'Nimbus URL with an internal redirect',
		none: 'No restrictions',
		first: 'Check the first URL only',
		every: 'Check every destination',
		server: 'Server image fetcher',
		access: 'The server sends requests based on visitor input.',
		trace: 'Server request trace',
		waiting: 'No fetch yet',
		blocked: '403, internal destination blocked before access',
		leaked: '200, internal admin page leaked through preview',
		rendered: '200, public image displayed'
	}
};
