import type { DetectionText } from './types';

export const en: DetectionText = {
	title: 'Logs and Detection',
	intro: [
		'In 1986 Cliff Stoll, an astronomer looking after the computers at a lab in Berkeley, California, noticed that two accounting systems disagreed by 75 cents. Just 75 cents.',
		"He did not shrug it off. He dug through the <b>logs</b>, the diaries where computers write down everything that happens, who logged in, when, and from where. The trail led to a hacker in Germany selling secrets to the Soviet KGB. Stoll told the whole story in the book The Cuckoo's Egg.",
		'Today every server keeps logs. [[Monitoring|compute/monitoring]] shows health numbers like CPU, while logs tell the story behind those numbers, line by line. The trouble is, a busy site like nimbus.com writes millions of lines a day.',
		'So you look for <b>patterns</b>. Watch. One address tries the admin login, fails, fails again, fails again, and then gets in. That is a [[brute force|security/brute-force]] attack, a password guessed by sheer repetition.',
		'Teams hand this job to a <b>SIEM</b> (Security Information and Event Management, people say it like "sim"). It collects the logs from every server into one place, connects the dots, and raises an alert for a human to check.',
		'[fyi] Alerts only help if someone reads them. During the 2013 Target breach, its security tools did raise alerts while the attackers were inside, but nobody acted on them in time.',
		'[ingat] One failed login is a typo. A hundred from the same address is an attack.',
		'Your turn, if you like. Tap any line in the log and every line from that same address lights up.'
	],
	reactions: {
		innocent: 'Just a normal visitor. Some browsing, maybe one typo, nothing that keeps repeating.',
		found:
			'There it is. The same address failing over and over, then getting in. Time to lock that admin account and block the address.'
	},
	steps: [
		{
			title: 'The 75 cents',
			body: 'Two accounting systems disagreed by 75 cents. Tiny, but it meant <b>someone</b> was using the computer without being billed.'
		},
		{
			title: 'Logs',
			body: '<b>Logs</b> are the diaries computers keep. Stoll followed them for about ten months, all the way to Hannover in Germany.'
		},
		{
			title: 'Far too many lines',
			body: 'A busy site writes <b>millions</b> of lines a day. Reading them all by eye is hopeless.'
		},
		{
			title: 'A pattern',
			body: 'Same address, same account, failing again and again, then <b>one success</b>. That shape is a brute force attack.'
		},
		{
			title: 'SIEM',
			body: 'A <b>SIEM</b> pulls logs from every server into one place and raises an <b>alert</b> when a pattern matches.'
		},
		{
			tag: 'By the way',
			title: 'Someone has to look',
			body: 'An alert nobody reads protects nobody. Good teams decide in advance <b>who</b> answers each alert.'
		},
		{
			tag: 'Remember it',
			title: 'Typo or attack',
			body: 'One failure is a <b>typo</b>. Many from one address is an <b>attack</b>.'
		},
		{
			tag: 'Your turn',
			title: 'Follow an address',
			body: 'Tap any line to light up every line from the same address.'
		}
	],
	printTitle: 'Lab accounting, 1986',
	printGap: 'accounts off by $0.75',
	trail: ['Berkeley lab', 'phone lines', 'Hannover, Germany'],
	logTitle: 'nimbus.com logs',
	sources: { web: 'web', shop: 'shop', auth: 'login' },
	alert: 'Alert. Many failed logins, then a success, from {ip}',
	tapHint: 'Tap a line'
};
