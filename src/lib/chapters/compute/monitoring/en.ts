import type { MonitoringText } from '../types';

export const en: MonitoringText = {
	title: 'Monitoring',
	intro: [
		'Think of a car dashboard. Speedometer, engine heat, fuel left. Without it you drive blind and only notice the engine overheating once it smokes.',
		'Servers are the same. <b>Metrics</b> are their health numbers, CPU usage, traffic, error count, and a <b>dashboard</b> shows them all on one screen.',
		'But you cannot stare at a dashboard all day. That is what <b>alarms</b> are for. You set a line, and the moment it is crossed, you are the first to know, long before visitors feel anything.',
		'The dashboard is live and all three numbers are still green. Make the traffic spike, and guess who shouts first.',
		'[ingat] Measure conditions, compare them with needs, and act when something is wrong.'
	],
	reactions: {
		alarm:
			'There it is. CPU crossed the line and the alarm reached you while visitors felt nothing yet. You get time to act before things fall apart. That is what monitoring buys you.'
	},
	cpuLabel: 'CPU',
	trafficLabel: 'Traffic',
	errorsLabel: 'Errors',
	ruleLabel: 'If CPU passes 80%, sound the alarm',
	surge: 'Make traffic spike',
	again: 'Calm it down',
	alarmTag: 'ALARM',
	notifText: 'CPU 92%, check your server!',
	statusOk: 'All calm',
	noteIdle: 'Your server’s three health numbers, all green',
	noteAlarm: 'The alarm fires before visitors notice'
};
