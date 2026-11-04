import type { LabPickText } from './types';

export const en: LabPickText = {
	title: 'Pick your lab gear',
	intro: [
		'Welcome to the lab. Here you do not just read about routers, you actually run one, terminal and all, for the small nimbus office.',
		'Lots of brands make routers, and the two you will meet most at work are <b>MikroTik</b> and <b>Cisco</b>. The ideas are exactly the same, IP, DHCP, NAT, firewalls, only the command language differs.',
		'[fyi] MikroTik is everywhere in ISPs, internet cafes, and neighbourhood networks because it is cheap but powerful. Cisco rules offices and big companies, and its certification, CCNA, is one of the most wanted for network jobs.',
		'[ingat] Different brand, same ideas. IP, DHCP, NAT, and firewalls live on every router, only the way you type them changes. So whatever you learn on one brand still works on the other.',
		'Pick one to go deep in first. No worries, the other stays in the menu, and you can switch any time and try both.'
	],
	reactions: {
		mikrotik:
			'MikroTik it is! You will type into the <b>RouterOS</b> terminal, from naming the router all the way to a hotspot with vouchers. Carry on when you are ready.',
		cisco:
			'Cisco it is! You will type into <b>Cisco IOS</b>, moving through enable and configure modes, all the way to locking the router down with SSH. It is the same footing as the start of CCNA. Carry on when you are ready.'
	},
	hint: 'Tap one of the devices',
	pickedTag: 'your pick',
	note: 'Want to try the other one? Open the menu, its lab is always there.',
	options: {
		mikrotik: {
			name: 'MikroTik',
			os: 'RouterOS',
			points: [
				'A favourite of ISPs and neighbourhood networks',
				'Run it from Winbox or the terminal',
				'Hotspots and bandwidth sharing built in'
			]
		},
		cisco: {
			name: 'Cisco',
			os: 'Cisco IOS',
			points: [
				'King of office and company networks',
				'The footing for the CCNA certification',
				'VLANs, ACLs, and SSH'
			]
		}
	}
};
