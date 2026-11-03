import type { LessonText } from '../../types';

/** The ingredients a prompt can gain. Each one fixes exactly one wish. */
export type Ingredient = 'task' | 'audience' | 'format' | 'example';

export interface PromptingText extends LessonText {
	goalTitle: string; // heading of the card with what you really want
	goal: string; // the wish in your head that the AI cannot see
	/** Short checklist label for each wish, one per ingredient. */
	wishes: Record<Ingredient, string>;
	/** The tappable chip and the line it adds to the prompt. */
	ingredients: Record<Ingredient, { chip: string; line: string }>;
	basePrompt: string; // the vague first prompt, replaced by the task line once added
	promptLabel: string; // caption over the prompt box
	addHint: string; // nudge under the chips
	sendBtn: string;
	you: string; // label on your chat bubble
	ai: string; // label on the AI's chat bubble
	score: string; // template with {n}, how many of the 4 wishes the answer met
	/** Pieces the pretend AI glues into its answer, depending on what the prompt said. */
	answer: {
		openVague: string;
		openTask: string;
		openAudience: string;
		bodyVague: string;
		bodyTask: string;
		ramble: string; // the long extra sentence it adds when nobody asked for short
		signoff: string; // the house style, only learned from the example
		tagsVague: string;
		tagsMany: string;
		tagsOne: string;
	};
}
