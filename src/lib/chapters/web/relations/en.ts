import type { RelationsText } from './types';

export const en: RelationsText = {
	title: 'Relations and JOIN',
	intro: [
		'In [[What is SQL|web/sql]] everything lived in one table. A real shop keeps more than one kind of thing though. There are <b>customers</b> and there are <b>products</b>, and each kind gets a table of its own.',
		'Then come the <b>orders</b>, who bought what. The lazy way is to copy the name onto every order. But Adi ordered twice, so his name is written twice, and the day he changes it you have to hunt down every copy. Miss one and the shop gets confused.',
		'So every table gives each row its own number, the <b>id</b>. It belongs to exactly one row and never changes, like a student number at school. This number is called the <b>primary key</b>.',
		'Now the orders table stops copying names. It only writes the customer number and the product number, like <b>customer_id 1</b>. A number that points at a row in another table is called a <b>foreign key</b>.',
		'Follow a number and you land on the right row. That link between two tables is a <b>relation</b>, which is why these are called relational databases. Watch each order point at its customer and its product.',
		'Numbers are hard for people to read, though. A <b>JOIN</b> follows the keys for you and stitches the tables back into one plain answer, who bought what.',
		"[ingat] A primary key is your own ID card number. A foreign key is that same number written down somewhere else, like on a parcel with your name on it. Your own number, primary. Someone else's number, foreign.",
		'[fyi] Many NoSQL databases skip joins and copy the data into each record instead, trading tidiness for speed. You can compare the two families in [[SQL or NoSQL|resilience/database]].',
		'If you like, rename Bima and watch every one of his orders follow along. Totally optional.'
	],
	reactions: {
		rename:
			'One row changed in customers, and every order of his shows the new name at once. Nothing was copied, so nothing can go out of date.',
		back: 'Back to Bima. Still one row, and every order follows it again.'
	},
	panels: [
		{
			tag: 'Tables',
			title: 'One table per kind of thing',
			body: 'Customers in one table, products in another. Each row is one person or one product.'
		},
		{
			tag: 'The problem',
			title: 'Copies everywhere',
			body: 'Writing the name on every order means the same fact lives in many places. Change it once and the other copies are wrong.'
		},
		{
			tag: 'Primary key',
			title: 'A number for every row',
			body: 'The <b>id</b> column gives each row a number no other row has. It is how the database tells rows apart.'
		},
		{
			tag: 'Foreign key',
			title: 'Point, do not copy',
			body: '<b>customer_id</b> and <b>product_id</b> hold the id of a row in another table. Just a number, never a copy of the name.'
		},
		{
			tag: 'Relation',
			title: 'Follow the numbers',
			body: 'Each line goes from a foreign key to the row it points at. Every order is just two arrows, one to a person and one to a thing.'
		},
		{
			tag: 'JOIN',
			title: 'Stitch it back together',
			body: 'A <b>JOIN</b> follows every key and builds one readable answer from the three tables.'
		},
		{
			tag: 'Make it stick',
			title: 'Own number, borrowed number',
			body: "The primary key is a row's own number. A foreign key is that number borrowed by another table to point back at it."
		},
		{
			tag: 'Try it',
			title: 'Change one row',
			body: 'Rename a customer in one place and the joined answer updates everywhere, because the orders only ever held a number.'
		}
	],
	customersTable: 'customers',
	ordersTable: 'orders',
	productsTable: 'products',
	idCol: 'id',
	nameCol: 'name',
	customerKey: 'customer_id',
	productKey: 'product_id',
	copiedCustomer: 'customer',
	copiedProduct: 'product',
	customers: ['Adi', 'Bima', 'Sari'],
	products: ['Nimbus Tee', 'Cloud Cap', 'Nim Sticker'],
	joinTitle: 'Who bought what',
	bought: '{who} bought a {what}',
	rule: 'Own number is primary, borrowed number is foreign.',
	rename: 'Rename {from} to {to}',
	renameBack: 'Change it back',
	newName: 'Bimo'
};
