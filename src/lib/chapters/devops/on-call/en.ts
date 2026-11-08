import type { OnCallText } from './types';

export const en: OnCallText = {
	title: 'Incidents and on call',
	intro: [
		'Websites never sleep, so somebody has to be reachable when one breaks at three in the morning. That person is <b>on call</b>. Teams take turns, usually a week each, so nobody carries the phone forever.',
		'When an alarm from [[monitoring|compute/monitoring]] fires, it pages whoever is on call. The broken stretch of time is called an <b>incident</b>, and the first job is to stop the bleeding, not to find someone to blame.',
		'A <b>runbook</b> records investigation and response steps for a problem. Use metrics and logs to decide whether its steps suit the current incident.',
		'Once the fire is out, the team writes a <b>post mortem</b>, the story of what happened and what changes next. Good ones are <b>blameless</b>. People who fear blame hide their mistakes, and hidden mistakes come back.',
		'[fyi] Same word, different world. Security teams run incidents too, for a break in rather than a breakdown, in [[incident response|security/incident]]. And when a whole region goes dark, the plan is [[failover|resilience/failover]].',
		'[ingat] Check recent changes as one possible clue. Compare them with metrics and logs before concluding what caused the incident.',
		'Your phone is buzzing. You are on call tonight for nimbus.com. Answer it.'
	],
	reactions: {
		ack: 'Acknowledged. That tells the pager a human is on it, so it stops ringing and does not wake Sari next. Now open the runbook, and no freestyling.',
		panic:
			'Restarting everything feels like doing something, but the errors came right back. The bug lives in the new code, and a restart just runs the same broken code again. Stick to the runbook.',
		dash: 'The dashboard shows errors jumping out of nowhere at 02.58. Something must have changed just before. The runbook says look there next.',
		change:
			'A new release, v2.4.1, went out at 02.57, one minute before the errors started. That is your strongest clue.',
		rollback:
			'Rolled back, and the errors melt away. You do not have to understand the bug at three in the morning, you only have to get nimbus.com working again. The real fix can wait for daylight.',
		resolved:
			'Incident resolved, twelve minutes from page to fix. Go back to sleep. Tomorrow the team writes the post mortem together.',
		blame:
			'That one points at a person. Next time, people would hide their mistakes instead of sharing them. Ask what let the mistake through, not who made it.',
		postmortem:
			'That is a blameless post mortem. Nobody got punished, and the system gained a new safety net, so the same slip cannot get through twice. Teams like Google and Etsy made this way of working famous.'
	},
	acts: ['The alarm', 'The runbook', 'Post mortem'],
	pagerApp: 'Pager',
	alertTitle: 'nimbus.com errors at 38%',
	alertBody: 'Checkout is failing for most buyers',
	onCallNote: 'You are on call this week',
	escalateNote: 'No answer in 5 minutes and it calls Sari next',
	ackBtn: 'Acknowledge',
	ackedTag: 'acked',
	runbookBtn: 'Open the runbook',
	runbookTitle: 'Runbook, high error rate',
	errorsLabel: 'of requests failing',
	panicBtn: 'Restart every server',
	panicResult: 'Every server restarted, and the errors came straight back',
	steps: [
		{ label: 'Open the error dashboard', result: 'Errors jumped from 0.3% to 38% at 02.58' },
		{ label: 'Check what changed recently', result: 'Release v2.4.1 went out at 02.57' },
		{ label: 'Roll back to the last good release', result: 'Back on v2.4.0, errors falling' },
		{ label: 'Confirm it is healthy, then resolve', result: 'Errors at 0.3%, incident closed' }
	],
	rollingTag: 'rolling back',
	postBtn: 'Write the post mortem',
	pmTitle: 'Post mortem, checkout errors',
	timelineLabel: 'Timeline',
	timeline: [
		'02.57 release v2.4.1 goes out',
		'02.58 checkout errors start',
		'03.12 the alarm pages the on call engineer',
		'03.20 rollback to v2.4.0',
		'03.24 errors back to normal'
	],
	questions: [
		{
			q: 'What happened?',
			good: 'A release with a missing setting broke checkout for 26 minutes',
			bad: 'Dimas shipped broken code and took checkout down'
		},
		{
			q: 'Why did it get through?',
			good: 'No step in the pipeline checks that every setting is present',
			bad: 'Dimas was careless and did not double check'
		},
		{
			q: 'What do we change?',
			good: 'Add a settings check to the pipeline, and roll back by itself when errors spike after a release',
			bad: 'Dimas is not allowed to release anymore'
		}
	],
	nopeTag: 'that blames a person',
	pmDoneTag: 'Blameless post mortem, done',
	noteAlarm: 'Three in the morning, and your phone will not stop',
	noteAcked: 'The pager knows you are on it',
	noteRunbook: 'Follow the steps in order',
	noteFixed: 'nimbus.com is healthy again',
	notePm: 'Pick the answer that fixes the system, not the person',
	notePmDone: 'Written, shared, and nobody is in trouble'
};
