import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

export interface HashingText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	/** The example password and the same one with a single letter changed (beat 3). */
	examples: [string, string];
	/** The two people in the database and lookup scenes. */
	users: [string, string];
	dbTitle: string;
	colUser: string;
	colPassword: string;
	leakedTag: string;
	hashLabel: string;
	noWayBack: string;
	savedLabel: string; // the hash stored at sign up
	typedLabel: string; // the hash of what was typed at login
	matchTag: string;
	tableTitle: string; // the attacker's lookup table
	leakedHashLabel: string;
	crackedTag: string;
	saltLabel: string;
	sameTag: string; // two users, identical hashes
	noMatchTag: string; // salted hashes, nothing in the table
	slowTag: string;
	tryLabel: string;
	tryPlaceholder: string;
}
