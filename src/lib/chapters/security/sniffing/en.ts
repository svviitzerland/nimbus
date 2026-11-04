import type { SniffingText } from './types';

export const en: SniffingText = {
	title: 'Sniffing and MITM',
	intro: [
		'You sit down in a café, order a coffee, and join the free WiFi. Handy! But that WiFi is one shared room. Your laptop, the stranger at the next table, and everyone else talk through the same air.',
		'Radio waves do not care who they are meant for. Anyone nearby with a free app can quietly record every little packet of data flying past. That is called <b>sniffing</b>, like a dog sniffing every smell in the room.',
		'Watch Sari log in to nimbus.com over plain <b>HTTP</b>. Her login travels like a postcard, so the snooper reads the name and the password exactly as she typed them.',
		'Now the same login over <b>HTTPS</b>. Everything is scrambled before it leaves the laptop, like a sealed envelope. The snooper still records it, but only gets noise. How that lock is built lives in [[SSL and TLS|security/tls]].',
		"A sneakier snooper does not just listen. They start a fake hotspot with a name like the café's, so everything passes through <b>their</b> laptop first. That is a <b>man in the middle</b> attack. HTTPS still holds, the browser checks who is really answering and warns you if it is not nimbus.com.",
		'[ingat] <b>No padlock, no password.</b> Before you type anything secret, look for the little lock next to the address. No lock, no typing.',
		'[fyi] Same tool, different world. Network engineers record traffic on purpose to fix problems, with tools like [[Wireshark|network/wireshark]]. The tool is the same, what matters is whose network it is. On public WiFi a [[VPN|network/vpn]] adds one more lock on top.',
		'Want to see it again? Switch between HTTP and HTTPS and watch what the snooper gets. Or just enjoy your coffee, that works too.'
	],
	reactions: {
		http: 'Postcard mode. The snooper reads <b>sari</b> and <b>kopi123</b> in plain text. Anyone on this WiFi with a free app could do the same.',
		https:
			'Envelope mode. The snooper can tell Sari visited nimbus.com, but every word inside is scrambled noise. That is HTTPS doing its job.'
	},
	steps: [
		{
			tag: 'The café',
			title: 'Shared WiFi',
			body: 'Public WiFi is one <b>shared room</b>. Everyone in the café talks through the same box and the same air.'
		},
		{
			tag: 'Listening',
			title: 'Sniffing',
			body: 'Quietly <b>recording</b> the packets that fly past. It needs no break in, only being nearby.'
		},
		{
			tag: 'Postcard',
			title: 'Plain HTTP',
			body: 'Data travels as <b>readable text</b>. Whoever records it can read the password word for word.'
		},
		{
			tag: 'Envelope',
			title: 'HTTPS',
			body: 'Data is <b>scrambled</b> before it leaves. Only nimbus.com has the key to open it again.'
		},
		{
			tag: 'In the middle',
			title: 'Man in the middle',
			body: 'A fake hotspot puts the snooper <b>on the path</b>. HTTPS still holds, and the browser warns if someone pretends to be nimbus.com.'
		},
		{
			tag: 'Make it stick',
			title: 'No padlock, no password',
			body: 'Look for the <b>lock</b> next to the address before typing anything secret.'
		},
		{
			tag: 'Side note',
			title: 'Same tool, other hands',
			body: 'Engineers record traffic on <b>their own</b> network to fix problems. Permission makes the difference.'
		},
		{
			tag: 'Optional',
			title: 'Try both',
			body: "Flip between HTTP and HTTPS and look at the snooper's screen."
		}
	],
	youLabel: "Sari's laptop",
	routerLabel: 'Café WiFi',
	serverLabel: 'nimbus.com',
	snooperLabel: 'Snooper at the next table',
	twinLabel: 'Fake hotspot',
	engineerLabel: 'Engineer, own network',
	notSecure: 'Not secure',
	loginBtn: 'Log in',
	snoop: {
		title: 'Captured',
		waiting: 'Waiting',
		recording: 'Recording packets',
		readable: 'readable',
		noise: 'scrambled'
	},
	rule: 'No padlock, no password',
	pickLabel: 'Send the login over',
	modes: { http: 'HTTP', https: 'HTTPS' }
};
