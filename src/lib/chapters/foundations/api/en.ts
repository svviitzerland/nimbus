import type { ApiText } from '../../types';

export const en: ApiText = {
	title: 'Frontend, backend, and API',
	intro: [
		'A moment ago the browser got a whole web page. But the apps you use every day work differently. The part you see and tap, the list and the buttons, is the <b>frontend</b>.',
		'The frontend holds no real data. The actual products, prices, and accounts live on a computer far away, the <b>backend</b>. The frontend just shows things, the backend keeps them.',
		'The two connect through an <b>API</b>, a kind of waiter between them. The frontend asks for one thing, the API carries the request to the backend, the backend hands over the data, and it is brought back to the screen.',
		'See it yourself. Your phone screen is still empty because it has not asked for anything. Tap to fetch the data and watch it travel back and forth through the API until the screen fills in.',
		'[ingat] An API defines how applications request and exchange data.'
	],
	reactions: {
		fetch:
			'That is how an API works. The frontend asks, the backend that owns the data answers, and the screen fills in. Almost every app works like this. Later we will see that an API itself comes in a few styles.'
	},
	frontendLabel: 'Frontend',
	frontendSub: 'what you see',
	backendLabel: 'Backend',
	backendSub: 'where data lives',
	apiLabel: 'API',
	appTitle: 'Nimbus Shop',
	tableLabel: 'products',
	emptyHint: 'No data yet',
	fetchBtn: 'Fetch data from the server',
	reqLabel: 'get products',
	respLabel: 'product data',
	products: [
		{ id: 1, name: 'Cloud Sticker', price: 15000 },
		{ id: 2, name: 'Nimbus Cap', price: 90000 },
		{ id: 3, name: 'Server Tee', price: 120000 }
	]
};
