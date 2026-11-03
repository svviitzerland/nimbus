import type { IncidentText } from './types';

export const en: IncidentText = {
	title: 'Incident response',
	intro: [
		"June 2017. At Maersk, the shipping giant that moves about a fifth of the world's sea cargo, screens suddenly turned black one after another. A piece of [[malware|security/malware]] called NotPetya was tearing through its network.",
		'Within hours, its port terminals stopped working and trucks queued for miles. Maersk had to rebuild about 4,000 servers and 45,000 computers in roughly ten days.',
		'[fyi] Its rescue came down to luck. The only surviving copy of one key server sat in Ghana, offline thanks to a power cut. Staff carried that drive all the way to the UK and rebuilt everything from it.',
		'When something like this hits, panic is the enemy. Teams follow a plan called <b>incident response</b>. First <b>check</b> what is really going on, <b>contain</b> it so it stops spreading, <b>clean</b> out the attacker, <b>recover</b> from a clean backup, and finally <b>learn</b> so it never happens the same way again.',
		'[fyi] In the cloud the steps stay the same, only the tools change. Containing a server can be one click that swaps its firewall rules. The provider handles incidents in its own buildings, yours are still yours, that is [[shared responsibility|networking/shared-responsibility]].',
		'Order matters, and the clock is ticking. The alarm is ringing at nimbus.com right now. Answer it, then pick the steps in the right order.'
	],
	reactions: {
		check:
			'Good, you looked before you jumped. Now you can see exactly which servers are hit and which are still healthy, so you know what to cut off.',
		contain:
			'Contained. The infected servers are pulled off the network, so the malware has nowhere left to go. The damage meter finally stops climbing.',
		clean:
			'Cleaned. The malware is removed and the hole it came through is patched. The servers are safe now, but still offline.',
		recover:
			'Recovered. Data comes back from a clean backup made before the attack, and nimbus.com is serving visitors again. This is why backups are kept somewhere the malware cannot reach.',
		doneGood:
			'Incident closed, and only a few servers got hit. The last step is the one teams skip most, writing down what happened without blaming anyone, and fixing the cause. Maersk did exactly that and now talks openly about its lessons.',
		doneSlow:
			'Incident closed, but a lot of servers got hit along the way. The last step, learning, is where you write down what went wrong, including the slow start, and practice so next time is faster. Run the drill again and try to beat it.',
		wrongContain:
			'Cut off what, exactly? You do not know yet which servers are hit, so you might pull the plug on healthy ones and miss the sick one. A minute spent checking first saves hours.',
		wrongClean:
			'While you were busy cleaning, the malware kept spreading to the servers next door. Stop the spread first, then clean.',
		wrongRecover:
			'The backup came back, and got infected again right away, because the malware and its way in were still there. Recover only after cleaning.',
		wrongLearn:
			'Writing the report while servers are still burning? Learning comes last, once the fire is out.',
		pay: 'Paying the ransom does not guarantee you get anything back, and it funds the next attack. Many victims who paid never got their data. Restoring from your own backup is the real way out.',
		hide: 'Switching off the alarm does not switch off the attack. The malware kept spreading in silence. Hiding an incident usually makes it far worse, and in many countries it is even against the law.'
	},
	alarmTitle: 'Alarm at nimbus.com',
	alarmSub: 'Files on the servers are turning into scrambled junk',
	answerBtn: 'Answer the alarm',
	serversLabel: 'Servers',
	damageLabel: 'Damage',
	planLabel: 'Your plan',
	pickHint: 'Tap the next step',
	steps: {
		check: { name: 'Check', sub: 'Find out which servers are hit' },
		contain: { name: 'Contain', sub: 'Cut the sick servers off the network' },
		clean: { name: 'Clean', sub: 'Remove the malware and patch the hole' },
		recover: { name: 'Recover', sub: 'Restore data from a clean backup' },
		learn: { name: 'Learn', sub: 'Write down what happened and fix the cause' },
		pay: { name: 'Pay the ransom', sub: 'Hope the attacker keeps their word' },
		hide: { name: 'Silence the alarm', sub: 'Keep quiet and hope nobody notices' }
	},
	stateHit: 'hit',
	stateCut: 'cut off',
	stateClean: 'clean',
	stateBack: 'back',
	restartBtn: 'Run the drill again',
	resultGood: '{n} of 6 servers hit, nicely handled',
	resultSlow: '{n} of 6 servers hit, a slow start'
};
