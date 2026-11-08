import type { WhatDevopsText } from './types';

export const en: WhatDevopsText = {
	title: 'What is DevOps',
	intro: [
		'The development team writes nimbus.com features, while operations keeps the service running. Both need to share information about changes and application behavior.',
		'In this example, changes accumulate before handover to operations. A single release then contains many things to understand, test, and deploy together.',
		'If a release fails, the team needs to identify its cause. More changes in one release create more possibilities to inspect.',
		'<b>DevOps</b> connects development and operations through shared responsibility, automation, and feedback. Small changes and [[CI/CD|compute/cicd]] help teams test and deliver improvements.',
		'[fyi] DevOps started as a way of working, not a tool. The name became popular around 2009, when people started running "DevOpsDays" conferences. Today "DevOps engineer" is also a job title, but the idea behind it is still the same, one team, small steps.',
		'[ingat] <b>Small changes, fast feedback.</b> Test, release, monitor, and improve together. DevOps includes collaboration and process, rather than a particular tool.',
		'Each simulated release includes a bug to compare how much code needs inspection. Try yearly and daily releases, then compare the size of each change.'
	],
	reactions: {
		yearly:
			'This release contains many changes. Inspection takes longer in the simulation because more parts could be the cause.',
		middle: 'There are fewer changes and fewer parts to inspect. Compare this with daily releases.',
		daily:
			'This release contains one change. In this example, the team identifies and reverses it sooner. Real timing depends on the system and recovery preparation.',
		both: 'Change size affects testing and troubleshooting. Release frequency needs support from automation, monitoring, and recovery capabilities.'
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
	findLabel: 'Simulated investigation time',
	finds: ['2 days', '1 day', '6 hours', '1 hour', '5 minutes'],
	shipBtn: 'Ship this release',
	againBtn: 'Ship again',
	downTag: 'down',
	backTag: 'fixed',
	noteIdle: 'Pick a rhythm, then ship the box',
	noteBig: 'There are {n} changes to inspect. Exercise estimate {t}.',
	noteSmall: 'One change to inspect. Simulated time 5 minutes.'
};
