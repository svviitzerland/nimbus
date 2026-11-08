import type { DatabaseText } from '../types';

export const en: DatabaseText = {
	title: 'SQL or NoSQL?',
	intro: [
		'Data you use often usually lives in a database. There are two big families, and they store data in very different ways.',
		'<b>SQL</b> arranges data into tables of rows and columns. The rules are strict, every row must follow the same columns, and tables can link to each other. Being that tidy makes SQL the go to choice for transactions that must stay consistent, like money transfers.',
		'<b>NoSQL</b> stores free form documents. One document may carry different fields than its neighbor, and the whole set of documents stretches easily across many machines when the data explodes.',
		'Both already hold a little data. Add new rows and documents yourself, and feel the difference between the strict table and the flexible documents.',
		'[ingat] A database stores data so you can query and update it under clear rules.'
	],
	reactions: {
		sql: 'See, the new row must follow the existing columns, id, name, balance, nothing missing and nothing extra. That strictness suits money, the data always stays tidy and easy to check.',
		nosql:
			'This side is far more relaxed. The new document has a different shape and still gets accepted. That freedom is what makes NoSQL great for wildly varied data that needs to stretch across many machines.'
	},
	sqlTitle: 'SQL',
	sqlSub: 'Relational data in tables',
	nosqlTitle: 'NoSQL',
	nosqlSub: 'Document database example',
	tableName: 'accounts',
	columns: ['id', 'name', 'balance'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	extraRows: [
		['3', 'Sari', '40000'],
		['4', 'Tono', '67000']
	],
	addRow: 'Add a row',
	schemaNote: 'new rows must follow the same columns',
	docs: [
		{ name: 'post_1', fields: ['author', 'text', 'likes'] },
		{ name: 'post_2', fields: ['author', 'video', 'length'] },
		{ name: 'post_3', fields: ['author', 'poll', 'options', 'ends'] }
	],
	addDoc: 'Add a document',
	freeNote: 'every document may have its own shape',
	whenTitle: 'When to use it',
	sqlWhen: ['Money & transactions', 'Online stores', 'Data that links together'],
	nosqlWhen: ['Social media feeds', 'Catalogs of varied shapes', 'Data with varied structures'],
	done: 'Both examples tested'
};
