import type { LessonText } from '../../types';

/** The five lines of Nim's tea recipe. */
export type TeaStepId = 'cup' | 'bag' | 'boil' | 'pour' | 'stir';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface ProgramText extends LessonText {
	/**
	 * One panel per scene of the guided visual, in story order (nine panels). The second one is
	 * the short history of algorithms.
	 */
	panels: GuidePanel[];
	/** The history scene, three people on a small timeline, oldest first. */
	history: {
		heading: string;
		people: { year: string; name: string; place: string; body: string }[];
		/** How the name turned into the word, shown as small chips. */
		word: string[];
	};
	/** Heading of the recipe card while it is still plain words. */
	recipeTitle: string;
	/** Heading of the same card once it is written for a computer. */
	programTitle: string;
	/** The recipe in plain words, one line per step. */
	steps: Record<TeaStepId, string>;
	/** Short labels inside the flowchart. */
	flow: {
		start: string;
		cup: string;
		bag: string;
		hot: string;
		boil: string;
		pour: string;
		sweet: string;
		stir: string;
		done: string;
		yes: string;
		no: string;
	};
	/** The three building blocks and the little word that gives each one away. */
	blocks: Record<'sequence' | 'choice' | 'repetition', { name: string; word: string }>;
	/** The small rule of thumb line under the finished flowchart. */
	rule: string;
	/** The optional swap on the last beat. */
	swap: string;
	unswap: string;
	/** Caption under the kitchen. */
	result: { idle: string; working: string; tea: string; spill: string };
}
