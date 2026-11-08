import type { ExperimentText } from '../../types';
export const en: ExperimentText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope: 'Local model with teaching data. No requests reach a real network.',
	title: 'MITM',
	intro: [
		'<b>MITM</b> means man in the middle, also called an <b>on path attacker</b>. The attacker sits on the communication route. That position alone does not let them read HTTPS.',
		'Try HTTP first. The intermediary can read the message and replace the response in this model. Sniffing observes traffic; an active intermediary can also change it.',
		'Enable HTTPS. The browser checks the server identity through a certificate and its trust chain. The lab CA is not trusted, so the browser stops before sending the application request.',
		'A <b>CA</b>, certificate authority, helps establish identity through certificates. If a browser deliberately trusts a testing proxy’s CA, that proxy can terminate TLS and make a second TLS connection to the server.',
		'Trust the lab CA in this simulation. HTTPS is still used, but the proxy can now read messages. That is why a [[Burp|security/burp-suite]] proxy certificate belongs in a testing environment you control.',
		'[ingat] <b>Encryption protects messages; certificate verification checks who receives them.</b> Do not ignore certificate warnings on real sites.'
	],
	reactions: {
		plain:
			'The message is readable and the page changes in transit. The server sends a price of 25; the intermediary replaces it with 250.',
		blocked:
			'The browser does not trust this certificate issuer. The product request was never sent, so the impostor did not receive its contents.',
		trusted:
			'You changed the lab browser’s trust boundary. The proxy is now a trusted TLS endpoint and can read and modify messages.',
		safe: 'The request reaches the server directly. With HTTPS, a party outside the connection endpoints cannot read its contents just by observing traffic.'
	},
	goal: 'Discover when an intermediary can read messages',
	tasks: ['Try HTTP', 'Check the HTTPS certificate', 'Test a lab proxy CA'],
	hint: 'Send using HTTP. Enable HTTPS and send again. After observing rejection, trust the lab CA and repeat.',
	labels: {
		send: 'Request the product page',
		onPath: 'Route through the lab intermediary',
		trust: 'Trust the lab CA in this simulation',
		trustNote: 'This switch only changes the model. It installs no certificate on your device.',
		noCertificate: 'HTTP does not verify a TLS certificate',
		browser: 'Your browser',
		middle: 'Lab intermediary',
		readable: 'Message contents are readable',
		locked: 'Application request is not visible',
		wire: 'What the intermediary sees',
		page: 'Page received by the browser',
		waiting: 'No request yet',
		handshake: 'TLS stopped before HTTP was sent',
		ciphertext: 'HTTP contents protected inside TLS',
		blocked: 'Browser rejects an untrusted certificate',
		changed: 'Nimbus product, 250 coins (changed in transit)',
		original: 'Nimbus product, 25 coins (from the server)'
	}
};
