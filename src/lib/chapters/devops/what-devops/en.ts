import type { WhatDevopsText } from './types';

export const en: WhatDevopsText = {
	title: 'What is DevOps',
	intro: [
		'A long time ago, software companies were split in two. <b>Developers</b> (Dev) wrote new features. <b>Operations</b> (Ops) kept the servers alive. Between them stood a tall wall.',
		'Developers worked for months, piled every change into one huge box, and threw it over the wall. Ops had to install it on the servers, without knowing what was inside.',
		'Of course something broke. Developers said "it worked on my laptop", Ops said "your code is broken". Both sides were scared of release day, so releases got rarer and rarer, and every box got even bigger.',
		'<b>DevOps</b> knocks down that wall. Dev and Ops become one team that builds, ships, and looks after the app together. The trick is to ship <b>small changes, often</b>, with machines doing the boring work, like the [[CI/CD pipeline|compute/cicd]] you already met.',
		'[fyi] DevOps started as a way of working, not a tool. The name became popular around 2009, when people started running "DevOpsDays" conferences. Today "DevOps engineer" is also a job title, but the idea behind it is still the same, one team, small steps.',
		'Every release here has one sneaky bug hidden inside, just like real life. Slide the rhythm, ship it once a year, then ship it every day, and compare how scary each one feels.'
	],
	reactions: {
		yearly:
			'Ouch. One giant box, hundreds of changes, and somewhere inside is the bug. The site is down while everyone digs through the box looking for the culprit. No wonder people dreaded release day.',
		middle:
			'Smaller box, smaller hunt. See how the pain shrinks as the box shrinks? Try going all the way.',
		daily:
			'One tiny change went out. It broke, but there is only one suspect, so it is undone in minutes. Your users barely notice.',
		both: 'That is the heart of DevOps. The more often you ship, the smaller each release, and the smaller the release, the less scary it is. Big companies ship hundreds of times a day for exactly this reason.'
	},
	everyLabel: 'Release every',
	cadences: ['year', '3 months', 'month', 'week', 'day'],
	devLabel: 'Dev',
	opsLabel: 'Ops',
	oneTeam: 'One team',
	wallLabel: 'the wall',
	changesTag: '{n} changes',
	changesOne: '1 change',
	waitLabel: 'A finished feature waits',
	waits: ['up to a year', 'up to 3 months', 'up to a month', 'up to a week', 'a day at most'],
	findLabel: 'Finding the bug takes',
	finds: ['2 days', '1 day', '6 hours', '1 hour', '5 minutes'],
	shipBtn: 'Ship this release',
	againBtn: 'Ship again',
	downTag: 'down',
	backTag: 'fixed',
	noteIdle: 'Pick a rhythm, then ship the box',
	noteBig: 'The bug hid among {n} changes. Finding it took {t}.',
	noteSmall: 'Only one change to check. Fixed in 5 minutes.'
};
