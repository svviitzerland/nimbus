import type { HatColorsText } from './types';

export const en: HatColorsText = {
	title: 'Types of hackers',
	intro: [
		'In old Western films you could spot the hero by his white hat and the villain by his black one. The computer world borrowed that idea to sort out its hackers.',
		'A <b>hacker</b> is simply someone who knows a system so well they can make it do things nobody planned. The skill itself is neutral, a bit like a locksmith who can open any door.',
		'A <b>white hat</b> works with permission. A company asks them, usually with a signed contract, to break in and report every hole so it can be fixed.',
		'A <b>black hat</b> breaks in without permission, to steal, spy, or blackmail. Same skills, used against the owner.',
		'A <b>gray hat</b> sits in between. No permission, but no bad intent either, like someone who sneaks in and then warns the owner. It may be well meant, yet the law still sees it as breaking in.',
		'A real story. In the 1980s and 90s Kevin Mitnick was the most wanted hacker in America. He was caught in 1995 and spent about five years in prison. Later he ran a security company and got paid to break in, this time with permission. Same skills, the other side of the line.',
		"That line has a name, <b>permission</b>. Most countries put it into law. In Indonesia it is the UU ITE, in the United States the Computer Fraud and Abuse Act. Getting into a system without the owner's permission is a crime even if you take nothing.",
		'[ingat] <b>Permission paints the hat.</b> With permission, white. Without it, black, and good intentions only make it gray.',
		'[fyi] The good news is that companies now invite hackers in. Back in 1995 Netscape paid people for finding bugs in its browser, and today these <b>bug bounty</b> programs pay real money for a careful report. More on that in [[pentesting and bug bounties|security/pentest]].',
		'Want a short story for each hat? Tap one.'
	],
	reactions: {
		white:
			'White hat. The signed contract is the whole difference. It says what Sari may test, when, and how. That job is called a <b>pentest</b> (penetration test).',
		gray: 'Gray hat. Tono meant well, yet he still got in without asking first, so it is not legal. The safe way is to report what you notice without breaking in.',
		black:
			'Black hat, no doubt. Getting in was already uninvited, and asking for money turns it into blackmail.'
	},
	steps: [
		{
			tag: 'Westerns',
			title: 'Hats tell the side',
			body: 'White for the hero, black for the villain. Hackers got sorted the <b>same way</b>.'
		},
		{
			tag: 'The word',
			title: 'Hacker',
			body: 'Someone who knows a system <b>deeply</b>. The skill is neutral, like a locksmith&#39;s.'
		},
		{
			tag: 'White hat',
			title: 'With permission',
			body: 'Breaks in <b>because the owner asked</b>, then reports the holes so they get fixed.'
		},
		{
			tag: 'Black hat',
			title: 'Without permission',
			body: 'Breaks in to <b>steal, spy, or blackmail</b>. The same skills, aimed at the owner.'
		},
		{
			tag: 'Gray hat',
			title: 'In between',
			body: 'No permission, no bad intent. Still <b>breaking in</b> as far as the law cares.'
		},
		{
			tag: 'Kevin Mitnick',
			title: 'Black, then white',
			body: 'Caught in <b>1995</b>, about five years in prison, later paid to test companies <b>with permission</b>.'
		},
		{
			tag: 'The line',
			title: 'Permission',
			body: 'In Indonesia the <b>UU ITE</b> draws it. Getting in without the owner&#39;s yes is a crime, even if nothing is taken.'
		},
		{
			tag: 'Make it stick',
			title: 'Permission paints the hat',
			body: 'Yes from the owner, <b>white</b>. No yes, <b>black</b>. Good intent without a yes, <b>gray</b>.'
		},
		{
			tag: 'Good to know',
			title: 'Bug bounty',
			body: 'Written rules that <b>invite</b> hackers in, and a reward for a careful, private report.'
		},
		{
			tag: 'Optional',
			title: 'Three stories',
			body: 'Tap a hat to hear its story.'
		}
	],
	hats: { white: 'White hat', gray: 'Gray hat', black: 'Black hat' },
	permission: 'permission',
	noPermission: 'no permission',
	news: { tag: 'Kevin Mitnick, 1995', head: 'The most wanted hacker in America is caught' },
	timeline: [
		{ year: '1995', label: 'caught' },
		{ year: '2000', label: 'released' },
		{ year: 'later', label: 'paid to test' }
	],
	bountyLabel: 'bug bounty rules',
	stories: {
		white: {
			who: 'Sari, security consultant',
			story: 'A bank signs a contract with Sari and asks her to try to break into its app.'
		},
		gray: {
			who: 'Tono',
			story:
				'Tono sneaks into his school website without asking, then emails the admin to warn them about the hole.'
		},
		black: {
			who: 'An anonymous email',
			story:
				'Someone breaks into a shop, then demands money or they will publish its customer data.'
		}
	},
	tapHint: 'Tap a hat to hear its story'
};
