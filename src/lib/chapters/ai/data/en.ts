import type { DataText } from './types';

export const en: DataText = {
	title: 'Data and datasets',
	intro: [
		'Every AI you have ever met learned from a pile of examples. A spam filter studied old emails, face unlock studied photos of faces. Those examples are called <b>data</b>. Watch a few cat photos arrive.',
		'When the examples are gathered in one place, ready for learning, the collection is called a <b>dataset</b>. Each example gets a short note saying what it shows. That note is the <b>label</b>, the answer we want the machine to learn.',
		'Here is the catch. A <b>model</b> (the program that does the learning) believes every example completely. Someone labelled this dog as a cat, so the model will happily learn that this dog face is a cat face.',
		'[ingat] People say <b>garbage in, garbage out</b>. Cook with rotten ingredients and the dish is rotten too, no matter how good the chef is. A model is only as good as its examples.',
		'Real datasets are messy. A tired person clicked the wrong label, a photo came out blurry, the same photo got saved twice, and one photo has no label at all.',
		'So before any learning, people clean the data. First the wrong label gets fixed. That dog is not a cat.',
		'Next the blurry photo goes, because nobody can tell what is in it. The copy goes too, so that one photo does not count twice. And the empty label gets filled in.',
		'Fewer rows, but every one of them can be trusted now. Cleaning data like this is a huge part of real AI work, often bigger than building the model itself.',
		'[fyi] A dataset is not the same thing as a [[database|resilience/database]]. A database holds live data an app uses all day, while a dataset is a frozen collection put together just for learning (often exported from a database, funnily enough).',
		'Want to see it again? Mess the sheet up and let it clean itself one more time. Totally optional.'
	],
	reactions: {
		messy:
			'All the mess is back, a wrong label, a blurry photo, a copy, and an empty label. A model trained on this would learn the mistakes too.',
		clean:
			'Clean again! Same photos, same model, only better examples. Next, let us see how a machine actually [[learns from them|ai/training]].'
	},
	panels: [
		{
			tag: 'Data',
			title: 'Examples to learn from',
			body: '<b>Data</b> is any recorded fact, like a photo, a price, or a click. For AI it is the pile of examples the machine learns from.'
		},
		{
			tag: 'Dataset',
			title: 'Examples with labels',
			body: 'A <b>dataset</b> is the collection, often a big table. Each row is one example, and the <b>label</b> column holds the right answer.'
		},
		{
			tag: 'The catch',
			title: 'It trusts every row',
			body: 'The model cannot tell a wrong label from a right one. Whatever the table says, it learns.'
		},
		{
			tag: 'Make it stick',
			title: 'Garbage in, garbage out',
			body: 'Bad examples in, bad answers out. Good data matters more than a clever model.'
		},
		{
			tag: 'Messy',
			title: 'Four common problems',
			body: 'Wrong labels, blurry or broken examples, copies, and missing labels. Real datasets have all of them, thousands of times over.'
		},
		{
			tag: 'Cleaning 1',
			title: 'Fix wrong labels',
			body: 'Someone checks the labels and corrects the ones that are wrong.'
		},
		{
			tag: 'Cleaning 2',
			title: 'Remove and fill in',
			body: 'Examples that teach nothing (blurry ones, copies) are removed. Missing labels are filled in, or the row is dropped.'
		},
		{
			tag: 'Clean',
			title: 'Ready to learn from',
			body: 'A smaller, cleaner dataset beats a big messy one. Now a model can learn from it.'
		},
		{
			tag: 'By the way',
			title: 'Dataset or database',
			body: 'A <b>database</b> is alive and changes all day. A <b>dataset</b> is a snapshot, frozen so the learning can repeat the same way.'
		},
		{
			tag: 'Try it',
			title: 'Once more',
			body: 'Mess it up and watch it get cleaned again, step by step.'
		}
	],
	sheetName: 'cat_photos.csv',
	colPhoto: 'photo',
	colLabel: 'label',
	cat: 'cat',
	notCat: 'not a cat',
	problems: {
		wrong: 'wrong label',
		blurry: 'too blurry',
		copy: 'same as row 1',
		missing: 'no label'
	},
	count: '{n} examples',
	cleanCount: '{n} clean examples, ready to learn from',
	rule: 'Garbage in, garbage out.',
	messBtn: 'Mess it up again',
	cleanBtn: 'Clean it up',
	pics: { cat: 'a cat', dog: 'a dog', blurry: 'a blurry photo' }
};
