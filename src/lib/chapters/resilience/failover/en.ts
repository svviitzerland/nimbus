import type { FailoverText } from '../../types';

export const en: FailoverText = {
	title: 'What is failover?',
	intro: [
		'Spreading across AZs is fine when one building falls. But if a whole region is hit, like when the data centers in the Middle East were struck, you need a bigger plan.',
		'The way to do it is to keep a <b>standby region</b> elsewhere. The primary region serves while the standby waits on standby. The moment the primary falls, traffic switches over to the standby. Switching to the standby is called <b>failover</b>, and it can be set up to run automatically, as you will see (sometimes it is done by hand).',
		'Think of a branch office that takes over the instant the head office closes. There is always a ready replacement.',
		'Right now there is only the primary region, no backup at all. Kill it, feel the damage, then set up its replacement.',
		'[ingat] Failover moves service when the primary fails. The backup must be ready first.'
	],
	reactions: {
		spof: 'Right, with no standby region your site goes down the moment the primary region falls. Click another region to make it a standby, then kill the primary again.',
		failover:
			'Seamless. The moment the primary region dies traffic moves to the standby region and your site keeps running. That is failover.'
	},
	primaryLabel: 'Primary',
	standbyLabel: 'Standby',
	serving: 'Serving',
	standbyState: 'Ready',
	failingOver: 'Failing over',
	kill: 'Kill the primary',
	addHint: 'Click another region to set up a standby',
	statusUp: 'Online',
	statusDown: 'Down',
	regions: { virginia: 'Virginia', singapore: 'Singapore' }
};
