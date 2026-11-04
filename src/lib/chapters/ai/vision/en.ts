import type { VisionText } from './types';

export const en: VisionText = {
	title: 'Computer vision',
	intro: [
		'Look at this drawing. You know it is a cat in a blink, without even thinking about it. But how could a computer ever work that out?',
		'A computer does not see a cat. It sees a grid of tiny squares called <b>pixels</b>, and every pixel is just a number for how dark or light it is. A photo is millions of those numbers, and nothing more.',
		'<b>Computer vision</b> is the part of AI that makes sense of pictures. It works in layers, a bit like a [[neural network|ai/neural-net]] stacked many times, and each layer builds on what the layer below it found.',
		'The first layer only looks for <b>edges</b>, the places where dark meets light. Flat ones, upright ones, slanted ones. Watch the drawing break into little strokes by itself.',
		'The next layer joins those edges into <b>shapes</b>. Two slants meeting at a point make a pointy ear, a ring of edges makes a round face, short flat lines make whiskers.',
		'The last layer looks at which shapes showed up together. Pointy ears plus a round face plus whiskers? That is a <b>cat</b>. Out comes the answer.',
		'[ingat] Think of it as building with blocks. <b>Edges, then shapes, then things.</b> Lines make shapes, shapes make things, small to big, one layer at a time.',
		'Here is the surprising part. Nobody told the layers to look for pointy ears. During training (with the same [[gradient descent|ai/learning-loop]] downhill steps) the model found by itself which edges and shapes are worth noticing, after seeing millions of labelled photos.',
		'[fyi] Your phone unlocking with your face, an app reading the text on a menu, a car spotting a person crossing the road, and a tool helping a doctor read an X ray all stack layers just like this.',
		'Want to see it again? Swap the drawing and watch the layers take it apart by themselves. Totally optional.'
	],
	reactions: {
		cat: 'Back to the cat. Same steps every time, edges first, then shapes, then the answer.',
		fish: 'A fish! Different edges, an oval body and a pointy tail, so the last layer lands on a different answer.',
		house:
			'A house. Straight upright edges make square walls, two slants make a roof. The layers did not change at all, only the picture did.'
	},
	panels: [
		{
			tag: 'The picture',
			title: 'Easy for you',
			body: 'Your eyes and brain spot the cat instantly. A computer has to build that answer up from nothing.'
		},
		{
			tag: 'Pixels',
			title: 'A grid of numbers',
			body: 'Each square is one <b>pixel</b>. A dark pixel is a big number, an empty one is zero. That grid is all the computer gets.'
		},
		{
			tag: 'Layer 1',
			title: 'Edges',
			body: 'Tiny detectors slide over the pixels and react to <b>edges</b>. The colours show the direction, <b>flat</b>, <b>upright</b>, or <b>slanted</b>.'
		},
		{
			tag: 'Layer 2',
			title: 'Shapes',
			body: 'Edges that fit together become <b>shapes</b>, like a point, a curve, or a ring. Still no idea what the picture is, only its parts.'
		},
		{
			tag: 'Layer 3',
			title: 'The thing',
			body: 'The last layer asks which shapes appear together. These parts together usually mean <b>cat</b>, so that is the answer.'
		},
		{
			tag: 'Remember',
			title: 'Edges, shapes, things',
			body: 'Small to big. Every layer only combines what the layer before it found.'
		},
		{
			tag: 'Training',
			title: 'Learned, not told',
			body: 'No one wrote a rule for ears. The layers tuned themselves on millions of photos until the useful edges and shapes stood out.'
		},
		{
			tag: 'Try it',
			title: 'Another drawing',
			body: 'Swap the drawing. The layers stay exactly the same, only the picture changes, and so does the answer.'
		}
	],
	objects: {
		cat: { name: 'cat', parts: ['pointy ears', 'round face', 'eyes', 'whiskers'] },
		fish: { name: 'fish', parts: ['oval body', 'pointy tail', 'eye', 'fin'] },
		house: { name: 'house', parts: ['square walls', 'pointy roof', 'door', 'windows'] }
	},
	edges: ['flat', 'upright', 'slanted'],
	layers: ['edges', 'shapes', 'thing'],
	guess: 'I think it is a {x}',
	rule: 'Edges, then shapes, then things.',
	another: 'Show me another drawing'
};
