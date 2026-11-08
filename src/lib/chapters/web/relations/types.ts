import type { LessonText } from '../../types';

export interface RelationsText extends LessonText {
	/** Table names as they appear in SQL (identifiers, no spaces). */
	customersTable: string;
	ordersTable: string;
	productsTable: string;
	/** Column names as they appear in SQL. */
	idCol: string;
	nameCol: string;
	customerKey: string; // the foreign key in orders pointing at customers
	productKey: string; // the foreign key in orders pointing at products
	/** Row values, ids come from their position (1, 2, 3). */
	customers: string[];
	products: string[];
	/** Short how to lines shown above the tables, one per phase. */
	hintPickKey: string;
	hintPickTarget: string; // template with {key}
	hintFollow: string;
	hintJoined: string;
	/** Shown when a target header is tapped before a key in orders. */
	hintKeyFirst: string;
	/** Shown in a link pill that is not made yet. */
	notLinked: string;
	joinBtn: string;
	joinedTitle: string;
	joinedCols: [string, string, string];
	queryLabel: string;
	headerHint: string; // accessible prefix for tappable column headers
}
