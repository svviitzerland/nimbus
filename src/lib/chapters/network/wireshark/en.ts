import type { WiresharkText } from './types';

export const en: WiresharkText = {
	title: 'What is Wireshark',
	intro: [
		'Every time you open a page, dozens of tiny packets fly in and out of your laptop. You never see them, the browser hides all of that and just shows you the page.',
		'<b>Wireshark</b> is a free app that lets you see them. It listens on your network card and writes down every packet that passes. That recording is called a <b>capture</b>. Watch the list fill up as nimbus.com loads.',
		'Pick one packet and Wireshark unwraps it, like a parcel inside a parcel. Outside is the WiFi frame (laptop to router), inside that the IP packet (which address), then the port (which door), and in the middle the real content. These wrappings are the [[layers|networking/layers]].',
		'Now look at the last packets, the page itself. The outer wrappings are still readable, but the content is locked. That is [[HTTPS|security/tls]] doing its job, even against a tool like this one.',
		'[ingat] Wireshark is a traffic camera on the road. Every car gets recorded and every number plate is readable, but a locked trunk stays locked.',
		'[fyi] You already have a tiny version of this. Open the Developer Tools in your browser and look at the Network tab, it lists every request a page makes. Wireshark goes deeper, down to every single packet.',
		'If you are curious, tap any row in the capture to unwrap it.'
	],
	reactions: {
		dns: 'A DNS packet. Your laptop asks where nimbus.com lives. It travels unlocked, so anyone on your network could see which site you are about to visit.',
		tcp: 'Part of the TCP handshake. Your laptop and the server say hello three times (SYN, SYN ACK, ACK) before any real data moves.',
		hello:
			'The TLS hello. Here the two sides agree on a secret key. The name nimbus.com is still visible, everything after this gets locked.',
		data: 'Application data, locked. Wireshark sees who sent it, where to and through which door, but the page itself is just noise.'
	},
	steps: [
		{
			title: 'Invisible traffic',
			body: 'Loading one page takes many small packets going back and forth. The browser only shows you the result.'
		},
		{
			tag: 'Capture',
			title: 'Writing down every packet',
			body: 'Wireshark lists each packet with a number, a protocol and a short summary. Colours group them by kind.'
		},
		{
			title: 'A parcel in a parcel',
			body: 'Each packet is wrapped in layers. Outside goes <b>who to who</b> on your WiFi, then the <b>IP address</b>, then the <b>port</b>, and the content sits in the middle.'
		},
		{
			title: 'Locked content',
			body: 'With HTTPS the middle is encrypted. Wireshark still sees the outside (who talked to whom, and how much), but not the page.'
		},
		{
			tag: 'Remember it',
			title: 'Plates yes, trunk no',
			body: 'Addresses on the outside are always readable. Content inside HTTPS is not.'
		}
	],
	capturing: 'Capturing on WiFi',
	colNo: 'No.',
	colProto: 'Protocol',
	colInfo: 'Info',
	layerNames: { frame: 'WiFi frame', ip: 'IP packet', port: 'Port', content: 'Content' },
	lockedLabel: 'locked',
	packetTitle: 'Packet {n}',
	contents: [
		'Where is nimbus.com?',
		'nimbus.com is at 76.76.21.21',
		'SYN, can we talk?',
		'SYN ACK, sure',
		'ACK, great',
		'Hello, I want nimbus.com',
		'Here is my certificate',
		'',
		''
	],
	packetNotes: [
		'Your laptop asks the router where nimbus.com lives.',
		'The answer comes back, nimbus.com lives at 76.76.21.21.',
		'Handshake, step one. Your laptop knocks on door 443 of the server.',
		'Handshake, step two. The server knocks back.',
		'Handshake, step three. The connection is open.',
		'Your laptop starts the lock, and says which site it wants.',
		'The server answers with its certificate, proof that it really is nimbus.com.',
		'Your request for the page, locked tight.',
		'The page itself coming back, locked tight too.'
	]
};
