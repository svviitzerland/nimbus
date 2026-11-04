import type { HardeningText } from './types';

export const en: HardeningText = {
	title: 'Server Hardening',
	intro: [
		'You just rented a brand new server for nimbus.com. Straight out of the box it is like a new house where the builder left every door open and the spare key under the doormat.',
		'And you will not be alone for long. Within minutes of going online, <b>bots</b> start knocking. Bots are little programs that roam the whole internet trying every door they find, day and night.',
		'Those doors are called <b>ports</b>. A port is a numbered door where a program waits for visitors, like 443 for the website or 22 for logging in from afar. A <b>scanner</b> walks past every door and reports which ones answer. Right now the score is bad.',
		'Step one, update. In 2017 the credit bureau Equifax lost the personal data of about 147 million people through a hole in Apache Struts, software running on its web server. The fix had been out for two months. Nobody installed it.',
		'Step two, close every door you do not need. Old file sharing, Telnet, the database, a forgotten test page. Watch them shut one by one, and watch the scanner score climb.',
		'Step three, lock the doors you keep. The admin door (SSH) now opens only with a <b>key file</b> kept on your laptop, not a password a bot could guess. And nobody logs in as root, the user who is allowed to do everything.',
		'One door stays open on purpose, the website door your visitors use. Hardening is not locking everything, it is making sure the only way in is the one you watch.',
		'[fyi] Hardening is not only for servers. Your phone nagging you to update is hardening too. In the cloud the provider hardens the building and the machines, but the server you rent is yours to harden, that is [[shared responsibility|networking/shared-responsibility]].',
		'[ingat] Not using it? Close it. Using it? Lock it. Either way, keep it updated.',
		'Want to see why this matters? Open the Telnet door again and watch what the bots and the scanner do.'
	],
	reactions: {
		reopen:
			'Seconds later the bots are already at it, and the score drops. One forgotten door undoes a lot of good work.',
		reclose: 'Shut again. The bots bounce off and wander away to find an easier server.'
	},
	steps: [
		{
			title: 'A fresh server',
			body: 'Out of the box, lots of programs are switched on and listening, each one behind its own <b>open door</b>.'
		},
		{
			title: 'Bots knocking',
			body: 'Automated programs sweep the whole internet nonstop. A new server is usually found within <b>minutes</b>.'
		},
		{
			title: 'Ports and scanners',
			body: 'A <b>port</b> is a numbered door a program listens on. A <b>scanner</b> lists which doors answer, the very same tool attackers run.'
		},
		{
			title: 'Update first',
			body: 'An <b>update</b> (also called a patch) fixes holes the makers already know about. Old software is the easiest door of all.'
		},
		{
			title: 'Close what you do not need',
			body: 'Switch off programs nobody uses. A closed port gives a bot <b>nothing</b> to talk to.'
		},
		{
			title: 'Lock what you keep',
			body: 'Log in with a <b>key</b> instead of a password, and give every program only the power it truly needs.'
		},
		{
			title: 'One watched door',
			body: 'The website door stays open on purpose. Fewer doors means fewer places to keep an eye on.'
		},
		{
			tag: 'By the way',
			title: 'Hardening everywhere',
			body: 'Phone updates and screen locks are hardening too. In the cloud, your rented server is <b>yours</b> to harden.'
		},
		{
			tag: 'Make it stick',
			title: 'Close, lock, update',
			body: 'Not used, <b>close</b> it. Used, <b>lock</b> it. Always <b>update</b>.'
		},
		{
			tag: 'Your turn',
			title: 'Reopen a door',
			body: 'Open Telnet again, if you like, and watch the bots rush to it while the score falls.'
		}
	],
	serverLabel: 'nimbus.com server',
	botsLabel: 'Bots',
	scoreLabel: 'Scanner score',
	software: 'Apache Struts',
	outdated: 'old',
	patched: 'updated',
	doors: {
		ftp: 'Files',
		ssh: 'Admin',
		telnet: 'Telnet',
		web: 'Website',
		db: 'Database',
		test: 'Test page'
	},
	reopen: 'Open Telnet again',
	reclose: 'Close Telnet'
};
