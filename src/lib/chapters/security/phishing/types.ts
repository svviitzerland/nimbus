import type { LessonText } from '../../types';

/** The five emails in the pretend inbox, in the order they are shown. */
export type PhishingEmailId = 'invoice' | 'lookalike' | 'reset' | 'boss' | 'signin';

export interface PhishingEmail {
	fromName: string;
	fromAddr: string; // shown in full, the sender clue lives here
	time: string;
	subject: string;
	body: string;
	urgent: string; // the pressure sentence, empty when there is none
	cta: string; // the button inside the email
	url: string; // where that button really goes, revealed on peek
}

export interface PhishingText extends LessonText {
	inboxLabel: string;
	counter: string; // template with {n} and {total}
	peek: string; // reveals where the button really goes
	peekLabel: string; // caption before the real address
	noLink: string; // shown on peek when the email has no link at all
	markReal: string;
	markFake: string;
	nextEmail: string;
	again: string; // restart the inbox after the last email
	verdictRight: string;
	verdictWrong: string;
	realTag: string;
	fakeTag: string;
	/** Names for the three kinds of clue. */
	clues: { sender: string; link: string; urgency: string; none: string };
	scoreLabel: string; // template with {n} and {total}
	safeNote: string; // a calm reminder that nothing here is real
	emails: Record<PhishingEmailId, PhishingEmail>;
}
