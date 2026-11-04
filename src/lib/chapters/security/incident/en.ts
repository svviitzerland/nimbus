import type { IncidentText } from './types';

export const en: IncidentText = {
	title: 'Incident Response',
	intro: [
		"June 2017. At Maersk, the shipping giant that moves about a fifth of the world's sea cargo, screens turned black one after another. A piece of [[malware|security/malware]] called NotPetya was tearing through its network. Maersk ended up rebuilding about 4,000 servers and 45,000 computers.",
		'[fyi] Its rescue came down to luck. The only clean copy of one key server sat in an office in Ghana, offline thanks to a power cut. Staff carried that drive all the way to the UK and rebuilt from it.',
		"When something like this hits, panic is the enemy. Teams follow a plan worked out in calm times, called <b>incident response</b>. Let's walk through it together. It is late at night, and an alarm goes off at nimbus.com.",
		'One, <b>check</b>. Is it real, and how big is it? Look before you jump. Here it is real, one machine is infected.',
		'Two, <b>contain</b>. Stop it spreading, before anything else. Pull that machine off the network so the malware cannot reach its neighbours, like shutting the door on a kitchen fire.',
		'Three, <b>clean</b>. Remove the attacker completely. Often the safest way is to wipe the machine and start fresh, because you can never be sure you found every hiding spot.',
		'Four, <b>recover</b>. Bring the machine back from a clean backup, and plug it in again only once you know it is healthy.',
		'Five, <b>learn</b>. Write down what happened and fix the way they got in, without blaming people. This is the step that makes the next incident smaller.',
		'[ingat] Treat it like a kitchen fire. Shut the door so it stops spreading, put it out, repair the kitchen, then learn why it started. Stop it spreading, clean, recover, learn.',
		'Your turn, if you like. Skip the containing step, start cleaning straight away, and watch what the malware does in the meantime.'
	],
	reactions: {
		skip: 'See that? While you were busy cleaning, it jumped to two neighbours and then came back for the clean machine. That is why containing comes first.',
		right:
			'Contained first, so it had nowhere to go. One machine hurt, one machine fixed, everyone else fine.'
	},
	steps: [
		{
			title: 'NotPetya',
			body: 'Malware that jumped by itself from machine to machine, locking each one for good. It looked like ransomware, but paying could not bring the files back.'
		},
		{
			tag: 'By the way',
			title: 'The copy in Ghana',
			body: 'Malware cannot reach a copy that is <b>offline</b>. A power cut kept that one safe by accident.'
		},
		{
			title: 'Incident response',
			body: 'A plan written <b>before</b> trouble comes, so people follow steps instead of guessing.'
		},
		{
			title: 'Check',
			body: 'Confirm it is real and find out <b>how far</b> it has reached.'
		},
		{
			title: 'Contain',
			body: 'Cut the infected machine off so it <b>stops spreading</b>. Speed matters most right here.'
		},
		{
			title: 'Clean',
			body: 'Remove every trace, often by <b>wiping</b> the machine completely.'
		},
		{
			title: 'Recover',
			body: 'Restore from a <b>clean backup</b>, then reconnect only when it is healthy.'
		},
		{
			title: 'Learn',
			body: 'Write it up without blame, and fix the hole so it cannot happen the <b>same way</b> twice.'
		},
		{
			tag: 'Make it stick',
			title: 'Kitchen fire',
			body: '<b>Stop it spreading</b>, clean, recover, learn.'
		},
		{
			tag: 'Your turn',
			title: 'Skip a step',
			body: 'Clean before containing, and watch the malware use that time.'
		}
	],
	maersk: 'Maersk, June 2017',
	nimbus: 'nimbus.com, late at night',
	ghana: 'Ghana office',
	offline: 'offline',
	backup: 'Backup',
	notes: 'Notes',
	lessons: ['Patch the hole', 'Lock admin logins', 'Test the backups'],
	checkTag: 'Real, one machine',
	phases: {
		check: 'Check',
		contain: 'Contain',
		clean: 'Clean',
		recover: 'Recover',
		learn: 'Learn'
	},
	skip: 'Skip containing',
	right: 'Right order'
};
