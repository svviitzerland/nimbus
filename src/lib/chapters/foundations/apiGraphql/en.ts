import type { ApiStyleText } from '../../types';

export const en: ApiStyleText = {
	title: 'GraphQL',
	intro: [
		'GraphQL is different from REST. Where REST has many addresses (endpoints), GraphQL needs just one, usually /graphql. To that one endpoint you name the exact data you want.',
		'You send a query that lists the fields, say name and price. Watch the query go and the server reply with just that, the name and the price.',
		'Use GraphQL when one screen needs many pieces of data at once and you want to be lean, fetching only what you need in a single trip.',
		'[fyi] GraphQL was built at Facebook in 2012 and released publicly in 2015. Their mobile app struggled with REST, one screen needed many requests and often too much data, so they made a way to ask for exactly the right amount.',
		'[ingat] A GraphQL query specifies the data and fields to return.'
	],
	reactions: {},
	style: 'graphql',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Replay'
};
