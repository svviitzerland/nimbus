import type { IdsText } from './types';

export const en: IdsText = {
	title: 'IDS and IPS',
	intro: [
		'Your [[firewall|networking/firewall]] checks every guest by who they are and which door they want. But what if a guest is on the list and carries something nasty in their bag?',
		'An <b>IDS</b> (Intrusion Detection System) looks inside the bag. It reads every request going past, compares it with known attack patterns and with what normal traffic usually looks like, then raises an alarm when something smells off.',
		'An <b>IPS</b> (Intrusion Prevention System) does the same, but it can also stop the request on the spot. Think of an IDS as a security camera, and an IPS as a guard who can shut the door.',
		'The hard part is tuning. Too strict, and real visitors get blocked (a <b>false positive</b>). Too relaxed, and attacks slip past (a <b>false negative</b>). Every security team wrestles with this balance.',
		'[fyi] The idea is older than the web. In 1987 the researcher Dorothy Denning described spotting intruders by behavior that does not look normal, and in 1998 Martin Roesch released <b>Snort</b>, a free IDS still in use today. In the cloud you can simply rent one as a ready made service.',
		'Ten requests are about to reach nimbus.com, and three of them are attacks. Set how strict the guard is, pick a mode, and let the traffic in.'
	],
	reactions: {
		ids: 'The alarm rang for the attacks, but look, they still reached the server. An IDS only watches and tells someone. Switch to IPS so the guard can actually block.',
		strict:
			'Too strict. The attacks were stopped, but so were real visitors who did nothing wrong. Picture a customer who cannot even open the shop because the guard did not like their face. Loosen it a little.',
		loose:
			'Too relaxed. Some attacks walked right past the guard and hit the server. Make the guard a bit stricter.',
		perfect:
			'Perfect balance. All three attacks were blocked and every real visitor got in, even the visitor from a new country and the very fast shopper, odd but harmless. A flood of millions of requests ([[DDoS|security/ddos]]) is a different beast though, that needs a much bigger wall.'
	},
	youLabel: 'Visitors',
	guardLabel: 'Guard',
	serverLabel: 'nimbus.com',
	modeIds: 'IDS, alarm only',
	modeIps: 'IPS, alarm and block',
	strictLabel: 'How strict',
	strictLow: 'relaxed',
	strictHigh: 'strict',
	runBtn: 'Let the traffic in',
	runAgain: 'Run it again',
	packets: {
		home: 'Opens the homepage',
		products: 'Browses the products',
		login: 'Typed the password wrong once',
		sqli: 'Tries to trick the database (SQL injection)',
		cart: 'Adds something to the cart',
		abroad: 'A real visitor from a new country',
		traversal: 'Tries to sneak out a system file',
		fast: 'A very fast shopper, 30 searches in a minute',
		portscan: 'Knocks on a thousand ports looking for a way in',
		blog: 'Reads the blog'
	},
	scoreLabel: 'suspicion',
	tagPass: 'in',
	tagAlert: 'alarm, still in',
	tagBlock: 'blocked',
	attackTag: 'attack',
	resultAttacks: '{n} of {total} attacks stopped',
	resultVisitors: '{n} real visitors blocked',
	hintIdle: 'Every request gets a suspicion score, anything past the line gets flagged'
};
