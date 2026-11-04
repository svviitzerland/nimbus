import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/attacks2/types';

/** The two emails the stage can show, the bait and the genuine one. */
export type PhishingKind = 'fake' | 'real';

export interface PhishingEmail {
	fromName: string;
	fromAddr: string; // shown in full, the sender clue lives here
	time: string;
	subject: string;
	body: string;
	urgent: string; // the pressure sentence, empty when there is none
	cta: string; // the button inside the email
	url: string; // where that button really goes
}

export interface PhishingText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	inboxLabel: string;
	/** Two calm older rows under the new email in the inbox. */
	olderRows: { from: string; subject: string }[];
	goesTo: string; // caption before the real address of the button
	/** The little tags that pop up next to each clue, for the fake and for the real email. */
	clues: Record<PhishingKind, { sender: string; urgency: string; link: string }>;
	rule: string; // the rule of thumb line
	pickLabel: string;
	modes: Record<PhishingKind, string>;
	emails: Record<PhishingKind, PhishingEmail>;
}
