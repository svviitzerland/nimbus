import type { ApiStyleText } from '../../types';

export const en: ApiStyleText = {
	title: 'REST API',
	intro: [
		'REST is the most common API style. Each group of data has its own address (like /products), and the kind of request is marked by an action word called a <b>method</b>. A fit for most ordinary apps.',
		'Start with <b>GET</b>, to read data. The frontend asks the backend for the product list, the backend sends it back, and the list shows up on screen.',
		'Then <b>POST</b>, to create new data. The frontend sends a new product to the backend, the backend stores it, and that product joins the list.',
		'Then <b>PUT</b>, to change data that already exists. The frontend sends new details for product number 2, the backend replaces it, and the price changes on screen.',
		'Last, <b>DELETE</b>, to remove data. The frontend asks the backend to delete product number 2, and that product disappears from the list.',
		'[fyi] REST is really just a set of conventions on top of plain HTTP, described and named by Roy Fielding in 2000. Because it is simple and runs anywhere, it became the most widely used style.',
		'[ingat] REST names resources. The method describes the action on a resource.'
	],
	reactions: {},
	style: 'rest',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Replay'
};
