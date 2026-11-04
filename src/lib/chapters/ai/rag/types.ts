import type { LessonText } from '../../types';

/** The nimbus.com documents on the shelf. */
export type RagDocId = 'refund' | 'pricing' | 'contact' | 'about';

export interface RagPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface RagText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: RagPanel[];
	/** Alt text for the whole picture. */
	picture: string;
	appTitle: string;
	you: string;
	ai: string;
	/** The customer's question. */
	question: string;
	/** The confident, made up answer from memory. */
	wrongAnswer: string;
	/** The answer read from the refund policy, templates with {days}. */
	answerNo: string;
	answerYes: string;
	/** Tag under the answer from memory. */
	fromMemory: string;
	/** Template with {doc}, tag under an answer read from a document. */
	source: string;
	/** Stamp on the made up answer. */
	madeUp: string;
	shelfTitle: string;
	/** Note on the shelf while the bot answers from memory. */
	unseen: string;
	searching: string;
	/** Template with {n}, how well a document matches the question. */
	match: string;
	/** Heading of the card that shows what the model reads. */
	readsTitle: string;
	docs: Record<RagDocId, { title: string; body: string }>;
	/** Labels under the two books on the remember scene. */
	closedBook: string;
	openBook: string;
	/** The rule of thumb shown on the remember scene. */
	rule: string;
	/** The optional button on the last scene, templates with {days}. */
	editBtn: string;
}
