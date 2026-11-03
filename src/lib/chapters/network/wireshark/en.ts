import type { WiresharkText } from './types';

export const en: WiresharkText = {
	title: 'What is Wireshark',
	intro: [
		'Every time you open a page, dozens of packets fly in and out of your laptop. You never see them, the browser hides all of that and just shows you the page.',
		'<b>Wireshark</b> is a free app that lets you see them. It listens on your network card and records every packet that passes, this is called a <b>capture</b>. Network engineers use it when they need to see what really happened, not what they think happened.',
		'Remember the [[layers and packets|networking/layers]]? Each packet is a parcel wrapped in layers. Wireshark unwraps it for you, one layer per line, from the signal at the bottom to the message at the top.',
		'[fyi] You have a tiny version of this already. Open the Developer Tools in your browser and look at the Network tab, it lists every request a page makes. Wireshark goes deeper, down to every single packet.',
		'Let us capture you opening nimbus.com. Start the capture, then tap the packets to open them up. Try a DNS one, a TCP one, and the encrypted data at the end.'
	],
	reactions: {
		capture:
			'Nine packets just to open one page, and this is the short version. Colours group them by kind. Tap any row to unwrap it layer by layer.',
		dns: 'This one asks the router for the address of nimbus.com. It rides on UDP to door 53, with no lock at all, so anyone on your network could see which site you are about to visit.',
		tcp: 'This is the TCP handshake, SYN, then SYN ACK, then ACK. Your laptop and the server say hello three times before any real data moves. Look at layer 4, door 443 is the secure web door.',
		hello:
			'The TLS hello. Your laptop and nimbus.com agree on a secret key here. The name nimbus.com is still visible, but from the next packet on, everything gets locked.',
		data: 'Encrypted. Wireshark can still read the outer layers, who sent it, where to, which door, but the page itself is noise. That is [[HTTPS|security/tls]] protecting you, even from tools like this one.'
	},
	captureBtn: 'Start capture',
	againBtn: 'Capture again',
	capturing: 'Capturing on WiFi',
	captured: '{n} packets captured',
	filterLabel: 'Show',
	filterAll: 'All',
	colNo: 'No.',
	colProto: 'Protocol',
	colInfo: 'Info',
	idleHint: 'Nothing captured yet',
	pickHint: 'Tap a packet to unwrap its layers',
	layerLabel: 'Layer {n}',
	layerNames: { 1: 'Physical', 2: 'Data Link', 3: 'Network', 4: 'Transport', 7: 'Application' },
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
