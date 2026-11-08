import type { LessonText } from '../../types';

/** Words on the meaning map. Where each one sits (and which family it belongs to) lives in the stage. */
export type EmbedWord =
	| 'cat'
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

export interface EmbeddingsText extends LessonText {
	/** The label shown for each word. */
	words: Record<EmbedWord, string>;
	shelf: string; // caption over the tray of words still to place
	pickHint: string; // nothing selected yet
	nearTitle: string; // template with {word}, heading of the nearest neighbours list
	vectorLabel: string; // template with {word}, introduces the word's numbers
	closeness: string; // template with {n}, how close a neighbour is in percent
	placed: string; // template with {n}, how many loose words found their home
	mapLabel: string; // aria label for the map
}
