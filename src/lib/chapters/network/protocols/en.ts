import type { ProtocolsText } from './types';

export const en: ProtocolsText = {
	title: 'Network protocols',
	intro: [
		'Two computers can only work together if they agree on how to talk. Who speaks first, what a message looks like, how to say goodbye. That agreement is a <b>protocol</b>, a bit like how every phone call starts with "hello".',
		'Look at the nimbus.com server. One address, but many doors, each with a number on it. That number is the [[port|foundations/port]]. Every protocol knocks on its own door.',
		'Door 80 is <b>HTTP</b>, the protocol that fetches web pages. Your browser knocks, and a page comes back.',
		'Door 443 is <b>HTTPS</b>, the same thing inside a locked envelope. Nobody along the way can read it. Today almost every website lives behind this door.',
		'Door 22 is <b>SSH</b>. It lets you type commands into a computer that sits far away, safely, as if you were sitting in front of it.',
		'Door 53 is <b>DNS</b>, the address book from [[DNS|networking/dns]]. Before your laptop can visit nimbus.com at all, it asks here which address that name belongs to.',
		'[ingat] Four doors are enough to start. 80 web, 443 safe web, 22 SSH, 53 DNS. SSH has two S, its door has two 2s.',
		'[fyi] There are many more. Email is sent with <b>SMTP</b> and read with <b>IMAP</b>, files move with <b>SFTP</b>. The S always means the conversation is encrypted. Underneath, all of them ride on the same TCP and IP from [[Layers and packets|networking/layers]].',
		'That is a protocol, a door with a name and a number. Tap any door if you want to knock on it yourself.'
	],
	reactions: {
		http: 'Door 80, plain HTTP. The page arrives, but anyone on the path could read it. That is why browsers warn you about it now.',
		https:
			'Door 443, HTTPS. Same page, locked envelope. This is the door you knock on most days without noticing.',
		ssh: 'Door 22, SSH. Behind it waits a terminal, so you can run commands on the server from your own laptop.',
		dns: 'Door 53, DNS. You asked for nimbus.com and got back 203.0.113.10. Every visit starts with a knock like this.'
	},
	steps: [
		{
			title: 'Protocol',
			body: 'An agreed way of talking. Who speaks first, what a message looks like, and how to say goodbye.'
		},
		{
			title: 'One address, many doors',
			body: 'Each numbered door is a <b>port</b>. Every protocol has its usual door, so the server knows what you want.'
		},
		{
			tag: 'Port 80',
			title: 'HTTP',
			body: 'Fetches web pages. It is plain text, so anyone on the way could read it.'
		},
		{
			tag: 'Port 443',
			title: 'HTTPS',
			body: 'The same web pages, but encrypted. The S stands for secure.'
		},
		{
			tag: 'Port 22',
			title: 'SSH',
			body: 'Secure Shell. Type commands into a faraway computer as if you sat right in front of it.'
		},
		{
			tag: 'Port 53',
			title: 'DNS',
			body: 'Turns a name like nimbus.com into an address like 203.0.113.10.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Four doors to know',
			body: '<b>80</b> web, <b>443</b> safe web, <b>22</b> SSH, <b>53</b> DNS.'
		},
		{
			title: 'Many more',
			body: '<b>SMTP</b> sends email, <b>IMAP</b> reads it, <b>SFTP</b> moves files. An S usually means encrypted.'
		},
		{
			title: 'Knock on a door',
			body: 'Tap a door and the packet walks over to knock on it.'
		}
	],
	laptopLabel: 'Your laptop',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	doors: [
		{ name: 'HTTP', use: 'web' },
		{ name: 'HTTPS', use: 'safe web' },
		{ name: 'SSH', use: 'remote terminal' },
		{ name: 'DNS', use: 'address book' }
	],
	knockHint: 'Tap a door',
	doorAria: 'Knock on door {port}, {name}'
};
