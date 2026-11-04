import type { CodeBasicsText } from './types';

export const en: CodeBasicsText = {
	title: 'Variables, functions, and lists',
	intro: [
		'Back to the kitchen from [[Programs and algorithms|basics/program]]. While making tea, a program has to remember things, like how many spoons of sugar. It keeps each one in a <b>variable</b>, a box with a name label that holds one value. This box is called sugar, and it holds 2.',
		'The value inside can change, and that is exactly why it is called a variable. Write sugar = 3, the 2 is thrown out and the 3 goes in. The label stays, only what is inside changes. In code, = means put this value in the box, not equals.',
		'[ingat] Picture the jars on a kitchen shelf, each with a sticker. The sticker is the <b>name</b>, and what sits inside the jar is the <b>value</b>. You ask for a jar by its sticker, and you get whatever is inside.',
		'Values come in a few kinds, called <b>data types</b>. A <b>number</b> you can count with, like 2. <b>Text</b> is letters inside quote marks, like "Nim" (programmers call it a string). And <b>true or false</b> answers a yes or no question, like is the water hot (this one is called a boolean).',
		'Sometimes one value is not enough. The steps of the recipe go into a <b>list</b> (also called an array), one long box that holds many values in order. Each value has a position number, and computers start counting at 0, so steps[0] is "cup".',
		'The second way to keep many values together looks like a contact card on your phone. Every value sits next to a <b>key</b>, a little name tag such as name, phone, or email. You find a value by its key instead of its position. Python calls this a <b>dictionary</b>, JavaScript calls it an <b>object</b>.',
		'Now the tea recipe itself. Instead of writing all its steps every single time, we wrap them up and give them a name, make_tea. That is a <b>function</b>, a recipe you can reuse. What goes in (how much sugar) is the <b>input</b>, and what comes back out (a cup of tea) is the <b>output</b>.',
		'To use it, you <b>call</b> the function by its name and put the input in brackets. make_tea(2) gives sweet tea, make_tea(0) gives plain tea. Written once, used as often as you like.',
		'[ingat] A function is like a rice cooker. Rice and water go in (the inputs), you press one button (you call it), and cooked rice comes out (the output). You never need to know what happens inside.',
		'Every program you will ever read is built from these pieces, named boxes, lists, cards, and recipes. If you like, pick how much sugar Nim wants and call make_tea yourself.'
	],
	reactions: {
		call: 'You called make_tea, and every step inside ran for you, in order. Same recipe, your own input, a fresh cup.',
		plain:
			'Zero sugar, so plain tea. The function did not change at all, only the input did, and that alone changed the output.'
	},
	panels: [
		{
			tag: 'Variable',
			title: 'A box with a name',
			body: 'A <b>variable</b> has a name (the label) and a value (what is inside). The code here is <b>Python</b>, a language that reads almost like English.'
		},
		{
			tag: 'Variable',
			title: 'The value can change',
			body: 'Put a new value in and the old one is gone. The name stays the same, so the rest of the program still finds it.'
		},
		{
			tag: 'Make it stick',
			title: 'Jars with stickers',
			body: 'Sticker is the <b>name</b>, the stuff inside is the <b>value</b>. Ask by sticker, get what is inside.'
		},
		{
			tag: 'Data types',
			title: 'Number, text, true or false',
			body: '<b>2</b> is a number, <b>"Nim"</b> is text (a string), and <b>True</b> is a yes or no answer (a boolean). Text always sits inside quote marks.'
		},
		{
			tag: 'List',
			title: 'Many values, in order',
			body: 'A <b>list</b> (or array) keeps values in a row. Each one has a position, counted from <b>0</b>, and you pick one with square brackets.'
		},
		{
			tag: 'Key and value',
			title: 'A contact card',
			body: 'Each value has a <b>key</b> next to it. You ask for the key, like email, and get its value back. Order does not matter here, the key does.'
		},
		{
			tag: 'Function',
			title: 'A reusable recipe',
			body: '<b>def</b> starts a function. The name is make_tea, the <b>input</b> goes in the brackets, and <b>return</b> hands back the <b>output</b>.'
		},
		{
			tag: 'Calling',
			title: 'Use it by its name',
			body: 'Write the name, put the input in brackets, and the whole recipe runs. A different input gives a different output.'
		},
		{
			tag: 'Make it stick',
			title: 'A rice cooker',
			body: 'In go rice and water, one button press, out comes rice. Inputs, a call, an output.'
		},
		{
			tag: 'Try it',
			title: 'Call make_tea yourself',
			body: 'Pick the spoons of sugar, then call the function. The recipe stays the same, only your input changes.'
		}
	],
	nameTag: 'name',
	valueTag: 'value',
	types: { number: 'number', text: 'text', bool: 'true or false' },
	listNote: 'Positions start at 0',
	cardTitle: 'Contact',
	cardNote: 'Find a value by its key',
	inputTag: 'input',
	outputTag: 'output',
	teaOut: 'tea with {n} sugar',
	plainOut: 'plain tea',
	reuseNote: 'Written once, used twice',
	cooker: { input: 'rice and water', button: 'cook', output: 'rice' },
	playHint: 'Spoons of sugar',
	callButton: 'Call make_tea'
};
