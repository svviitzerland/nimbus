import type { LessonText } from '../../types';

/** The nimbus.com documents on the shelf. How well each matches a question lives in the stage. */
export type RagDoc = 'refund' | 'pricing' | 'contact' | 'about';
/** The questions the learner can ask. */
export type RagQuestion = 'refund' | 'support';

export interface RagText extends LessonText {
	chunkLabel: string;
	vectorLabel: string;
	indexNote: string;

	appTitle: string; // header of the chat window
	modePlain: string; // toggle, the model on its own
	modeRag: string; // toggle, search the documents first
	askBtn: string;
	searching: string; // shown while the documents are being searched
	you: string;
	ai: string;
	source: string; // template with {doc}, where the answer came from
	noSource: string; // tag under a plain answer, nothing backs it up
	shelfTitle: string; // heading over the documents
	unseen: string; // the documents are invisible to the model on its own
	attached: string; // badge on the document pasted into the prompt
	match: string; // template with {n}, how well a document matches the question
	daysLabel: string; // aria label for the refund days stepper
	fewer: string;
	more: string;
	docs: Record<RagDoc, { title: string; body: string }>; // refund body is a template with {days}
	questions: Record<RagQuestion, { chip: string; ask: string; plain: string; rag: string }>;
	/** The refund answer from the document flips once the window covers the 20 days. */
	refundYes: string; // template with {days}
}
