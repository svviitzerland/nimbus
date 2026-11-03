import type { HardeningText } from './types';

export const en: HardeningText = {
	title: 'Server hardening',
	intro: [
		'You just rented a brand new server for nimbus.com. Straight out of the box, it is like a new house where the builder left every window open and the spare key under the doormat.',
		'And you will not be alone for long. Within minutes of going online, automated bots start knocking on it, trying every door they know, day and night, all over the internet.',
		'<b>Server hardening</b> means closing every door you do not need, so the only way in is the one you watch. Update the software, shut unused <b>ports</b> (the numbered doors a server listens on), log in with keys instead of passwords, and give every program only the power it needs.',
		'Skipping this hurts. In 2017 the credit bureau Equifax lost the data of about 147 million people. The hole was in Apache Struts, software on its web server, and the fix had been public for two months. Nobody installed it.',
		'[fyi] Hardening is not only for servers. Your phone nagging you to update and your laptop lock screen are hardening too. In the cloud, the provider hardens the building and the machines, but the server you rent is yours to harden, that is [[shared responsibility|networking/shared-responsibility]].',
		'Here is your fresh nimbus.com server. Run the scanner to see how many doors are open, then close them one by one, but keep the door your visitors use.'
	],
	reactions: {
		scan: 'Ouch, a score of 10. Six doors are wide open, and bots are already trying them. Tap the red doors to close them, in any order you like.',
		update:
			'Updated. Most attacks use holes that already have a fix, exactly like Equifax. Turning on automatic security updates is the cheapest protection there is.',
		telnet:
			'Telnet is closed. It is a remote login from 1969 that sends everything, passwords included, as plain readable text. SSH replaced it long ago, so nobody needs this door.',
		db: 'The database door is shut to the internet. Now only the web server sitting next to it may talk to it. A [[firewall|networking/firewall]] rule like this is a tiny change that stops a lot of leaks.',
		sshkey:
			'Passwords off, keys on. A bot can guess passwords all day long (that is [[brute force|security/brute-force]]), but it cannot guess a key file that only lives on your laptop.',
		root: 'The web app now runs as its own small user instead of <b>root</b>, the all powerful admin. If it ever gets broken into, the attacker lands in one small room, not the whole house. That is called <b>least privilege</b>.',
		default:
			'The admin panel still had its factory password, admin and admin. Bots try that first, every single time. A long unique password closes the easiest door of all.',
		web: 'Whoa, nimbus.com just went offline. Port 443 is the door your visitors use for HTTPS. Hardening means closing the doors you do not need, not every door. Open it again.',
		done: 'Score 100. Every unneeded door is shut, and the only way in is the front door you actually watch. Real teams rerun scanners like this on a schedule, because new holes show up every week.'
	},
	serverLabel: 'nimbus.com server',
	scanBtn: 'Run the scanner',
	scoreLabel: 'Security score',
	doors: {
		update: {
			name: 'Software from two years ago',
			risk: 'Known holes with public fixes',
			fix: 'Update',
			done: 'Up to date, auto updates on'
		},
		telnet: {
			name: 'Port 23, Telnet',
			risk: 'Old login that sends passwords as plain text',
			fix: 'Close',
			done: 'Closed for good'
		},
		db: {
			name: 'Port 3306, database',
			risk: 'Reachable from the whole internet',
			fix: 'Close',
			done: 'Only the web server can reach it'
		},
		sshkey: {
			name: 'SSH login with a password',
			risk: 'Bots can keep guessing forever',
			fix: 'Use keys',
			done: 'Key login only'
		},
		root: {
			name: 'App runs as root',
			risk: 'One break in hands over everything',
			fix: 'Shrink it',
			done: 'Runs as a small user'
		},
		default: {
			name: 'Admin panel, admin and admin',
			risk: 'The factory password, the first one bots try',
			fix: 'Change',
			done: 'Long unique password'
		}
	},
	web: {
		name: 'Port 443, HTTPS',
		note: 'Your visitors come in here',
		close: 'Close',
		reopen: 'Reopen',
		closedNote: 'Closed, nobody can open nimbus.com'
	},
	openTag: 'open',
	closedTag: 'closed',
	neededTag: 'needed',
	siteUp: 'online',
	siteDown: 'offline',
	hintIdle: 'A fresh server, straight out of the box',
	hintScan: 'Tap a red door to close it',
	hintDone: 'Every unneeded door is closed'
};
