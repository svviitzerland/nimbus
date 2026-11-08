import type { LessonText } from '../../types';

/** Every place on the nimbus.com shop map an attacker could try. */
export type ThreatSpot =
	| 'phone'
	| 'wifi'
	| 'login'
	| 'server'
	| 'db'
	| 'admin'
	| 'vendor'
	| 'backup';

export interface ThreatsText extends LessonText {
	/** Each spot on the map, its short name, what could go wrong there, and the fix. */
	spots: Record<ThreatSpot, { name: string; threat: string; fix: string }>;
	tapHint: string; // shown before anything is marked
	compareBtn: string; // reveals Nim's own list
	compareNeed: string; // template with {n}, how many more marks before comparing
	score: string; // template with {n} and {total}
	missedLabel: string; // heading over the spots the learner did not mark
	threatLabel: string; // small caption before the threat
	fixLabel: string; // small caption before the fix
	foundTag: string; // a spot the learner marked
	missedTag: string; // a spot only Nim marked
	resetBtn: string; // clears the map
}
