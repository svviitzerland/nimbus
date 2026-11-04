import type { LessonText } from '../../types';

export interface AiSafetyPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface AiSafetyText extends LessonText {
	/** One panel per scene of the guided picture (eight scenes). */
	panels: AiSafetyPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** The chat window header. */
	botName: string;
	/** Part 1, the made up answer. */
	question: string;
	claimTrue: string;
	claimFake: string;
	sourceTitle: string;
	/** The real help page, the first line backs the true claim, the second one contradicts the fake. */
	sourceLines: [string, string];
	/** Part 2, the hidden order. */
	ask: string;
	fileName: string;
	review: string;
	hidden: string;
	hiddenTag: string;
	hijacked: string;
	safeReply: string;
	/** The three layers of defense, short labels under three shields. */
	shields: [string, string, string];
	/** Memory trick stamp over the chat. */
	memo: string;
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional switch on the last beat. */
	offBtn: string;
	onBtn: string;
}
