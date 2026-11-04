import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/attacks2/types';

export interface BruteForceText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	machineLabel: string;
	speedFast: string; // the machine's speed with nothing in its way
	speedLock: string; // the machine's speed once the login locks after a few tries
	listLabel: string; // shown on the machine screen while it reads the leaked list
	waitLabel: string; // shown on the machine screen while the lockout makes it wait
	letters: string; // template with {n}, the length of a password
	cracked: string;
	holding: string;
	onList: string; // tag for a password found on a leaked list
	/** How long the machine needs, each a template with {n} except instant. */
	units: {
		instant: string;
		seconds: string;
		minutes: string;
		hours: string;
		days: string;
		years: string;
		million: string;
		billion: string;
	};
	numberLocale: string; // how big numbers are written, 138,000 or 138.000
	rule: string; // the rule of thumb line
	sliderLabel: string; // caption of the optional length slider
}
