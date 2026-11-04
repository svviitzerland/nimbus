import type { ReleaseText } from './types';

export const en: ReleaseText = {
	title: 'Release strategies',
	intro: [
		'Version 2 of nimbus.com passed every test in the [[CI/CD pipeline|compute/cicd]]. Still, some bugs only show up with real people, on real phones, with real data. Tests cannot catch everything.',
		'The plain way is to switch everyone to v2 at once. If v2 has a hidden bug, <b>every</b> user sees the error at the same moment, and undoing it takes a while.',
		'A <b>canary release</b> is gentler. The [[load balancer|traffic/load-balancer]] (the traffic splitter in the middle) sends v2 to just a few users first, here one user in ten. Everyone else stays on v1.',
		'Then you watch. The one canary user hits the bug, and the errors jump on v2 only. That is the warning sign.',
		'So that user goes straight back to v1. Nine out of ten never noticed a thing. The team fixes the bug and gets version 2.1 ready.',
		'The fixed version starts small again. If it stays healthy, the slice grows step by step, one in ten, then a few more, then half, then everyone.',
		'[ingat] The name comes from coal mines. Miners carried a <b>canary</b> underground, because the little bird felt poison gas before people did. <b>Send the little bird in first</b>, a few users, then everyone.',
		'[fyi] Another way is <b>blue green</b>. You keep two identical setups, blue runs the old version and green runs the new one, and the load balancer flips everyone across in one go. If something looks wrong, it flips straight back.',
		'Want to compare? Release the buggy v2 to everyone at once, or as a canary, and count how many users get hurt.'
	],
	reactions: {
		bigbang:
			'Ouch, all ten users hit the error at the same moment. The bug was found, but everyone paid for it, and rolling back took a while.',
		canary:
			'Only one user in ten saw the error, and they were back on v1 within seconds. The other nine never knew anything happened.'
	},
	steps: [
		{
			tag: 'The situation',
			title: 'A new version',
			body: 'Ten users (the phones) are happy on <b>v1</b>. Version 2 waits on the right, with a bug nobody has found yet.'
		},
		{
			tag: 'All at once',
			title: 'Everyone gets hurt',
			body: 'All ten phones switch to v2 together, so all ten see the error. Then everyone has to be moved back.'
		},
		{
			tag: 'The idea',
			title: 'Canary release',
			body: 'Only <b>one phone in ten</b> goes to v2. The other nine keep using v1 as if nothing happened.'
		},
		{
			tag: 'Watching',
			title: 'The warning sign',
			body: 'Errors show up on v2 only. One user is affected, and now the team knows something is wrong.'
		},
		{
			tag: 'Undo',
			title: 'Back to safety',
			body: 'That one user goes back to v1 in seconds. The bug gets fixed, and <b>v2.1</b> is ready.'
		},
		{
			tag: 'Growing',
			title: 'Step by step',
			body: '1 in 10, then 3, then 5, then all 10. Each step waits to see that errors stay at zero.'
		},
		{
			tag: 'Make it stick',
			title: 'The little bird',
			body: 'A few users first, then everyone. The canary warns you before the whole mine is in trouble.'
		},
		{
			tag: 'Another way',
			title: 'Blue green',
			body: 'Two identical setups, and a switch that moves everyone between them at once, and back again just as fast.'
		},
		{
			tag: 'Optional',
			title: 'Compare both',
			body: 'Release the buggy v2 one way or the other, and count the red phones.'
		}
	],
	lbLabel: 'Load balancer',
	usersLabel: 'Ten users',
	errors: '{n} of 10 users see an error',
	allOk: 'Nobody sees an error',
	rule: 'A few users first, then everyone',
	pickLabel: 'Release the buggy v2',
	bigbangBtn: 'To everyone at once',
	canaryBtn: 'As a canary'
};
