import type { LessonText } from '../../types';

export interface DetectionText extends LessonText {
	searchLabel: string; // accessible label and placeholder of the search box
	tryLabel: string; // caption before the suggested search words
	countLabel: string; // template with {n}, lines that match
	noMatch: string; // nothing matches the search
	tapHint: string; // nudges the learner to tap a line
	/** The panel about one address after tapping a line. */
	ipLines: string; // template with {n}, lines from this address
	ipFailed: string; // template with {n}, failed logins from this address
	ipUsers: string; // caption before the user names it tried
	markBtn: string; // marks the address as the attacker
	markedTag: string; // shown once the right address is marked
	siemBtn: string; // turns the hunt into a SIEM rule
	ruleTitle: string; // heading over the rule card
	ruleText: string; // the rule in plain words
	liveLabel: string; // small label while new lines stream in
	alertTitle: string; // heading of the alert the SIEM raises
	alertText: string; // template with {ip}
}
