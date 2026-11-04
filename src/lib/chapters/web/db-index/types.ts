import type { LessonText } from '../../types';

export interface DbIndexPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface DbIndexText extends LessonText {
	/** One panel per scene of the guided visual (seven scenes). */
	panels: DbIndexPanel[];
	/** Locale used to format the big numbers, e.g. en-US or id-ID. */
	locale: string;
	/** Table name as it appears in SQL. */
	tableName: string;
	/** The email being searched for, always on nimbus.com. */
	target: string;
	/** Small note under the grid of rows. */
	gridNote: string;
	/** Template with {n}. */
	rowsChecked: string;
	/** Template with {n}. */
	steps: string;
	found: string;
	/** The back of the book, a title and a few words with their page. */
	bookTitle: string;
	bookEntries: { word: string; page: number }[];
	/** The word the reader looks up, must be one of bookEntries. */
	bookWord: string;
	/** Template with {n}. */
	pageLabel: string;
	/** The sorted copy of the email column, alphabetical, the last one is the target. */
	sortedLabel: string;
	emails: string[];
	/** Template with {n}. */
	hop: string;
	/** Template with {n}, where the found entry points. */
	pointsTo: string;
	scanLane: string;
	indexLane: string;
	/** One label per table size, 1 thousand, 100 thousand, 1 million, 100 million. */
	sizes: [string, string, string, string];
	/** Template with {size}. */
	sizeLine: string;
	rule: string;
	/** The optional button on the last scene. */
	grow: string;
}
