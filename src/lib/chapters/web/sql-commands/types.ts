import type { LessonText } from '../../types';

/** The four families of SQL commands. */
export type SqlFamily = 'ddl' | 'dml' | 'dcl' | 'tcl';

export interface SqlCommandsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface SqlCommandsUser {
	id: number;
	name: string;
	email: string;
	city: string;
}

export interface SqlCommandsText extends LessonText {
	/** One panel per beat of the guided visual (nine scenes). */
	panels: SqlCommandsPanel[];
	/** Table and column names as they appear in SQL (identifiers, no spaces). */
	tableName: string;
	columns: { id: string; name: string; email: string; city: string };
	/** The rows the INSERT scene adds, in order. */
	users: SqlCommandsUser[];
	/** The new city the UPDATE scene writes. */
	newCity: string;
	/** One short word per family, shown under its chip. */
	familyWords: Record<SqlFamily, string>;
	/** The long name of each family, shown on the remember scene. */
	familyNames: Record<SqlFamily, string>;
	fileName: string;
	noTable: string;
	noRows: string;
	dropped: string;
	/** The DCL scene, two accounts and what they may do. */
	appLabel: string;
	staffLabel: string;
	/** The staff account name as it appears in SQL (an identifier). */
	staffUser: string;
	accessLabel: string;
	pending: string;
	saved: string;
	cheatLabel: string;
	rule: string;
}
