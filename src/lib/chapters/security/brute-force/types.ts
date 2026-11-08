import type { LessonText } from '../../types';

export interface BruteForceText extends LessonText {
	passLabel: string;
	passPlaceholder: string;
	passHint: string; // reminds the learner to make one up
	lockLabel: string; // the lockout switch
	runBtn: string;
	emptyPass: string; // shown when the box is empty
	machineLabel: string;
	targetLabel: string; // the pretend login being attacked
	lockedTag: string; // flashes on the login while it is locked
	/** Character kinds the machine has to cover. */
	kinds: { lower: string; upper: string; digits: string; symbols: string };
	lengthStat: string; // template with {n}
	combosStat: string; // caption under the number of possible passwords
	speedFast: string; // the machine's speed without a lockout
	speedLock: string; // the machine's speed with a lockout
	resultLabel: string; // heading over the time it needs
	leakedTitle: string;
	leakedSub: string; // template with {n}, which entry on the leaked list
	verdicts: { leaked: string; fast: string; medium: string; strong: string };
	/** Time units, each a template with {n} except instant and forever. */
	units: {
		instant: string;
		seconds: string;
		minutes: string;
		hours: string;
		days: string;
		years: string;
		million: string;
		billion: string;
		forever: string;
	};
	historyLabel: string;
	lockShort: string; // tiny tag in the history row for a run with the lockout on
	goals: string[]; // two goals, a strong result and a run with the lockout
}
