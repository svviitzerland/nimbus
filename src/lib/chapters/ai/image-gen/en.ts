import type { ImageGenText } from './types';

export const en: ImageGenText = {
	title: 'Image generation',
	intro: [
		'You type "a cloud over the mountains", and a few seconds later a picture appears that never existed before. So how does a computer <b>draw</b>?',
		'Surprisingly, it starts from <b>noise</b>. That is a square of totally random dots, like the static on an old TV. No picture hidden inside, just mess.',
		'During training the model learned one single skill. It saw millions of photos with random dots sprinkled on top, and practised guessing which dots were the noise.',
		'Now run it the other way. Start from pure noise and clean a little, then a little more, step after step. Watch closely, the rough shapes settle first, where the sky is and where the mountains are.',
		'Only near the end do the small details sharpen, the snow on a peak, the edge of the cloud.',
		'The <b>prompt</b> is the steering wheel. Your words get turned into numbers (a lot like [[embeddings|ai/embeddings]]), and every cleaning step leans towards them.',
		'[ingat] Image generation is a sculptor, not a painter. It starts with a block of noise and chips away everything that does not look like your prompt.',
		'[fyi] This is called a <b>diffusion model</b>. Real ones paint huge images over dozens of steps on a powerful [[GPU|ai/gpu]]. Each run starts from fresh random noise, called the <b>seed</b>, so the same prompt never gives the exact same picture twice.',
		'If you like, pick another prompt and watch the same noise grow into something completely different. Totally optional.'
	],
	reactions: {
		reprompt:
			'Same noise, different prompt, a totally different picture. The prompt steers every single step.'
	},
	panels: [
		{
			tag: 'Prompt',
			title: 'Words in, picture out',
			body: 'You describe the picture in plain words. A few seconds later a brand new image appears.'
		},
		{
			tag: 'Noise',
			title: 'Pure static',
			body: 'Every picture starts as random coloured dots. There is <b>nothing</b> hidden in there yet.'
		},
		{
			tag: 'Training',
			title: 'Learn to spot the noise',
			body: 'Take a real photo, sprinkle noise on it, and ask the model to guess the noise. Repeat millions of times.'
		},
		{
			tag: 'Cleaning',
			title: 'Rough shapes first',
			body: 'Each step removes a little noise. Big blobs of colour settle early, the layout of the picture.'
		},
		{
			tag: 'Cleaning',
			title: 'Details last',
			body: 'The final steps sharpen the small stuff, edges, snow, the outline of the cloud.'
		},
		{
			tag: 'Steering',
			title: 'The prompt guides every step',
			body: 'Your words become numbers. At each step the model asks which dots would make this look more like <b>them</b>.'
		},
		{
			tag: 'Remember',
			title: 'A sculptor',
			body: 'Start with a block of noise, chip away what does not belong. What is left is the picture.'
		},
		{
			tag: 'Good to know',
			title: 'The seed',
			body: 'Fresh noise, same prompt, a slightly different picture. That starting noise is called the <b>seed</b>.'
		},
		{
			tag: 'Try it',
			title: 'Change the prompt',
			body: 'Same starting noise, another prompt. Watch a different picture grow out of the same mess.'
		}
	],
	picture:
		'An image generator app with a prompt bar on top and a small square canvas of coloured dots that slowly turns from random noise into a picture.',
	prompts: ['a cloud over the mountains', 'an orange cat', 'a small house'],
	generate: 'Generate',
	stepLabel: 'Step {n} of {total}',
	noiseCaption: 'Pure noise',
	trainCaption: 'A training photo, noise sprinkled on',
	shapesCaption: 'Rough shapes',
	detailsCaption: 'Fine details',
	seedLabel: 'Seed {n}',
	memo: 'a sculptor',
	rule: 'Start with noise, chip away what does not belong',
	tryLabel: 'Pick a prompt'
};
