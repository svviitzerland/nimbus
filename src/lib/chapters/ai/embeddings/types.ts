import type { LessonText } from '../../types';

/** Words on the meaning map. Where each one sits lives in the stage. */
export type EmbedWord =
	| 'cat'
	| 'kitten'
	| 'dog'
	| 'rabbit'
	| 'puppy'
	| 'king'
	| 'prince'
	| 'palace'
	| 'queen'
	| 'rice'
	| 'bread'
	| 'soup'
	| 'noodles'
	| 'server'
	| 'cloud'
	| 'website'
	| 'nimbus';

/** The four neighbourhoods of the map, like aisles in a supermarket. */
export type EmbedRegion = 'animals' | 'royals' | 'food' | 'tech';

export interface EmbeddingsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface EmbeddingsText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: EmbeddingsPanel[];
	/** Alt text for the map. */
	mapLabel: string;
	/** The label shown for each word. */
	words: Record<EmbedWord, string>;
	/** Aisle signs over each neighbourhood on the remember scene. */
	regions: Record<EmbedRegion, string>;
	/** Shown between two words that are far apart. */
	far: string;
	/** What the learner searches for on the search scene. */
	query: string;
	/** Small label on the search pin. */
	searchLabel: string;
	/** Template with {word}, introduces a word's long list of numbers. */
	manyLabel: string;
	/** Template with {n}, how many numbers a real embedding has. */
	manyCount: string;
	/** The rule of thumb shown on the remember scene. */
	rule: string;
	/** The optional button on the last scene, and the one that starts it over. */
	dropBtn: string;
	againBtn: string;
}
