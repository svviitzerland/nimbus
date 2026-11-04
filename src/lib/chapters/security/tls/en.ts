import type { TlsText } from './types';

export const en: TlsText = {
	title: 'SSL and TLS',
	intro: [
		'Look at the address bar when you open nimbus.com. That little padlock means your connection is private. But your laptop and a server it has never met have to agree on a secret, while the whole internet can listen in. How?',
		'The story starts in 1995 at <b>Netscape</b>, the most popular browser back then. People wanted to shop online, but card numbers travelled in plain sight, so Netscape built <b>SSL</b>. It had holes, so in 1999 it was fixed and renamed <b>TLS</b>. Today we use TLS 1.3, from 2018.',
		'[fyi] People still say "SSL certificate" out of habit, but the engine doing the work today is TLS. And <b>HTTPS</b> is simply the [[HTTP|web/http]] you know, travelling inside a TLS tunnel.',
		'Every TLS connection opens with a short <b>handshake</b>, a few quick messages before any real data flows. First your browser says hello, and lists the ways of locking it understands.',
		'nimbus.com answers with its <b>certificate</b>, a digital ID card. It says "this public key belongs to nimbus.com", and it is signed by a <b>Certificate Authority</b> (CA), a company your browser already trusts.',
		'Your browser checks the ID card carefully. Is the name really nimbus.com? Is it signed by a CA it trusts? Has it expired? Only if all three pass does the handshake go on.',
		'Now the clever part. Using the public key from that card (the open padlock from [[asymmetric keys|security/keys]]), both sides end up with the same fresh <b>session key</b>. Anyone listening sees the messages fly by but cannot work the key out.',
		'From here on, every byte is scrambled with that one shared session key, the fast symmetric kind. The padlock lights up. All of this took a few hundredths of a second.',
		'[ingat] <b>Meet with a padlock, talk with a shared key.</b> The certificate and its public key are for meeting safely, the session key is for the fast chat after.',
		'Now you are on a shady café WiFi. Someone in the middle pretends to be nimbus.com and hands over a fake ID card, signed by himself. Watch the browser check it, and stop you with a warning.',
		'That warning is TLS doing its job, so when you see one, turn back. If you like, switch between home and café WiFi and watch the handshake play out both ways.'
	],
	reactions: {
		home: 'Home WiFi. The real nimbus.com shows a real ID card, all three checks pass, and the padlock lights up.',
		cafe: 'Café WiFi again. The impostor can print his own ID card, but no trusted CA will sign it for a name he does not own, so the check fails.'
	},
	steps: [
		{
			tag: 'The question',
			title: 'The little padlock',
			body: 'It means nobody between you and the site can read or change what you send, not the WiFi owner, not your provider.'
		},
		{
			tag: '1995 to 2018',
			title: 'From SSL to TLS',
			body: 'Same idea, safer versions. Every SSL version is retired now, <b>TLS 1.2</b> and <b>TLS 1.3</b> do the work.'
		},
		{
			tag: 'Same word',
			title: 'HTTPS',
			body: 'HTTP inside a TLS tunnel. The letters inside stay the same, the tunnel just hides them.'
		},
		{
			tag: 'Step 1',
			title: 'Hello',
			body: 'The browser opens the conversation and lists what it understands. Nothing secret yet.'
		},
		{
			tag: 'Step 2',
			title: 'Certificate',
			body: "A digital ID card with the site name, an expiry date, and the public key, signed by a CA. Many sites get theirs free from <b>Let's Encrypt</b>."
		},
		{
			tag: 'Step 3',
			title: 'Check',
			body: '<b>Right name</b>, <b>trusted signer</b>, <b>not expired</b>. One failure and the browser stops.'
		},
		{
			tag: 'Step 4',
			title: 'Session key',
			body: 'A brand new shared key for this one visit. The public key helps make it, and it never travels in readable form.'
		},
		{
			tag: 'Step 5',
			title: 'Secure',
			body: 'Everything after the handshake is scrambled with the session key, both ways.'
		},
		{
			tag: 'Remember it',
			title: 'Padlock, then key',
			body: 'Asymmetric to <b>meet</b>, symmetric to <b>talk</b>. Slow and safe first, then fast.'
		},
		{
			tag: 'Impostor',
			title: 'A fake certificate',
			body: 'Anyone can make an ID card, but only a trusted CA can sign one for nimbus.com. A self signed card fails the check.'
		},
		{
			tag: 'Optional',
			title: 'Home or café',
			body: 'Switch the WiFi and watch the same handshake end with a padlock or a warning.'
		}
	],
	youLabel: 'Your laptop',
	serverLabel: 'nimbus.com',
	attackerLabel: 'Impostor',
	chips: { hello: 'hello', cert: 'ID', key: 'key' },
	certHeading: 'Certificate',
	checks: ['name nimbus.com', 'trusted signer', 'not expired'],
	sessionKey: 'session key',
	warnTitle: 'Not private',
	warnBody: 'Someone may be faking nimbus.com',
	history: [
		{ name: 'SSL 2', year: '1995' },
		{ name: 'SSL 3', year: '1996' },
		{ name: 'TLS 1.0', year: '1999' },
		{ name: 'TLS 1.3', year: '2018' }
	],
	wifi: { label: 'Connect through', home: 'Home WiFi', cafe: 'Shady café WiFi' }
};
