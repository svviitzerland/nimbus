import type { VisionText } from './types';

export const en: VisionText = {
	title: 'Computer vision',
	intro: [
		'To you, a photo of a cat is just a cat. To a computer, it is a giant grid of tiny coloured squares called <b>pixels</b>, millions of numbers and nothing more. So how does it ever spot the cat in there?',
		'<b>Computer vision</b> is the part of AI that makes sense of pictures, and it works like a [[neural network|ai/neural-net]] with many layers. Each layer looks at what the layer before it found and builds something a little bigger.',
		'The first layer only finds <b>edges</b>, places where light meets dark, flat ones, upright ones, slanted ones. The next layer combines edges into <b>shapes</b> like corners, curves, and circles. Deeper layers combine shapes into <b>objects</b>, two pointy ears plus whiskers plus round eyes, and out comes "cat".',
		'Nobody tells the layers what to look for. During training (with the same [[gradient descent|ai/learning-loop]] downhill steps) the network works out by itself which edges and shapes are worth noticing.',
		"[fyi] Your phone unlocking with your face, Google Lens reading a menu, a self driving car spotting a pedestrian, and a doctor's tool checking an X ray all stack layers just like this, only with millions of pixels.",
		'[ingat] In this example network, early layers detect simple patterns. Later layers combine them into more complex features.',
		'Draw on the 100-pixel grid, then inspect the patterns marked by each simulated layer. Change the drawing to compare results.'
	],
	reactions: {
		draw: 'Look at the first layer. Every pixel you filled is checked against its neighbours, side by side means a flat edge, stacked means an upright one, and diagonal means a slant.',
		loop: 'A closed loop! The second layer noticed your lines join up and wall in an empty space. That is a big clue for things like boxes, rings, eyes, and wheels.',
		line: 'It sees a line. Only one kind of edge, no corners, no loop, so the last layer is fairly sure.',
		cross:
			'A cross! Two strokes meeting in the middle make a crossing, and that one shape part decides the answer.',
		box: 'A box. Straight edges, about four corners, and a closed loop. Notice the guess changed only because the parts below it changed.',
		ring: 'A ring. A closed loop with lots of slants or little steps reads as round instead of square.',
		clear:
			'Clean slate. Every layer goes dark again, because there is nothing left for the edges to find.',
		done: 'Three different things recognised! Edges, then shapes, then objects. A real model does the same with a cat photo, only its layers learned their own edges and shapes from millions of examples.'
	},
	canvasLabel: 'Drawing grid, tap or drag to paint pixels',
	drawHint: 'Tap or drag on the grid to draw',
	clear: 'Clear',
	goal: '{n} of 3 things seen',
	layer1: 'Layer 1, edges',
	layer2: 'Layer 2, shapes',
	layer3: 'Layer 3, object',
	edges: ['flat', 'upright', 'slant', 'slant'],
	parts: ['straight', 'slants', 'corners', 'crossing', 'closed loop'],
	objects: ['line', 'cross', 'box', 'ring'],
	unsure: 'not sure yet',
	guess: 'I think it is a {x}'
};
