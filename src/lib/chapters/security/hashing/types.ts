import type { LessonText } from '../../types';

export interface HashingText extends LessonText {
	/** Short names for the two acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}
	nextAct: string;
	// act 1, two shops
	pwLabel: string; // caption over the password box
	pwPlaceholder: string;
	hashLabel: string; // caption before the live fingerprint
	tooShort: string; // template with {n}, characters still needed
	registerBtn: string;
	leakBtn: string;
	carelessName: string; // the shop that keeps passwords as they are
	carelessSub: string;
	nimbusName: string; // always nimbus.com
	nimbusSub: string;
	colUser: string;
	colPassword: string;
	youUser: string; // the learner's username in the table
	emptyRow: string; // shown in the table before signing up
	leakedTag: string; // stamped on a database once it leaks
	attackerReads: string; // the attacker reads the plain password
	attackerStuck: string; // the attacker only has a fingerprint
	attackerCracked: string; // the fingerprint was in a lookup table
	// act 2, salt
	lookupTitle: string;
	lookupSub: string;
	runLookup: string;
	addSalt: string;
	saltLabel: string;
	crackedTag: string;
	safeTag: string;
	usersTitle: string; // heading over the leaked user table
	usersTitleSalted: string;
}
