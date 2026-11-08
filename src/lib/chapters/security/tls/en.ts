import type { TlsText } from './types';

export const en: TlsText = {
	title: 'SSL, TLS, and certificates',
	intro: [
		'Look at the address bar when you open nimbus.com. That little padlock means your connection is protected. But how do your browser and a server it has never met agree on a secret, while the whole internet can listen in?',
		'The story starts in the mid 1990s at <b>Netscape</b>, the company behind the most popular browser of that time. People wanted to shop online, but card numbers travelled in plain sight. Netscape built <b>SSL</b> (Secure Sockets Layer) and released SSL 2.0 in 1995, then SSL 3.0 a year later.',
		'SSL had holes. In 1999 the group that writes internet standards (the IETF) took it over, fixed it, and gave it a new name, <b>TLS</b> (Transport Layer Security). Today we use TLS 1.2 and TLS 1.3 (from 2018), and every version of SSL has been retired as unsafe.',
		'[fyi] People still say "SSL certificate" out of habit, but the engine doing the work today is TLS. And <b>HTTPS</b> is simply HTTP, the language of the web, travelling inside a TLS tunnel.',
		'TLS reuses what you already know. [[Asymmetric keys|security/keys]] let the two sides meet safely, then one shared symmetric key does the fast [[encryption|networking/encryption]] of the actual data.',
		'There is a catch, though. How do you know the server really is nimbus.com and not an impostor? That is the job of a <b>certificate</b>, a digital ID card saying "this public key belongs to nimbus.com", signed by a <b>Certificate Authority</b> (CA) your browser already trusts.',
		"For years certificates cost money and were fiddly to set up, so lots of small sites skipped HTTPS. In 2015 a nonprofit launched <b>Let's Encrypt</b>, which hands out certificates for free and renews them automatically. Since then encrypted pages went from under half of the web to the vast majority.",
		'[ingat] TLS verifies the server’s identity through its certificate and uses session keys to protect data during the connection.',
		'Let us watch it happen. First, step through the handshake between your phone and nimbus.com. Then open nimbus.com on a shady café WiFi and see what your browser does.'
	],
	reactions: {
		hello:
			'Your browser opens with a hello. It lists the ways of locking it understands, and sends half of a key recipe (a key share). Anyone can see this part, and that is fine.',
		cert: 'nimbus.com answers with its own key share and its certificate. Think of the certificate as an ID card, with the name, an expiry date, the public key, and the stamp of whoever issued it.',
		check:
			'Your browser checks the ID card carefully. Right name, not expired, stamped by a CA it trusts, and the server proves it holds the matching private key by signing the handshake. All four pass.',
		key: "Here is the clever bit. Each side mixes its own secret with the other side's key share, and both land on the very same session key. The key itself never travelled the wire, so the listeners have nothing to copy.",
		secure:
			'Handshake done, and the padlock lights up. From here every byte is scrambled with the session key. The whole dance took only a few dozen milliseconds, faster than a blink.',
		warn: 'Your browser stopped you. The site claims to be nimbus.com, but its certificate is stamped by itself, not by a CA the browser trusts. Anyone can print their own ID card, that proves nothing.',
		back: 'Smart move. That is exactly what the warning is for. On a café WiFi, someone in the middle can pretend to be any site, but they cannot get a trusted CA to sign a certificate for a name they do not own.',
		proceed:
			'Ouch. You clicked past the warning, so your password went straight to the impostor, who can now pass it along to the real nimbus.com and read everything in between. Nearly every warning like this is worth heeding.'
	},
	acts: ['Handshake', 'Fake site'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	youLabel: 'Your phone',
	serverLabel: 'nimbus.com',
	stepBtn: 'Next handshake step',
	steps: [
		{
			chip: 'hello',
			title: 'Starting the connection',
			body: 'Your browser lists what it understands and sends a key share'
		},
		{
			chip: 'certificate',
			title: 'Certificate',
			body: 'The server sends its key share and its ID card'
		},
		{
			chip: '',
			title: 'Verifying the certificate',
			body: 'Your browser checks the certificate'
		},
		{
			chip: '',
			title: 'Session key',
			body: 'Both sides compute the same key without sending it'
		},
		{
			chip: 'finished',
			title: 'Encrypted connection',
			body: 'Everything after this is encrypted'
		}
	],
	checks: [
		'The name is nimbus.com',
		'Not expired',
		'Stamped by a trusted CA',
		'Server holds the private key'
	],
	cert: {
		heading: 'Certificate',
		subjectLabel: 'Issued to',
		issuerLabel: 'Issued by',
		validLabel: 'Valid until',
		keyLabel: 'Public key',
		subject: 'nimbus.com',
		issuer: "Let's Encrypt",
		valid: '30 January 2027',
		keyValue: '04 8f 3a c1 9e 27 …'
	},
	sessionKey: 'session key',
	secretMsg: 'k9#Qz!f2…',
	wifiLabel: 'Free café WiFi',
	attackerLabel: 'Impostor on the WiFi',
	visitBtn: 'Open nimbus.com',
	addr: 'nimbus.com',
	warn: {
		title: 'Your connection is not private',
		body: 'Someone might be trying to steal your password or messages on this site. The certificate is not trusted.',
		back: 'Back to safety',
		proceed: 'Proceed anyway',
		details: 'What the site showed'
	},
	fakeIssuer: 'nimbus.com (itself)',
	fakeValid: '30 January 2027',
	fakeChecks: ['matches', 'fine', 'signed by itself', 'matches its own fake card'],
	stolen: 'Your password was sent to the impostor',
	safe: 'Nothing was sent, you are safe',
	again: 'Try the fake site again'
};
