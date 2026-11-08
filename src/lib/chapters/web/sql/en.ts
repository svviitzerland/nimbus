import type { SqlText } from './types';

export const en: SqlText = {
	title: 'What is SQL',
	intro: [
		'You already know that an SQL database keeps data in neat tables of rows and columns (remember [[SQL or NoSQL|resilience/database]]). But a table is only useful if you can ask it questions.',
		'That is what <b>SQL</b> is for (Structured Query Language, many people say it like "sequel"). It is a language for talking to a database. You write one short sentence called a <b>query</b>, and the database answers with the rows that fit.',
		'The shop on nimbus.com keeps its goods in a table called <b>products</b>. Every product is one row, and every column holds one fact about it, its name, its category, its price, and how many are left in stock.',
		'A query reads almost like English. <b>SELECT</b> says which columns you want, <b>FROM</b> says which table, <b>WHERE</b> keeps only the rows that pass a test, and <b>ORDER BY</b> sorts whatever is left.',
		'[fyi] SQL was born at IBM in the 1970s and it is still everywhere today. MySQL, PostgreSQL, and SQLite (the one quietly living inside your phone) all speak it, each with its own small accent.',
		'Use <b>aggregation</b> to summarize multiple rows. In the orders table, <b>GROUP BY city</b> groups orders by city. <b>COUNT(*)</b> counts orders and <b>SUM(total)</b> adds their values. Open the summary example below and run its query to compare the original rows with the result.',
		'[ingat] SELECT chooses columns, FROM specifies the table, WHERE filters rows, and ORDER BY sorts results.',
		'Your turn. The shop owner has four questions. Snap the blocks together into a query, run it, and see whether the answer fits.'
	],
	reactions: {
		all: 'There is the whole table. <b>SELECT *</b> means every column, the star is short for "all of them". Great for a quick peek, but on a real table with millions of rows you rarely want everything at once.',
		pick: 'Neater, right? Only the columns you asked for came back. Asking for less also means less data travelling from the database to the server, which keeps pages quick.',
		out: 'Found them, the products with nothing left. <b>WHERE</b> checks every single row and keeps only the ones that pass the test. Time to restock those two.',
		cheap:
			'Logically, <b>WHERE</b> selects matching rows, then <b>ORDER BY</b> sets their output order. A database may choose different execution strategies to produce the same result.',
		miss: 'The query ran fine, a database never complains about a valid question. It simply answered a different question than the ones on the list. Have another look at the blocks.',
		done: 'Four questions, four answers, and you never dug through the rows by hand. Every product page on nimbus.com runs a little query like these behind the scenes, many times a second.'
	},
	tableName: 'products',
	columns: { name: 'name', category: 'category', price: 'price', stock: 'stock' },
	products: [
		{ name: 'Nimbus Tee', category: 'shirt', price: 89000, stock: 12 },
		{ name: 'Cloud Cap', category: 'hat', price: 65000, stock: 0 },
		{ name: 'Nim Sticker', category: 'sticker', price: 15000, stock: 140 },
		{ name: 'Nimbus Mug', category: 'mug', price: 45000, stock: 30 },
		{ name: 'Cloud Hoodie', category: 'shirt', price: 189000, stock: 0 },
		{ name: 'Tote Bag', category: 'bag', price: 39000, stock: 8 }
	],
	shirtCategory: 'shirt',
	missionsLabel: "The shop owner's questions",
	missions: {
		all: 'Show the whole products table',
		pick: 'Just the name and price of every product',
		out: 'Which products are out of stock?',
		cheap: 'Products under 50000, cheapest first'
	},
	selectLabel: 'which columns',
	whereLabel: 'which rows',
	orderLabel: 'in what order',
	allColumns: 'all',
	noFilter: 'every row',
	noOrder: 'as stored',
	cheapFirst: 'cheapest first',
	priceyFirst: 'priciest first',
	alphabetical: 'A to Z',
	run: 'Run the query',
	queryLabel: 'query.sql',
	resultLabel: 'Result',
	rowsCount: '{n} rows',
	emptyResult: 'No rows match this query',
	allDone: 'All four questions answered',
	groupLabel: 'Summarize orders by city',
	tableLabel: 'Order rows',
	groupResult: 'GROUP BY result',
	groupRun: 'Run GROUP BY',
	orders: [
		{ city: 'Jakarta', total: 120000 },
		{ city: 'Bandung', total: 89000 },
		{ city: 'Jakarta', total: 45000 },
		{ city: 'Surabaya', total: 65000 },
		{ city: 'Bandung', total: 39000 },
		{ city: 'Jakarta', total: 15000 }
	]
};
