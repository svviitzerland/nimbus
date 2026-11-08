import type { LessonText } from '../../types';

export type SqlMissionId = 'all' | 'pick' | 'out' | 'cheap';
export type SqlColumn = 'name' | 'category' | 'price' | 'stock';

export interface SqlProduct {
	name: string;
	category: string;
	price: number;
	stock: number;
}

export interface SqlText extends LessonText {
	groupLabel: string;
	tableLabel: string;
	groupResult: string;
	groupRun: string;
	orders: { city: string; total: number }[];

	/** Table name as it appears in the query (a SQL identifier, no spaces). */
	tableName: string;
	/** Column names as they appear in the query (SQL identifiers, no spaces). */
	columns: Record<SqlColumn, string>;
	/** The rows of the products table, ids are given by position. */
	products: SqlProduct[];
	/** The category value used by the category filter block, must match one product. */
	shirtCategory: string;
	missionsLabel: string;
	missions: Record<SqlMissionId, string>;
	/** Captions over the three block rows, shown after the SQL keyword. */
	selectLabel: string;
	whereLabel: string;
	orderLabel: string;
	/** Chip for "every column" (the star). */
	allColumns: string;
	/** Chip for no WHERE and for no ORDER BY. */
	noFilter: string;
	noOrder: string;
	/** Small words shown on the order chips. */
	cheapFirst: string;
	priceyFirst: string;
	alphabetical: string;
	run: string;
	queryLabel: string;
	resultLabel: string;
	/** Template with {n}. */
	rowsCount: string;
	emptyResult: string;
	allDone: string;
}
