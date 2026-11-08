import type { RelationsText } from './types';

export const en: RelationsText = {
	title: 'Relations and JOIN',
	intro: [
		'In [[What is SQL|web/sql]] everything lived in one table. A real shop has more than one kind of thing though. There are customers, there are products, and there are orders that tie the two together.',
		"You could cram it all into one giant table and write the customer's name and address again on every single order. But when Adi moves house, you would have to fix every row he ever bought, and missing one sends a parcel to the wrong door.",
		'So a relational database splits things up. Each table gets a <b>primary key</b>, usually a column called <b>id</b>, a number that belongs to exactly one row (like a ticket number at the bank).',
		"Then one table points at another by storing that number. An order does not copy Adi's name, it just says <b>customer_id 1</b>. That pointer is a <b>foreign key</b>, and the link it makes is called a <b>relation</b>.",
		'Plain numbers are hard for people to read, though. A <b>JOIN</b> follows the keys and stitches the tables back into one answer, like "Adi bought a Nim Sticker".',
		'[fyi] This is the "tables can link to each other" strength you saw in [[SQL or NoSQL|resilience/database]]. Many NoSQL databases skip joins and copy the data into each document instead, trading tidiness for speed.',
		'[ingat] A primary key uniquely identifies a row. A foreign key references a key in a related table. JOIN combines rows using a condition.',
		'Your turn. The orders table is nothing but numbers right now. Link each key to the table it points at, follow a few orders, then JOIN everything and see who bought what.'
	],
	reactions: {
		customer:
			'Linked. Every number under customer_id is now a pointer to one row in customers. customer_id 2 simply means "the customer whose id is 2".',
		product:
			'And product_id points into products. Now each order is just two arrows, one to a person and one to a thing.',
		wrong:
			'Not quite. A foreign key always points at the <b>primary key</b> of another table, its id column. Customer numbers live in customers, product numbers live in products.',
		follow:
			'See it light up? The order only stores two small numbers, yet by following them you find the person and the product. That is all a relation really is.',
		joined:
			'There it is, who bought what, in plain words. The database followed every key for you. And if Bima changes his name, you fix one row in customers and every one of his orders shows the new name at once.'
	},
	customersTable: 'customers',
	ordersTable: 'orders',
	productsTable: 'products',
	idCol: 'id',
	nameCol: 'name',
	customerKey: 'customer_id',
	productKey: 'product_id',
	customers: ['Adi', 'Bima', 'Sari'],
	products: ['Nimbus Tee', 'Cloud Cap', 'Nim Sticker'],
	hintPickKey: 'Tap a key column in orders',
	hintPickTarget: 'Now tap the column that {key} points at',
	hintFollow: 'Tap an order to follow its keys, or JOIN them all',
	hintJoined: 'Tap any order to see where its numbers came from',
	hintKeyFirst: 'Start with a key column in orders',
	notLinked: 'not linked yet',
	joinBtn: 'JOIN the tables',
	joinedTitle: 'Who bought what',
	joinedCols: ['order', 'customer', 'product'],
	queryLabel: 'join.sql',
	headerHint: 'Column'
};
