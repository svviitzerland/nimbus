import type { WhatDevopsText } from './types';

export const en: WhatDevopsText = {
	title: 'What is DevOps',
	intro: [
		'Long ago, the people who make an app were split into two teams. <b>Developers</b> (Dev) wrote new features on their laptops. <b>Operations</b> (Ops) kept the [[servers|foundations/server]] running. Between them stood a tall wall.',
		'Developers worked for months and piled every change into one huge box. Then they threw it over the wall, and Ops had to install it without knowing what was inside.',
		'Of course something broke. Dev said it worked on their laptop, Ops said the code was broken. Release day became scary, so teams released less often, and every box got even bigger.',
		'<b>DevOps</b> knocks that wall down. The name simply glues the two words together, because Dev and Ops become one team that builds, ships and looks after the app together.',
		'The trick is to ship <b>small changes, often</b>. Machines do the boring part, testing and delivering every little box by themselves, like the [[CI/CD pipeline|compute/cicd]] you already met.',
		'Small boxes still break sometimes. But when a box holds just one change, you know right away what went wrong. Pull it back, fix it, send it again, all within a few minutes.',
		'[ingat] <b>Small and often beats big and rare.</b> A tiny box is easy to check and easy to take back. A giant box hides its bug like a needle in a haystack.',
		'[fyi] DevOps began as a way of working, not a tool you install. The name caught on around 2009, when people started running DevOpsDays meetups. Today DevOps engineer is also a job title, but the idea is still the same, one team, small steps.',
		'Want to compare? Flip between the old way and the DevOps way and watch how the boxes travel. Or just keep watching, that works too.'
	],
	reactions: {
		old: 'The old way again. One giant box flies over the wall, the servers go red, and everybody starts pointing fingers. Finding one bug among hundreds of changes can take days.',
		new: 'Back to DevOps. One team, small boxes rolling out all the time, and when something breaks, there is only one change to suspect.'
	},
	steps: [
		{
			tag: 'Two teams',
			title: 'Dev and Ops',
			body: 'The <b>developers</b> build new features. <b>Operations</b> keeps the servers alive. Back then they barely talked to each other.'
		},
		{
			tag: 'The old release',
			title: 'One giant box',
			body: 'Months of changes shipped in a single go. Ops receives a box they have never seen before.'
		},
		{
			tag: 'Release day',
			title: 'Pointing fingers',
			body: 'With hundreds of changes inside, nobody knows which one broke the site. So the next release waits even longer.'
		},
		{
			tag: 'The idea',
			title: 'DevOps',
			body: 'Dev plus Ops, one team. The people who write the code also help run it, so nothing gets thrown over a wall.'
		},
		{
			tag: 'The habit',
			title: 'Small and often',
			body: 'Each box carries one small change. A pipeline tests it and delivers it by itself, many times a week or even a day.'
		},
		{
			tag: 'When it breaks',
			title: 'One suspect',
			body: 'Only one change went out, so the cause is obvious. It is pulled back and fixed in minutes, not days.'
		},
		{
			tag: 'Make it stick',
			title: 'Small beats big',
			body: '<b>Small and often</b> beats <b>big and rare</b>. Look at the year below, lots of tiny boxes instead of one giant one.'
		},
		{
			tag: 'History',
			title: 'A way of working',
			body: 'DevOps is about people first. The tools (pipelines, automation, monitoring) come after the team decides to work as one.'
		},
		{
			tag: 'Optional',
			title: 'Compare both',
			body: 'Flip between the two ways of working and watch the boxes.'
		}
	],
	devLabel: 'Dev',
	opsLabel: 'Ops',
	oneTeam: 'One team',
	blameDev: 'It worked on my laptop',
	blameOps: 'Your code broke it',
	bigBox: '200 changes',
	oneChange: 'Only 1 change to check',
	fixed: 'Fixed and live',
	yearLabel: 'One year of releases',
	modeLabel: 'Pick a way of working',
	oldBtn: 'The old way',
	newBtn: 'The DevOps way'
};
