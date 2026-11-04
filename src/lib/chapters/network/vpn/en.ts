import type { VpnText } from './types';

export const en: VpnText = {
	title: 'What is a VPN',
	intro: [
		'Picture this. You work at nimbus.com, and today you are working from a cafe, a coffee on the table and your laptop open.',
		'You need the payroll page. It lives on a server inside the office, and that server only opens its door to the <b>office network</b> (the computers plugged in at the office itself). From the cafe, you are an outsider.',
		'There is a second problem. The cafe WiFi is shared with strangers, and anyone on it can quietly read what passes by. That is called [[sniffing|security/sniffing]]. Look at what the man at the next table sees.',
		'A <b>VPN</b> (Virtual Private Network) fixes both problems. Your laptop builds a <b>tunnel</b>, a private road from you straight to the office, laid right through the cafe WiFi and the internet.',
		'Everything you send is [[encrypted|networking/encryption]] before it goes in, scrambled with a secret key only you and the office share. The stranger still sees something pass, but it is only noise to him.',
		'At the office end the tunnel opens and your request steps out, already inside. The server thinks a colleague is sitting at a desk, so the door opens.',
		'[ingat] A VPN is two things, a <b>tunnel</b> and a <b>lock</b>. The tunnel makes you look like you are inside, the lock keeps what you carry unreadable on the way.',
		'[fyi] Same word, different worlds. A company VPN takes you into the office, a VPN app on your phone sends you out through a server in another country, and in the cloud a site to site VPN joins an office to a [[VPC|networking/vpc]]. It is the same idea every time, a locked tunnel into another network.',
		'That is the whole trick. If you like, flip the VPN switch off and on, and watch the stranger and the office door change.'
	],
	reactions: {
		off: 'VPN off. Your request travels in the open again, the stranger reads it, and the office door stays shut.',
		on: 'VPN on. Tunnel up, lock on, the stranger gets noise and the office lets you in.'
	},
	steps: [
		{
			tag: 'You',
			title: 'Working from a cafe',
			body: 'Your laptop joins the cafe WiFi like everyone else there. To the rest of the internet, you are just another guest of that cafe.'
		},
		{
			title: 'The office door',
			body: 'The payroll server checks where each request comes from. From the office network, come in. From anywhere else, the door stays shut.'
		},
		{
			title: 'Out in the open',
			body: 'Without a VPN your request travels as a readable message. Anyone on the same WiFi can catch it and read it.'
		},
		{
			title: 'The tunnel',
			body: 'A VPN app on your laptop connects to a <b>VPN server</b> at the office. From now on everything you send goes through that one connection.'
		},
		{
			title: 'The lock',
			body: 'Before anything enters the tunnel it is encrypted. Outsiders can tell you are sending something, but not what it says.'
		},
		{
			title: 'Coming out inside the office',
			body: 'The VPN server unwraps your request and passes it on from inside the office. To the payroll server, it came from the office network.'
		},
		{
			tag: 'Make it stick',
			title: 'Tunnel plus lock',
			body: 'The <b>tunnel</b> puts you inside the other network. The <b>lock</b> keeps the trip private.'
		}
	],
	cafeLabel: 'Cafe',
	youLabel: 'You',
	officeLabel: 'Office',
	serverLabel: 'Payroll',
	internetLabel: 'Internet',
	tunnelLabel: 'VPN tunnel',
	snooperLabel: 'Stranger on the cafe WiFi',
	peekPlain: 'payroll page, your login',
	peekIdle: 'waiting',
	doorShut: 'outsider',
	doorOpen: 'welcome in',
	vpnLabel: 'VPN',
	onLabel: 'on',
	offLabel: 'off'
};
