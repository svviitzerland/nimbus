import type { EmbeddingsText } from './types';

export const en: EmbeddingsText = {
	title: 'Embeddings',
	intro: [
		'A computer cannot feel what a word means. To it, "cat" and "dog" are just letters, no closer to each other than to "server". So how does an AI know that cat and dog are both pets, while a server is something else entirely?',
		'The trick is to turn every word into a list of numbers, called an <b>embedding</b>. Think of those numbers as an address, a spot on a giant map of meaning.',
		'The model learns the addresses by reading billions of sentences. Words that show up in similar sentences get similar numbers, so they settle <b>close together</b>. Watch them find their places.',
		'Now distance means something. Cat sits right next to kitten and dog, and far away from server. The computer simply measures how far apart two spots are, no feelings needed.',
		'This is how AI can search by meaning. Type "fluffy pet", turn it into numbers too, and drop it on the map. The closest words win, even though none of them contain the letters "fluffy pet". That idea powers [[RAG|ai/rag]], coming up next.',
		'[ingat] The meaning map is a supermarket. Things that belong together sit in the same aisle, so once you find one, the rest are close by. Close on the map, close in meaning.',
		'[fyi] A real embedding has hundreds or even thousands of numbers, not just two, so nobody can draw the true map. Mine is squashed down to two numbers so it fits on your screen. The idea stays exactly the same.',
		'Want to place a few new words? Drop one in and see which aisle it lands in. Totally optional.'
	],
	reactions: {
		puppy:
			'A puppy lands with the animals, right by dog and cat. Sentences about puppies sound a lot like sentences about dogs, so their numbers end up close.',
		queen:
			'Straight to the royal aisle. King, queen, and prince share the same kind of sentences (crowns, thrones, palaces), so their numbers sit together.',
		noodles:
			'Noodles join the food, snuggled up to soup. Embeddings capture shades of meaning, and both of them are a bit slurpy.',
		nimbus:
			'nimbus.com lands with server, cloud, and website. The AI has never heard of your site, but from the words around it, it can still tell what kind of thing it is.'
	},
	panels: [
		{
			tag: 'The problem',
			title: 'Just letters',
			body: 'To a computer a word is only a row of letters. Nothing in the letters says that cat and dog are both pets.'
		},
		{
			tag: 'Embedding',
			title: 'A word becomes numbers',
			body: 'Each word gets a list of numbers, its <b>embedding</b>. Here every word has two, so they work like an address on a map.'
		},
		{
			tag: 'Learning',
			title: 'Similar words settle together',
			body: 'Words used in similar sentences get similar numbers. Animals gather in one corner, food in another, tech in a third.'
		},
		{
			tag: 'Distance',
			title: 'Near means similar',
			body: 'The short lines link cat to its closest neighbours. The long one reaches all the way to server, which means something very different.'
		},
		{
			tag: 'Search',
			title: 'Find by meaning',
			body: 'The question becomes numbers too. Whatever sits closest to it is the best match, even with no shared letters.'
		},
		{
			tag: 'Remember it',
			title: 'A supermarket of words',
			body: 'Similar things share an aisle. Close on the map means close in meaning.'
		},
		{
			tag: 'Real size',
			title: 'Many more numbers',
			body: 'Real embeddings use hundreds or thousands of numbers per word. More numbers means more room for shades of meaning.'
		},
		{
			tag: 'Try it',
			title: 'Drop a new word',
			body: 'Each new word lands where its meaning fits. The lines show its closest neighbours.'
		}
	],
	mapLabel: 'A map of word meanings where similar words sit close together',
	words: {
		cat: 'cat',
		kitten: 'kitten',
		dog: 'dog',
		rabbit: 'rabbit',
		puppy: 'puppy',
		king: 'king',
		prince: 'prince',
		palace: 'palace',
		queen: 'queen',
		rice: 'rice',
		bread: 'bread',
		soup: 'soup',
		noodles: 'noodles',
		server: 'server',
		cloud: 'cloud',
		website: 'website',
		nimbus: 'nimbus.com'
	},
	regions: { animals: 'Animals', royals: 'Royals', food: 'Food', tech: 'Tech' },
	far: 'far',
	query: 'fluffy pet',
	searchLabel: 'search',
	manyLabel: '{word} as numbers',
	manyCount: 'and so on, {n} numbers in total',
	rule: 'Close on the map, close in meaning',
	dropBtn: 'Drop a new word',
	againBtn: 'Start over'
};
