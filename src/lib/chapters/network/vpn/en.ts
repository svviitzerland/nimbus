import type { VpnText } from './types';

export const en: VpnText = {
	title: 'What is a VPN',
	intro: [
		'Picture this. You work at nimbus.com, and today you are working from a cafe. You need the payroll page that sits on a server inside the office.',
		'That server only opens its door to the <b>office network</b>, the computers plugged in at the office itself. From the cafe you come in from the outside, so the door stays shut.',
		'There is another problem. The cafe WiFi is shared with strangers, and anyone on it can quietly read what passes by if it is not locked. That is called [[sniffing|security/sniffing]].',
		'A <b>VPN</b> (Virtual Private Network) solves both. Your laptop builds a <b>tunnel</b> to the office, and everything you send gets [[encrypted|networking/encryption]] before it goes in, then unwrapped at the office end.',
		'To the office server it looks like you are sitting at your desk, because your request comes out of the tunnel from inside the office. To the snooper at the cafe it is just scrambled noise.',
		'[fyi] Same word, different worlds. A company VPN takes you into the office, a VPN app on your phone sends you out through a server in another country, and in the cloud a site to site VPN joins the office to a [[VPC|networking/vpc]]. It is the same idea every time, an encrypted tunnel into another network.',
		'[ingat] A VPN creates a virtual connection over another network. In an encrypted VPN, tunnel data is protected while crossing that connection.',
		'You are at the cafe now. Try opening the office server without a VPN first, then switch the VPN on and try again. Keep an eye on the snooper.'
	],
	reactions: {
		blocked:
			'Turned away. The office saw a stranger from the cafe, not a colleague. And look at the snooper, he read the whole request, page name and all.',
		on: 'The tunnel is up. Your laptop and the office agreed on a secret key, so from now on everything you send travels inside, locked.',
		through:
			'You are in. The office saw an address from inside its own network, so the door opened. Meanwhile the snooper only caught noise, he knows you sent something but not what.',
		off: 'VPN off. Your requests travel in the open again, straight through the cafe WiFi.'
	},
	vpnLabel: 'VPN',
	onLabel: 'on',
	offLabel: 'off',
	openBtn: 'Open the office server',
	youLabel: 'You',
	youSub: 'at the cafe',
	officeLabel: 'Office server',
	officeSub: 'office network only',
	cafeWifi: 'cafe WiFi and the internet',
	tunnelLabel: 'encrypted tunnel',
	snooperLabel: 'Snooper on the cafe WiFi',
	snooperIdle: 'Waiting for something to pass by',
	seenAsLabel: 'The office sees you as',
	seenCafe: 'a guest from the cafe',
	seenOffice: 'someone inside the office',
	blockedTag: 'not from the office',
	okTag: 'welcome in',
	noteIdle: 'No VPN yet, your request will travel in the open',
	noteOn: 'The tunnel is ready, try opening the server again',
	noteBlocked: 'The office refused, and the snooper read everything',
	noteOk: 'Through the tunnel, into the office'
};
