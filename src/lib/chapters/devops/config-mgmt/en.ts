import type { ConfigMgmtText } from './types';

export const en: ConfigMgmtText = {
	title: 'Configuration management',
	intro: [
		'nimbus.com is popular now, and it runs on ten servers behind a [[load balancer|traffic/load-balancer]]. Today a new version of the app is out, and every one of those ten servers needs it.',
		'The manual way means logging into each server with [[SSH|cloud/remote-access]], typing the same commands, checking it worked, then moving on to the next one. Ten times. Somewhere along the way you get tired, and a typo slips in.',
		'A <b>configuration management</b> tool does this for you. You write down once what every server should look like (which app version, which settings), and the tool makes all of them match.',
		'A popular one is <b>Ansible</b>. The list of steps lives in a file called a <b>playbook</b>. Ansible logs into all the servers for you, runs the steps on many of them at once, and reports back what changed.',
		'[fyi] The neat part is that a playbook can run again and again safely. If a server already matches, Ansible leaves it alone. And it is not only for cloud servers, network teams use the same tool to set up hundreds of routers and switches in one go.',
		'Ten servers are waiting for the update. Try a couple by hand first, then type the playbook command in the terminal.'
	],
	reactions: {
		manual:
			'One down. Log in, type, check, log out. Five minutes for one server. Now picture a hundred of them.',
		typo: 'Oops, a typo. That server now has a broken config and nobody noticed. This is exactly how servers slowly end up different from each other.',
		playbook:
			'Ansible went through all ten, five at a time, and every server now runs the new version. Even the one with the typo got fixed, because the playbook says exactly how it should look.',
		again:
			'Ran it again, and it says changed=0. Every server already matches the playbook, so Ansible touched nothing. You can run it every day without fear.'
	},
	missionLabel: 'Mission',
	mission: 'Update all 10 servers to nimbus app v2',
	manualBtn: 'SSH into the next server',
	manualDone: 'Every server visited',
	minutesTag: '{n} minutes by hand',
	typoTag: 'typo',
	oldTag: 'v1',
	newTag: 'v2',
	hintLabel: 'Tap to fill in',
	placeholder: 'type a command',
	unknown: 'command not found, {cmd}',
	noteIdle: 'Ten servers, all still on v1',
	noteManual: 'Updated by hand. {n} left to go.',
	noteTypo: 'One server got a typo and is now broken',
	notePlaybook: 'One command, all ten servers on v2',
	noteAgain: 'Already up to date, nothing to change'
};
