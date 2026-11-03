import type { ImageGenText } from './types';

export const en: ImageGenText = {
	title: 'Image generation',
	intro: [
		'You type "a cat on a sofa", and a few seconds later a picture appears that never existed before. So how does a computer <b>draw</b>?',
		'Surprisingly, it starts from <b>noise</b>. That is a square of totally random dots, like the static on an old TV. No picture hidden inside, just mess.',
		'During training the model learned one single skill. It was shown millions of photos with random dots sprinkled on top, and practised guessing which dots were the noise. Get good at that and you can <b>remove</b> a little noise from anything.',
		'Now run it the other way. Start from pure noise and clean a little, then a little more, step after step. At every step the model asks itself which dots would make this look more like the prompt.',
		'The <b>prompt</b> is the steering wheel. Your words get turned into numbers (a lot like [[embeddings|ai/embeddings]]), and every cleaning step leans towards them. Same noise with a different prompt grows a different picture.',
		'[fyi] This is called a <b>diffusion model</b>, the idea behind most image generators today. Real ones paint huge images over dozens of steps on a powerful [[GPU|ai/gpu]]. Ours is a tiny 16 by 16 grid so you can watch every dot.',
		'Pick a prompt, then clean the noise one step at a time. Watch which shows up first, the rough shapes or the small details.'
	],
	reactions: {
		prompt:
			'Prompt set. The canvas is still pure noise though, nothing has been drawn yet. Time to clean.',
		step: 'One step done. Hard to tell, right? Each step only takes away a little bit of noise.',
		shapes:
			'There! Big blobs of colour are showing up. Diffusion always settles the rough layout first, where the sky is and where the ground is.',
		details: 'Now the small stuff sharpens. Edges, eyes, a window. Details always come last.',
		clean:
			'Clean! A brand new picture out of pure noise, one small step at a time. Try fresh noise, or switch the prompt.',
		seed: 'Fresh noise, same prompt, and the picture comes out a little different. That starting noise is called the <b>seed</b>, which is why generating twice never gives the exact same image.',
		reprompt:
			'Same noise, different prompt, a totally different picture. The prompt steers every single step.'
	},
	promptLabel: 'Prompt',
	prompts: ['a cloud over the mountains', 'an orange cat', 'a small house'],
	pickPrompt: 'Pick a prompt below',
	stepBtn: 'Clean one step',
	autoBtn: 'Clean it all',
	seedBtn: 'Fresh noise',
	stepLabel: 'Step {n} of {total}',
	noiseLabel: '{n}% noise left',
	sliderLabel: 'Cleaning step',
	canvasLabel: 'The picture being generated',
	phase: {
		noise: 'Pure noise, no picture yet',
		shapes: 'Rough shapes are forming',
		details: 'Fine details are sharpening',
		done: 'Finished picture'
	}
};
