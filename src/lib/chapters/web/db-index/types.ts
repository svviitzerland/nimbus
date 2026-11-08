import type { LessonText } from '../../types';

export interface DbIndexText extends LessonText {
	/** Locale used to format the big numbers, e.g. en-US or id-ID. */
	locale: string;
	/** Table and column names as they appear in SQL. */
	tableName: string;
	emailCol: string;
	/** The email being searched for, always on nimbus.com. */
	target: string;
	sizeLabel: string;
	/** One label per table size, 1 thousand, 100 thousand, 1 million, 100 million. */
	sizes: [string, string, string, string];
	scanLane: string;
	scanSub: string;
	indexLane: string;
	indexSub: string;
	/** Template with {n}. */
	checked: string;
	foundTag: string;
	raceBtn: string;
	againBtn: string;
	/** Shown under the lanes once a race ends, templates with {x}. */
	fasterBy: string;
	tie: string;
	idle: string;
}
