import type { OltpOlapText } from './types';

export const en: OltpOlapText = {
	title: 'OLTP and OLAP',
	intro: [
		'The shop on nimbus.com is busy. Every few seconds somebody taps buy, and a new order lands in the <b>app database</b>, the one the website talks to. Watch the orders pile in.',
		'Each order is a tiny job. Write one row, maybe read one row back, done in a couple of milliseconds. Lots of small, quick writes all day long is called <b>OLTP</b> (Online Transaction Processing).',
		'Then the boss asks a big question. How much did we sell each month this year? That means reading millions of rows at once. Run it on the app database and checkout slows down for every shopper.',
		'So big questions get their own place. A second database, built for reading huge amounts, answers them while the shop keeps selling. This side is called <b>OLAP</b> (Online Analytical Processing).',
		'Why can OLAP read so fast? It is about how data sits on the disk. The app database uses <b>row storage</b>, each order kept together in one block. Grabbing one order is one quick read, but adding up every total means opening every block.',
		'OLAP uses <b>column storage</b>. All the ids sit together, all the items together, all the totals together. Adding up every total now opens just one block, while grabbing a single order gets slow. Each side is fast at its own job.',
		'This analytics database has a name, a <b>data warehouse</b>. It collects data from many places (orders, users, even ads) so every big question can be answered in one spot.',
		'How does the data get there? Every night a job called <b>ETL</b> copies it over. <b>Extract</b> takes the new rows, <b>Transform</b> tidies them up, and <b>Load</b> puts them in the warehouse. By morning the charts are fresh.',
		'[ingat] OLTP is the <b>cashier</b>, quick with one customer at a time. OLAP is the <b>accountant</b> at month end, slowly reading every receipt. T for transaction, A for analytics.',
		'[fyi] You will meet these names out there. PostgreSQL and MySQL usually run the app side, while BigQuery, Snowflake, and ClickHouse are popular warehouses. Same SQL you already know, built for a different job.'
	],
	reactions: {},
	panels: [
		{
			tag: 'App database',
			title: 'Orders coming in',
			body: 'The website saves every order in the app database the moment it happens. Shoppers expect it to feel instant.'
		},
		{
			tag: 'OLTP',
			title: 'Many small, quick jobs',
			body: 'Each order touches <b>one row</b>. Thousands of these per minute, each one finished in milliseconds.'
		},
		{
			tag: 'The problem',
			title: 'A big question',
			body: 'Sales per month reads <b>every order of the year</b>. While the database is busy with that, the shoppers have to wait.'
		},
		{
			tag: 'OLAP',
			title: 'A place for big questions',
			body: 'Analytics gets its own database. It can chew on millions of rows and the shop never notices.'
		},
		{
			tag: 'Row storage',
			title: 'One order per block',
			body: 'Every order is kept together. Perfect for reading or writing <b>one order</b>, slow for adding up one column across all of them.'
		},
		{
			tag: 'Column storage',
			title: 'One column per block',
			body: 'Every column is kept together. Perfect for adding up <b>one column</b> over millions of rows, slow for fetching one whole order.'
		},
		{
			tag: 'Warehouse',
			title: 'Everything in one spot',
			body: 'A <b>data warehouse</b> gathers data from many systems, tidied up and ready for questions, charts, and reports.'
		},
		{
			tag: 'ETL',
			title: 'The night shift',
			body: '<b>E</b>xtract the new rows, <b>T</b>ransform them (fix formats, drop test orders), <b>L</b>oad them into the warehouse. Usually while everyone sleeps.'
		},
		{
			tag: 'Remember it',
			title: 'Cashier and accountant',
			body: 'OLTP writes small and fast, all day. OLAP reads big and deep, a few times a day.'
		},
		{
			tag: 'Real names',
			title: 'Who does which job',
			body: 'App databases like PostgreSQL and MySQL for OLTP. Warehouses like BigQuery, Snowflake, and ClickHouse for OLAP.'
		}
	],
	shoppers: 'Shoppers',
	appDb: 'App database',
	analytics: 'Analytics',
	warehouse: 'Data warehouse',
	etl: 'ETL',
	clock: '2 AM',
	busy: 'busy',
	ordersTable: 'orders',
	columns: { id: 'id', item: 'item', total: 'total' },
	orders: [
		{ id: 5012, item: 'Nimbus Tee', total: 89 },
		{ id: 5013, item: 'Nimbus Mug', total: 45 },
		{ id: 5014, item: 'Cloud Cap', total: 65 },
		{ id: 5015, item: 'Tote Bag', total: 39 }
	],
	ordersToday: 'Orders today',
	locale: 'en-US',
	writeTag: '1 row, 2 ms',
	question: 'How much did we sell each month this year?',
	questionLabel: 'The big question',
	reading: 'Reading {n} rows',
	slowNote: 'Shoppers are stuck at checkout',
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
	answerNote: 'Answered by analytics, the shop never slowed down',
	rowStore: 'Row storage',
	colStore: 'Column storage',
	blockLabel: 'block',
	readOne: 'Read order 5013',
	readSum: 'Add up every total',
	opened: 'Opened {n} blocks',
	sources: ['orders', 'users', 'ads'],
	warehouseNote: 'One place for every big question',
	etlSteps: [
		{ key: 'E', name: 'Extract', say: "Copy yesterday's new orders" },
		{ key: 'T', name: 'Transform', say: 'Tidy them, drop test orders' },
		{ key: 'L', name: 'Load', say: 'Put them in the warehouse' }
	],
	oltp: {
		name: 'OLTP',
		full: 'the app side',
		like: 'the cashier',
		points: ['Many small writes', 'One row at a time', 'Done in milliseconds'],
		examples: ['PostgreSQL', 'MySQL']
	},
	olap: {
		name: 'OLAP',
		full: 'the analytics side',
		like: 'the accountant',
		points: ['A few huge reads', 'Millions of rows', 'Seconds are fine'],
		examples: ['BigQuery', 'Snowflake', 'ClickHouse']
	},
	examplesLabel: 'Popular picks'
};
