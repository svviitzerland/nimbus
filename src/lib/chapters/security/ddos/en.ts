import type { DdosText } from './types';

export const en: DdosText = {
	title: 'What is DDoS',
	intro: [
		'Think of nimbus.com as a small shop with a few cashiers. The server behind it has only so much computing power and so much internet cable, so it can serve only so many visitors each second. Right now everyone gets in smoothly.',
		'Now one troublemaker starts sending request after request, like a fake customer asking silly questions and never leaving. That is a <b>denial of service</b> attack, DoS for short. Nothing gets stolen, the goal is simply to keep everyone else out. One sender is easy though, you just block that one address.',
		'So attackers bring a crowd. Thousands of hacked devices (computers, cameras, home routers) all flood the same site at once. That crowd is a <b>botnet</b>, and the attack is a <b>distributed</b> denial of service, or <b>DDoS</b>. The server drowns, and real visitors cannot reach it.',
		'In October 2016 a botnet called <b>Mirai</b>, built mostly from cameras and routers still using their factory passwords, flooded a company named Dyn that helps the internet find websites. For hours many people in the US and Europe could not open Twitter, Netflix, or Reddit.',
		'Defenders fight back. First a <b>rate limit</b>, each address only gets so many requests per second, and the rest are turned away at the door. It helps, but a huge botnet has so many addresses that plenty still get through.',
		'The big shield is a [[CDN|traffic/cdn]], hundreds of servers spread around the world standing in front of yours. The flood splashes against them far away, while real visitors pass through. nimbus.com stays open.',
		'[ingat] <b>DDoS is not a thief, it is a crowd blocking the door.</b> Nothing is taken. The fix is a bigger doorway far away (a CDN) and a polite bouncer (a rate limit).',
		'[fyi] In 2018 GitHub was hit by a flood of 1.35 terabits per second, one of the biggest ever seen at the time. With help from a DDoS protection service it was back up in about ten minutes.',
		'Want to feel the difference? Switch the shield off and on and watch the flood. Everything here is pretend, no real site is harmed.'
	],
	reactions: {
		shieldOff:
			'Shield down. The whole botnet hits nimbus.com directly, the server chokes, and almost no real visitor gets in.',
		shieldOn:
			'Shield up. The flood crashes into the CDN far away, the rate limit turns the rest back, and real visitors stroll right in.'
	},
	steps: [
		{
			tag: 'Normal day',
			title: 'A small shop',
			body: 'A server can answer only so many <b>requests</b> each second. On a normal day that is plenty.'
		},
		{
			tag: 'One sender',
			title: 'DoS',
			body: 'One machine floods the site so others <b>cannot get in</b>. Blocking that one address stops it.'
		},
		{
			tag: 'A crowd',
			title: 'DDoS and botnets',
			body: 'Thousands of <b>hijacked devices</b> flood at once. There is no single address to block.'
		},
		{
			tag: 'October 2016',
			title: 'Mirai',
			body: 'Cameras and routers with <b>factory passwords</b> became a botnet that knocked big sites offline for hours.'
		},
		{
			tag: 'Defense',
			title: 'Rate limit',
			body: 'Each address gets only a few requests per second. It <b>slows</b> the flood, but cannot stop a huge one alone.'
		},
		{
			tag: 'Defense',
			title: 'CDN shield',
			body: 'Many servers worldwide <b>soak up</b> the flood far from yours, and let real visitors through.'
		},
		{
			tag: 'Make it stick',
			title: 'A crowd at the door',
			body: 'DDoS takes nothing, it <b>blocks the door</b>. Widen the doorway and add a bouncer.'
		},
		{
			tag: 'Side note',
			title: 'GitHub, 2018',
			body: 'A record flood at the time, and back up in about <b>ten minutes</b> thanks to a protection service.'
		},
		{
			tag: 'Optional',
			title: 'Shield on, shield off',
			body: 'Flip the switch and watch how many real visitors get in.'
		}
	],
	visitorsLabel: 'Real visitors',
	attackerLabel: 'One troublemaker',
	botsLabel: 'Botnet',
	serverLabel: 'nimbus.com',
	rateLabel: 'Rate limit',
	cdnLabel: 'CDN',
	states: { up: 'Open', slow: 'Struggling', down: 'Down' },
	served: '{n}% of real visitors get in',
	stamp: 'October 2016',
	rule: 'A crowd at the door, not a thief',
	pickLabel: 'The shield',
	modes: { off: 'Off', on: 'On' }
};
