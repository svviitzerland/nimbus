import type { EmbeddingsText } from './types';

export const en: EmbeddingsText = {
	title: 'Embeddings',
	intro: [
		'A computer cannot feel what a word means. To it, "cat" and "kitten" are just different letters. So how does an AI know they are almost the same thing?',
		'The trick is to turn every word into a list of numbers, called an <b>embedding</b> (or a vector). Think of the numbers as coordinates, an address on a giant map of meaning.',
		'The model learns those addresses from billions of sentences. Words that show up in similar places get similar numbers, so they land <b>close together</b>. "Cat" lives next to "dog", far away from "server".',
		'[fyi] Real embeddings have hundreds or thousands of numbers each, not just two, so nobody can draw the true map. My map here is squashed down to two numbers so it fits on your screen.',
		'[fyi] The famous party trick, take the spot for "king", subtract "man", add "woman", and you land right next to "queen". Directions on the map can carry meaning too.',
		'[ingat] An embedding represents data with numbers. Vector proximity helps find similarity according to the model; it does not guarantee identical meaning.',
		'Four words are still on the shelf. Drag each one onto the map where it belongs (or tap it and use the arrow keys). The lines show its nearest neighbours, and tapping any word shows its numbers.'
	],
	reactions: {
		select:
			"Those two numbers are this word's embedding, its address on the map. The lines point to its closest neighbours, the words the AI thinks mean something similar.",
		wrong:
			'Hmm, look at its nearest neighbours there. Would you really say it means something like those? Slide it toward words that feel related.',
		puppy:
			'Yes, a puppy belongs with the animals! It sits near dog and cat, because the sentences about puppies sound a lot like the sentences about dogs.',
		queen:
			'Right in the royal corner. King, queen, and prince share the same kind of sentences (crowns, thrones, palaces), so their numbers end up close.',
		noodles:
			'Noodles with the food, of course. On a real map it would sit nearer to soup than to bread (both are slurpy), because embeddings capture shades of meaning, not just groups.',
		nimbus:
			'nimbus.com lands with server, cloud, and website. The AI has never heard of your site, but from the words around it, it can still tell what kind of thing it is.',
		all: 'Every word found its neighbourhood! This is how AI search works. Turn your question into numbers, then grab the closest documents. That idea powers [[RAG|ai/rag]], coming up next.'
	},
	words: {
		cat: 'cat',
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
	shelf: 'Drag these onto the map',
	pickHint: 'Tap any word to see its numbers and its nearest neighbours',
	nearTitle: 'Closest to {word}',
	vectorLabel: '{word} as numbers',
	closeness: '{n}% close',
	placed: '{n} of 4 placed',
	mapLabel: 'A map of word meanings'
};
