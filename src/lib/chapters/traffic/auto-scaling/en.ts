import type { AutoScalingText } from '../types';

export const en: AutoScalingText = {
	title: 'Auto scaling',
	intro: [
		'In the last lesson you were the one pressing Add when the servers drowned. The problem is that traffic can spike at 2 am while you are asleep. You cannot stay up all night babysitting servers.',
		'<b>Auto scaling</b> is a robot that stays up for you. It watches one number, usually <b>CPU</b>, how hard your machines are thinking. It can also watch RAM or the number of requests.',
		'You just hand it a rule. Say if CPU goes past 70 percent, add one machine. If it drops below 30 percent, remove one. New machines automatically get their share of traffic from the load balancer you met earlier.',
		'The robot is already on watch. The traffic is alive, rising and falling on its own like real visitors, and you can nudge it with plus and minus. Just watch who does the work.'
	],
	reactions: {
		'scaled-up':
			'Visitors are pouring in and CPU crossed 70 percent. The rule lit up, and machines were added on their own until the load was healthy again.',
		'scaled-down':
			'Quiet again, CPU sank below 30 percent, and the machines were sent home one by one. The cost dropped with them. You only pay for what actually runs.'
	},
	trafficLabel: 'visitors',
	plusLabel: 'Add visitors',
	minusLabel: 'Remove visitors',
	balancerLabel: 'Load balancer',
	ruleTitle: 'The robot’s rule',
	cpuLabel: 'CPU',
	condUp: 'Above 70%',
	actUp: 'Add a machine',
	condDown: 'Below 30%',
	actDown: 'Remove one',
	addEvent: '1 new machine',
	removeEvent: '1 machine off',
	costLabel: 'Cost ${n} per hour',
	promptRaise:
		'The traffic is alive, rising and falling by itself. Wait and see, or nudge it with plus and minus.',
	promptWatch: 'CPU crossed the line. The robot is adding machines by itself, just sit back.',
	promptDrop:
		'The load is healthy again. When the traffic dips later, machines will be removed on their own too.',
	promptDone: 'Up by itself when busy, down by itself when quiet. You pay for what you use.'
};
