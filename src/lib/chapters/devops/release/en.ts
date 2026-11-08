import type { ReleaseText } from './types';

export const en: ReleaseText = {
	title: 'Release strategies',
	intro: [
		'Version 2 of nimbus.com passed every test in the [[CI/CD pipeline|compute/cicd]]. But some bugs only show up with real people, on real phones, with real data. Tests cannot catch everything.',
		'The plain way is to swap every server to v2 at once. If v2 is broken, <b>every</b> user sees the error, and rolling back means redeploying the old version while the site burns.',
		'<b>Blue green</b> keeps two identical environments. Blue runs v1 and serves everyone, green gets v2 and waits. The [[load balancer|traffic/load-balancer]] flips all traffic to green at once, and if something is wrong, flips straight back to blue. Undo takes a second.',
		'<b>Canary</b> sends v2 to a small slice of users first, say 5 percent, and watches the errors. If it looks healthy, the slice grows step by step. If it looks bad, those few go back to v1 and almost nobody noticed.',
		'[fyi] The name comes from coal mines. Miners used to bring a canary underground, because the little bird felt poison gas before the people did. Your first 5 percent of users are that early warning.',
		'[ingat] A canary release sends a new version to a portion of traffic first. Monitor the result before expanding or rolling back.',
		'v2 here has a hidden bug. Try all three ways of releasing it. Watch how many users get hurt, and how fast you can undo it.'
	],
	reactions: {
		bigbang:
			'Every user got the bug at the same moment. That is the problem with all at once, one bad version hits everyone.',
		slowBack:
			'Back on v1, but it took a while to redeploy, and users were staring at errors the whole time.',
		flipped:
			'The load balancer moved everyone to green, and green has the bug. Quick, flip it back.',
		flipBack:
			'Flipped back in a second. Blue was still running v1 the whole time, so undo is just moving the traffic.',
		canary:
			'Only a small slice of users got v2, and you can already see errors in that group. Everyone else is fine.',
		canaryBig:
			'The bigger the slice, the more people hit the bug. A real team grows the canary only while the error count stays at zero.',
		canaryBack:
			'Those few users are back on v1. The bug hurt a handful of people instead of everyone, and now the team can fix it calmly.',
		both: 'Now you know the two favourites. Blue green gives you an instant undo, canary keeps the damage tiny. Many teams even combine them.'
	},
	modes: ['All at once', 'Blue green', 'Canary'],
	usersLabel: '{n} of 20 users see errors',
	allOk: 'All 20 users are happy',
	lbLabel: 'Load balancer',
	blueLabel: 'Blue, v1',
	greenLabel: 'Green, v2',
	liveTag: 'live',
	deployAllBtn: 'Deploy v2 to every server',
	rollbackBtn: 'Roll back to v1',
	rollingBack: 'Redeploying v1...',
	switchToGreen: 'Switch traffic to green',
	switchToBlue: 'Switch back to blue',
	canaryLabel: '{n}% of users on v2',
	canaryBack: 'Send everyone back to v1',
	bugNote: 'v2 has a bug that no test caught'
};
