import type { SqlText } from './types';

export const en: SqlText = {
	title: 'What is SQL',
	intro: [
		'The shop on nimbus.com has to remember every product it sells. It keeps them in a <b>database</b>, a program whose only job is to store data safely and find it again. Inside, the products sit in a <b>table</b>. Watch it fill up.',
		'A table looks just like a spreadsheet. Every product is one <b>row</b>, and every <b>column</b> holds one fact about it, its name, its price, and how many are left in stock. But a table only helps if you can ask it questions.',
		'That is what <b>SQL</b> is for (Structured Query Language, many people say it like "sequel"). It is a language for talking to a database. You write one short sentence called a <b>query</b>, and the database answers. The simplest query asks for everything.',
		'Usually you do not need every column. The word after <b>SELECT</b> says which columns you want back, and <b>FROM</b> says which table to look in. Name and price, please, nothing else.',
		'Now a real question. Which products are sold out? <b>WHERE</b> adds a test, and the database checks it on every single row, one by one. Only the rows that pass come back.',
		'Last, <b>ORDER BY</b> sorts whatever is left. Products under 50000, cheapest first. The database always filters first and sorts after, so it never wastes time sorting rows it will throw away.',
		'Sometimes you want a summary, not rows. Here is the <b>orders</b> table, so how many orders came from each city? <b>GROUP BY</b> puts rows with the same city in one pile, <b>COUNT</b> counts each pile, and <b>SUM</b> adds up its totals. This is called <b>aggregation</b>.',
		'[ingat] Read a query top to bottom like a little shopping trip. SELECT says <b>what</b> you want, FROM says <b>where</b> it is, WHERE says <b>which ones</b>. What, where, which.',
		'[fyi] SQL was born at IBM in the 1970s and it is still everywhere. MySQL, PostgreSQL, and SQLite (the one quietly living inside your phone) all speak it, each with a small accent of its own. You will meet the other family of databases in [[SQL or NoSQL|resilience/database]].',
		'If you are curious, ask the table another question and watch the query write itself again. Totally optional, the shop is happy either way.'
	],
	reactions: {
		all: 'Everything, every column and every row. Handy for a quick peek, but on a real table with millions of rows you rarely want it all at once.',
		pick: 'Only name and price came back. Asking for less also means less data travelling to the server, so pages stay quick.',
		out: 'Two products with nothing left. WHERE checked all six rows and kept only those two. Time to restock.',
		cheap:
			'WHERE threw out the pricey ones first, then ORDER BY lined up the rest from cheapest. Filter first, sort after.'
	},
	panels: [
		{
			tag: 'Table',
			title: 'Rows and columns',
			body: 'Each <b>row</b> is one product. Each <b>column</b> is one fact. Every row has the same columns, so the table stays neat.'
		},
		{
			tag: 'Query',
			title: 'Give me everything',
			body: 'The star after <b>SELECT</b> means every column. <b>FROM</b> names the table. With no test, every row comes back.'
		},
		{
			tag: 'SELECT',
			title: 'Pick the columns',
			body: 'Only the columns listed after SELECT come back. The others stay in the table, untouched.'
		},
		{
			tag: 'WHERE',
			title: 'Keep the rows that pass',
			body: 'The database runs the test on each row in turn. Rows that pass light up, the rest are left out of the answer.'
		},
		{
			tag: 'ORDER BY',
			title: 'Sort what is left',
			body: 'After the filter, the leftover rows are lined up. Here by price, from cheapest to priciest.'
		},
		{
			tag: 'GROUP BY',
			title: 'Piles and summaries',
			body: 'Rows with the same city land in one pile. <b>COUNT(*)</b> says how many rows each pile has, <b>SUM(total)</b> adds up the money. One answer row per city.'
		},
		{
			tag: 'Make it stick',
			title: 'What, where, which',
			body: 'SELECT is what, FROM is where, WHERE is which ones, and ORDER BY is in what order. Four words, almost every query you will ever read.'
		},
		{
			tag: 'Try it',
			title: 'Ask another question',
			body: 'Each tap asks the table a new question. The query writes itself and the matching rows light up.'
		}
	],
	tableName: 'products',
	columns: { name: 'name', price: 'price', stock: 'stock' },
	products: [
		{ name: 'Nimbus Tee', price: 89000, stock: 12 },
		{ name: 'Cloud Cap', price: 65000, stock: 0 },
		{ name: 'Nim Sticker', price: 15000, stock: 140 },
		{ name: 'Nimbus Mug', price: 45000, stock: 30 },
		{ name: 'Cloud Hoodie', price: 189000, stock: 0 },
		{ name: 'Tote Bag', price: 39000, stock: 8 }
	],
	questions: {
		all: 'Show me the whole table',
		pick: 'Just the name and price of every product',
		out: 'Which products are sold out?',
		cheap: 'Products under 50000, cheapest first',
		group: 'How many orders per city, and how much in total?'
	},
	ordersTable: 'orders',
	orderColumns: { city: 'city', total: 'total' },
	orders: [
		{ city: 'Jakarta', total: 120000 },
		{ city: 'Bandung', total: 89000 },
		{ city: 'Jakarta', total: 45000 },
		{ city: 'Surabaya', total: 65000 },
		{ city: 'Bandung', total: 39000 },
		{ city: 'Jakarta', total: 15000 }
	],
	resultLabel: 'The answer, one row per city',
	questionLabel: 'The question',
	fileName: 'query.sql',
	rowsBack: '{n} rows came back',
	clauseTags: { select: 'what', from: 'where', where: 'which ones', order: 'in what order' },
	rule: 'SELECT is what, FROM is where, WHERE is which ones.',
	another: 'Ask another question'
};
