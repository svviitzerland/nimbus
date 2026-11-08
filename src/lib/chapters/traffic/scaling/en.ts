import type { ScalingText } from '../types';

export const en: ScalingText = {
	title: 'Vertical vs horizontal scaling',
	intro: [
		'Your traffic keeps climbing and a single ordinary server starts to struggle. There are two ways to add power, and they work in very different styles.',
		'The first is <b>vertical scaling</b>. You make one machine stronger, adding CPU, RAM, and disk. It is easy to grow, but it hits a ceiling, and shrinking it back is awkward because the machine has to be switched off first.',
		'The second is <b>horizontal scaling</b>. Instead of one big machine, you run many identical machines and share the load through a load balancer. Adding or removing is easy, and if one dies the rest keep going.',
		'These two sides start from the exact same machine. Raise the visitor count until both struggle, then rescue the left side with Upgrade and the right side with Add.',
		'[ingat] Vertical scaling enlarges one server. Horizontal scaling adds more servers.'
	],
	reactions: {
		surge:
			'Visitors went up and the servers are starting to drown. Now save them both, the left side by upgrading the machine, the right side by adding machines.',
		vertical:
			'Vertical scaling makes the same single machine bigger, raising its CPU, RAM, and disk. Its capacity rises too. Keep upgrading until it tops out.',
		ceiling:
			'There it is, maxed out. The machine is as big as it gets and cannot grow further. That is the ceiling of vertical scaling, and it stays one point that takes everything down if it dies. Try Horizontal.',
		downgrade:
			'See, to shrink the machine it has to be switched off first, so the site goes down for a moment. Easy up, awkward down. That is the painful side of vertical scaling.',
		horizontal:
			'Horizontal scaling adds identical machines and the load balancer splits visitors evenly. Adding or removing is easy with nothing switched off, and if one machine dies the others keep serving.'
	},
	tabVertical: 'Vertical',
	tabHorizontal: 'Horizontal',
	hintVertical: 'Increase one server’s capacity',
	hintHorizontal: 'Increase the number of servers',
	trafficLabel: 'Visitors',
	levelCalm: 'Quiet',
	levelBusy: 'Busy',
	levelFlood: 'Heavy traffic',
	statusOk: 'Enough capacity',
	statusOver: 'Overwhelmed',
	promptRaise: 'Add visitors to see the capacity limit of each system.',
	promptRescue: 'Increase the server capacity on the left or the server count on the right.',
	promptDone:
		'Both are strong again, in very different ways. The left machine grew bigger, the right side got more machines.',
	specCpu: 'CPU',
	specRam: 'RAM',
	specDisk: 'Disk',
	perMachineSpec: 'Each machine 2 vCPU, 4 GB',
	capacity: 'Capacity of about {n} visitors',
	upgrade: 'Upgrade',
	downgrade: 'Shrink',
	maxedOut: 'Maximum capacity',
	siteDown: 'Site down briefly',
	addMachine: 'Add',
	removeMachine: 'Remove',
	balancerLabel: 'Load balancer',
	machineLabel: 'Machine {n}',
	tradeoffVertical:
		'Simple, but it hits a ceiling and shrinking it is awkward since the machine must go off first.',
	tradeoffHorizontal:
		'Flexible, easy to add or remove, and survives a machine dying. It needs a load balancer.'
};
