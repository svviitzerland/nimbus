import type { OnCallText } from './types';

export const en: OnCallText = {
	title: 'Incidents and on call',
	intro: [
		'Websites never sleep, so somebody has to be reachable when one breaks at three in the morning. That person is <b>on call</b>. Teams take turns, usually a week each, so nobody carries the phone forever. This week it is you.',
		'At 02.58 the error line on the [[monitoring|compute/monitoring]] chart jumps. Checkout starts failing for most buyers, and an alarm pages whoever is on call. That stretch of broken time is called an <b>incident</b>.',
		'The phone keeps ringing until a human answers. Tapping <b>acknowledge</b> tells the pager you are on it. If nobody answers in five minutes, it wakes the next person on the list.',
		'Nobody thinks clearly half asleep, so teams write a <b>runbook</b> ahead of time, a short recipe for one kind of trouble. Check this, then that, then do this. You follow it, you do not improvise.',
		'Step one, open the error dashboard. Errors jumped from almost nothing to 38 percent at 02.58. Step two, check what changed. A new release, v2.4.1, went out at 02.57, one minute before.',
		'Step three, <b>roll back</b>, which means putting the last good release back. The errors melt away, and step four closes the incident. You do not need to understand the bug at three in the morning, only to stop the bleeding.',
		'[ingat] <b>What changed last is the first suspect.</b> Most incidents start right after a change, a new release, a new setting, a new server. Look there before anywhere else.',
		'In daylight the team writes a <b>post mortem</b>, the story of what happened and what changes next. Good ones are <b>blameless</b>. Watch the line that blames a person get crossed out. People who fear blame hide their mistakes, and hidden mistakes come back.',
		'[fyi] Same word, different world. Security teams run incidents too, for a break in rather than a breakdown, in [[incident response|security/incident]]. And when a whole region goes dark, the plan is [[failover|resilience/failover]].',
		'Curious why the runbook says roll back and not restart? Tap the button and try restarting every server instead. Or just enjoy the quiet night, that works too.'
	],
	reactions: {
		panic:
			'Restarting everything feels like doing something, and the errors even dip for a moment. Then they come straight back, because a restart runs the same broken release again. That is why the runbook says roll back.'
	},
	steps: [
		{
			tag: 'Taking turns',
			title: 'On call',
			body: 'One person each week keeps the phone close, day and night. Next week someone else does.'
		},
		{
			tag: 'Something broke',
			title: 'Incident',
			body: 'The time between things going wrong and things working again. The alarm comes from monitoring, not from a person.'
		},
		{
			tag: 'I am on it',
			title: 'Acknowledge',
			body: 'One tap stops the ringing and tells the team a human is handling it. No answer, and the next person is called.'
		},
		{
			tag: 'The recipe',
			title: 'Runbook',
			body: 'Short steps written in calm daylight, for one kind of trouble, so a sleepy brain does not have to invent anything.'
		},
		{
			tag: 'Look first',
			title: 'Dashboard, then changes',
			body: 'When did it start, and what changed just before? Here, a release one minute earlier.'
		},
		{
			tag: 'Fix fast',
			title: 'Roll back',
			body: 'Put the last good version back. The site heals in minutes, and the real fix waits for morning.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Newest change, first suspect',
			body: 'Something broke? Ask what changed last. It is the right answer more often than not.'
		},
		{
			tag: 'Afterwards',
			title: 'Blameless post mortem',
			body: 'Ask what let the mistake through, never who made it. Then add a safety net so it cannot happen twice.'
		},
		{
			tag: 'Not the same',
			title: 'Other kinds of incident',
			body: 'A break in is a security incident. A whole region going dark calls for failover.'
		},
		{
			tag: 'Optional',
			title: 'Restart instead?',
			body: 'Try the tempting shortcut and watch the error line.'
		}
	],
	onCallNote: 'On call this week',
	pagerApp: 'Pager',
	alertTitle: 'Errors at 38%',
	alertBody: 'nimbus.com checkout',
	ackBtn: 'Acknowledge',
	ackedTag: 'Acked',
	resolvedTag: 'Resolved',
	runbookTitle: 'Runbook, high error rate',
	runbook: [
		{ label: 'Open the error dashboard', result: 'Up from 0.3% to 38% at 02.58' },
		{ label: 'Check what changed', result: 'Release v2.4.1 went out at 02.57' },
		{ label: 'Roll back the release', result: 'Back on v2.4.0, errors falling' },
		{ label: 'Confirm, then resolve', result: 'Errors at 0.3%, incident closed' }
	],
	pmTitle: 'Post mortem, checkout errors',
	blameLine: 'Dimas shipped broken code',
	pmLines: [
		'A release missing one setting broke checkout',
		'Nothing checked that every setting was there',
		'Add that check, roll back by itself on spikes'
	],
	errorsLabel: 'errors',
	releaseTag: 'v2.4.1',
	panicBtn: 'Restart every server instead'
};
