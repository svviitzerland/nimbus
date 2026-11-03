import type { NetworkText } from '../types';

export const en: NetworkText = {
	title: 'Private networks and subnets',
	intro: [
		'Your cloud servers live inside a <b>VPC</b>, a private network of your own. Picture a fenced house where you decide the rooms and the doors.',
		'The rooms inside are called <b>subnets</b>. The one facing the street is the <b>public subnet</b>, its door opens to the internet, and this is where the web server greets visitors.',
		'The one at the back is the <b>private subnet</b>, with no door to the street at all. The database lives here, and only the web server may talk to it from inside.',
		'[fyi] In an office that runs its own servers (on premise), the same idea is built from real boxes. Rooms are split with subnets and a [[VLAN|network/vlan]] on the switch, and the fence is a firewall on a router like [[MikroTik|netlab/router-intro]]. The difference is that in the cloud it is all virtual and set up from a screen, while in an office you buy the gear and plug in the cables yourself.',
		'The fenced house is standing, both rooms in place. Send a visitor through the front door, then poke at the database straight from the internet and see how far you get.'
	],
	reactions: {
		web: 'The visitor came through the front door, was served by the web server in the public subnet, and the web server fetched the data from the database in the back. The guest never touched the database.',
		blocked:
			'Flatly rejected. The private subnet has no door to the internet, so a snoop cannot touch your database even knowing its address. That is why you separate the rooms.'
	},
	vpcLabel: 'VPC',
	vpcSub: 'your private network',
	internetLabel: 'Internet',
	publicLabel: 'Public subnet',
	publicSub: 'its door faces the internet',
	privateLabel: 'Private subnet',
	privateSub: 'no door out',
	webLabel: 'Web server',
	dbLabel: 'Database',
	visitSite: 'Visit the site',
	attackDb: 'Poke the database from outside',
	noteIdle: 'Two rooms, only one has a door',
	noteWeb: 'Guests served up front, data fetched from the back',
	noteBlocked: 'No door, no way in'
};
