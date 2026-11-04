import type { LessonText } from '../../types';

/** The four ingredients of a good prompt, in the order the story adds them. */
export type PromptKey = 'task' | 'context' | 'format' | 'example';

export interface PromptingPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface PromptIngredient {
	/** Small tag shown next to the line in the prompt. */
	chip: string;
	/** The sentence this ingredient adds to the prompt. */
	line: string;
	/** The question the AI is left wondering about while this ingredient is missing. */
	question: string;
}

export interface PromptingText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: PromptingPanel[];
	/** Alt text for the whole picture. */
	picture: string;
	appTitle: string;
	you: string;
	ai: string;
	/** The first, vague prompt. */
	basePrompt: string;
	ingredients: Record<PromptKey, PromptIngredient>;
	/** Pieces the AI's caption is built from, depending on which ingredients are in the prompt. */
	answer: {
		openVague: string;
		openTask: string;
		openContext: string;
		openStyle: string;
		bodyVague: string;
		bodyTask: string;
		bodyContext: string;
		ramble: string;
		signoff: string;
		tagsVague: string;
		tagsMany: string;
		tagsOne: string;
	};
	/** Stamp on the answer, from worst to best. */
	grades: [vague: string, better: string, spotOn: string];
	/** The rule of thumb shown on the remember scene. */
	rule: string;
	/** Hint over the prompt on the optional last scene. */
	tryHint: string;
}
