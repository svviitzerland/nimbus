import type { LessonText } from '../../types';

/** The defenses the learner can switch on in act two. `caps` is the decoy that does nothing. */
export type AiSafetyDefense = 'mark' | 'strip' | 'limit' | 'caps';

export interface AiSafetyText extends LessonText {
	acts: [string, string]; // short names of the two acts, shown as tabs
	you: string; // label on the learner's chat bubble
	bot: string; // label on the bot's chat bubble
	// act one, the made up answer
	question: string;
	/** The bot's answer, one sentence each. The stage knows the third one is made up. */
	claims: string[];
	sourceTitle: string;
	sourceLines: string[];
	tapHint: string;
	okTag: string; // badge on a sentence the source backs up
	fakeTag: string; // badge on the made up sentence
	nextAct: string;
	// act two, the hidden instruction
	task: string; // what the learner asks the bot to do with the document
	docTitle: string;
	docLines: string[]; // the review as people see it
	docHidden: string; // the instruction hidden in white text
	hiddenTag: string;
	revealBtn: string;
	hideBtn: string;
	runBtn: string;
	thinking: string;
	defensesTitle: string;
	defenses: { id: AiSafetyDefense; name: string; sub: string }[];
	hijackedReply: string;
	safeReply: string;
	hijackedTag: string;
	safeTag: string;
}
