import type { ConfigMgmtText } from './types';

export const en: ConfigMgmtText = {
	title: 'Configuration management',
	intro: [
		'nimbus.com is popular now. It runs on six servers behind a [[load balancer|traffic/load-balancer]], and today version 2 of the app is ready. Every one of those six servers needs the update.',
		'The manual way means logging into each server with [[SSH|cloud/remote-access]] (a way to type commands on another computer), typing the same commands, then moving on to the next one. One by one, six times.',
		'Somewhere around the fourth server you get tired, and a typo slips in. Now one server is broken and the rest do not all match. Imagine doing this with a hundred servers.',
		'<b>Configuration management</b> fixes this. You write down once what every server should look like (which app version, which settings), and a tool makes all of them match.',
		'A popular tool is <b>Ansible</b>. Its list of steps lives in a file called a <b>playbook</b>. Ansible logs into all six servers for you, runs the steps on all of them at once, and reports back.',
		'Run it again and nothing breaks. Ansible checks each server first, and if it already matches, it leaves it alone. The report simply says nothing changed.',
		'[ingat] <b>Write once, run everywhere.</b> The playbook is one checklist read out to every server at the same time. Servers that already match just nod and wait.',
		'[fyi] [[Terraform|devops/iac]] creates the servers, Ansible sets up what runs inside them, so teams often use both. Network teams love Ansible too, it can set up hundreds of routers and switches in one go.',
		'Want to try? Tap a server to mess it up by hand, then watch the playbook bring it back in line. Or just keep watching.'
	],
	reactions: {
		drift:
			'Someone changed that server by hand, so it drifted away from the playbook. Ansible ran again, fixed only that one, and left the others alone.'
	},
	steps: [
		{
			tag: 'The job',
			title: 'Six servers, one update',
			body: 'Every server runs <b>v1</b> of the app. All six should end up on <b>v2</b>, set up exactly the same.'
		},
		{
			tag: 'By hand',
			title: 'One at a time',
			body: 'Log in, type the commands, log out, next. The same few lines, typed again and again.'
		},
		{
			tag: 'The problem',
			title: 'A typo slips in',
			body: '<b>nimbus-ap</b> instead of nimbus-app. One letter, and that server is broken while the others moved on.'
		},
		{
			tag: 'The idea',
			title: 'Describe it once',
			body: 'A file that says how every server should look. Here it says install version 2, then restart the app.'
		},
		{
			tag: 'The tool',
			title: 'ansible-playbook',
			body: 'One command. Ansible reaches all six servers at once and runs the same steps on each, typo free.'
		},
		{
			tag: 'Safe to repeat',
			title: 'changed=0',
			body: 'Everything already matches, so nothing is touched. You can run a playbook as often as you like.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Write once, run everywhere',
			body: 'One checklist for every server. The ones that already match just nod.'
		},
		{
			tag: 'Good to know',
			title: 'Terraform and Ansible',
			body: '<b>Terraform</b> builds the machines, <b>Ansible</b> sets up what is inside them.'
		},
		{
			tag: 'Optional',
			title: 'Break one',
			body: 'Tap a server to change it by hand. The playbook runs and brings it back.'
		}
	],
	terminalTab: 'Terminal',
	serversLabel: 'Servers',
	brokenTag: 'broken',
	driftTag: 'edited',
	tapHint: 'Tap a server'
};
